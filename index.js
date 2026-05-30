const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');
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
app.get('/', (req,res) =>{
    res.render('index');
});

app.get('/index', (req,response) =>{
    let url = "https://en.wikipedia.org/w/api.php"
    let params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    }

    url = url + "?"
    Object.keys(params).forEach( (key) => {
        url += '&' + key + '=' + params[key]; 
    });

    // User-Agent header to comply with Wikipedia API policy
    const options = {
        url: url,
        headers: {
            'User-Agent': 'simple-nodejs-app/1.0.0 (https://github.com/rat9615/simple-nodejs-app)'
        }
    };

    //get wikip search string
    request(options,(err,res, body) =>{
        if(err) {
            return response.status(404).send('Error fetching data from Wikipedia');
        }

        try {
            result = JSON.parse(body);

            // Check if result exists
            if (!result[3] || !result[3][0]) {
                return response.status(404).send('No results found for: ' + req.query.person);
            }

            x = result[3][0];
            x = x.substring(30, x.length); 

            //get wikip json
            wikip(x , (err, final) => {
                if (err){
                    return response.status(404).send('Could not parse Wikipedia data for: ' + req.query.person);
                }
                else{
                    const answers = final;
                    response.send(answers);
                }
            });
        } catch(e) {
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
