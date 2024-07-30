const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const dns = require('dns').promises;

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
            if (stderr.includes('requires root privileges')) {
                res.status(500).send('Error: This Nmap option requires root privileges. Please run with elevated privileges.');
            } else {
                console.error(`Error: ${stderr}`);
                res.status(500).send(stderr);
            }
            return;
        }
        res.send(stdout);
    });
});

app.post('/dns-lookup', async (req, res) => {
    const address = req.body.address;
    const recordType = req.body.recordType.toUpperCase();

    try {
        let result;
        switch (recordType) {
            case 'A':
                result = await dns.resolve4(address);
                break;
            case 'AAAA':
                result = await dns.resolve6(address);
                break;
            case 'CNAME':
                result = await dns.resolveCname(address);
                break;
            case 'MX':
                result = await dns.resolveMx(address);
                break;
            case 'NS':
                result = await dns.resolveNs(address);
                break;
            case 'TXT':
                result = await dns.resolveTxt(address);
                break;
            default:
                throw new Error('Invalid record type');
        }
        res.json({ result });
    } catch (error) {
        let errorMessage;
        if (error.code === 'ENODATA') {
            errorMessage = `No ${recordType} record found for ${address}`;
        } else if (error.code === 'ENOTFOUND') {
            errorMessage = `Domain ${address} not found`;
        } else {
            errorMessage = `Error performing DNS lookup: ${error.message}`;
        }
        console.error(`Error performing DNS lookup: ${error.message}`);
        res.status(500).json({ error: errorMessage });
    }
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
