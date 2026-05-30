const express = require('express');
const app = express();
const request = require('request');
const client = require('prom-client');

// Prometheus - collect default metrics
client.collectDefaultMetrics();

//ejs
app.set("view engine", 'ejs');

// Prometheus - metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

//routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, response) => {
    const person = req.query.person;

    if (!person) {
        return response.status(400).send('Please enter a person name');
    }

    // Use Wikipedia summary API directly
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(person)}`;

    const options = {
        url: url,
        headers: {
            'User-Agent': 'simple-nodejs-app/1.0.0 (https://github.com/rat9615/simple-nodejs-app)'
        }
    };

    request(options, (err, res, body) => {
        if (err) {
            return response.status(500).send('Error fetching data from Wikipedia');
        }

        try {
            const result = JSON.parse(body);

            if (result.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') {
                return response.status(404).send('No results found for: ' + person);
            }

            // Return clean summary result
            const data = {
                title: result.title,
                description: result.description,
                summary: result.extract,
                thumbnail: result.thumbnail ? result.thumbnail.source : null,
                url: result.content_urls ? result.content_urls.desktop.page : null
            };

            response.send(data);

        } catch (e) {
            return response.status(500).send('Error parsing response: ' + e.message);
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

//port
app.listen(3000, console.log("Listening at port 3000..."))