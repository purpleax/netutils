const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
