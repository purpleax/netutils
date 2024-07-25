const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/wafw00f', (req, res) => {
    const address = req.body.address;
    exec(`wafw00f ${address}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            res.status(500).send(stderr);
            return;
        }
        res.send(stdout);
    });
});

app.post('/traceroute', (req, res) => {
    const address = req.body.address;
    exec(`traceroute ${address}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            res.status(500).send(stderr);
            return;
        }
        res.send(stdout);
    });
});

app.post('/nmap', (req, res) => {
    const address = req.body.address;
    const flags = req.body.flags;
    exec(`nmap ${flags} ${address}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            res.status(500).send(stderr);
            return;
        }
        res.send(stdout);
    });
});

app.get('/headers', (req, res) => {
    const headers = req.headers;
    const sourceIp = req.ip;

    res.json({
        headers: headers,
        sourceIp: sourceIp
    });
});

app.post('/cors-scan', async (req, res) => {
    const address = req.body.address;

    try {
        const response = await axios.get(address);
        const corsHeaders = {
            'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'] || 'Not present',
            'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'] || 'Not present',
            'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'] || 'Not present',
            'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials'] || 'Not present'
        };

        // Check for misconfigurations
        const misconfigurations = [];
        if (corsHeaders['Access-Control-Allow-Origin'] === '*') {
            misconfigurations.push('Wildcard (*) in Access-Control-Allow-Origin header');
        }
        if (corsHeaders['Access-Control-Allow-Credentials'] === 'true' && corsHeaders['Access-Control-Allow-Origin'] === '*') {
            misconfigurations.push('Credentials are allowed with wildcard (*) in Access-Control-Allow-Origin header');
        }

        res.json({
            headers: corsHeaders,
            misconfigurations: misconfigurations
        });
    } catch (error) {
        res.status(500).json({ error: `Error fetching CORS headers: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
