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

    // Added User-Agent header to comply with Wikipedia API policy
    const options = {
        url: url,
        headers: {
            'User-Agent': 'simple-nodejs-app/1.0.0 (https://github.com/rat9615/simple-nodejs-app)'
        }
    };

    //get wikip search string
    request(options,(err,res, body) =>{
        if(err) {
            response.redirect('404');
        }
            result = JSON.parse(body);
            x = result[3][0];
            x = x.substring(30, x.length); 
            //get wikip json
            wikip(x , (err, final) => {
                if (err){
                    response.redirect('404');
                }
                else{
                    const answers = final;
                    response.send(answers);
                }
            });
    });
    
});

//port
app.listen(3000, console.log("Listening at port 3000..."))