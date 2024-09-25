document.addEventListener('DOMContentLoaded', (event) => {
    function showUtility(utilityId) {
        // Hide all utility forms
        document.querySelectorAll('.utility-form').forEach(form => {
            form.style.display = 'none';
        });

        // Show the selected utility form
        document.getElementById(`${utilityId}Form`).style.display = 'block';
    }

    window.runTraceroute = function() {
        const address = document.getElementById('tracerouteAddress').value;
        fetch('/traceroute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: address })
        })
        .then(response => response.text())
        .then(result => {
            document.getElementById('tracerouteResult').textContent = result;
        })
        .catch(error => {
            document.getElementById('tracerouteResult').textContent = `Error: ${error}`;
        });
    };

    window.runNmap = function() {
        const address = document.getElementById('nmapAddress').value;
        const flags = document.getElementById('nmapFlags').value;
        fetch('/nmap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: address, flags: flags })
        })
        .then(response => response.text())
        .then(result => {
            document.getElementById('nmapResult').textContent = result;
        })
        .catch(error => {
            document.getElementById('nmapResult').textContent = `Error: ${error}`;
        });
    };

    window.runLookup = function() {
        const address = document.getElementById('lookupAddress').value;
        const dnsServer = document.getElementById('dnsServer').value;
        const recordType = document.querySelector('input[name="recordType"]:checked').value;
        document.getElementById('lookupResult').textContent = `Looking up ${address} with ${recordType} record...`;
    };

    window.runWafLookup = function() {
        const address = document.getElementById('wafLookupAddress').value;
        fetch('/wafw00f', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: address })
        })
        .then(response => response.text())
        .then(result => {
            document.getElementById('wafLookupResult').textContent = result;
        })
        .catch(error => {
            document.getElementById('wafLookupResult').textContent = `Error: ${error}`;
        });
    };

    window.runCorsScan = function() {
        const address = document.getElementById('corsScanAddress').value;
        document.getElementById('corsScanResult').textContent = `Scanning CORS for ${address}...`;
    };

    window.uploadJson = function() {
        const fileInput = document.getElementById('jsonFile');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            document.getElementById('jsonResult').textContent = `Uploaded JSON content: ${content}`;
        };

        reader.readAsText(file);
    };

window.convertUnixTime = function() {
    const minutes = document.getElementById('timeInput').value;

    // Get the current time in seconds (Unix time), then round it down to the nearest minute
    const currentTime = Math.floor(Date.now() / 1000);
    const currentTimeRounded = Math.floor(currentTime / 60) * 60; // Remove seconds

    // Calculate "From Time" - current time minus the number of minutes entered by the user (rounded to the minute)
    const fromTime = currentTimeRounded - (minutes * 60);

    // Calculate "Until Time" - current time minus 5 minutes (rounded to the minute)
    const untilTime = currentTimeRounded - (5 * 60);

    // Display the results
    document.getElementById('unixTimeResult').textContent = 
        `From Time (Unix Timestamp): ${fromTime}\nUntil Time (Unix Timestamp): ${untilTime}`;
};




    window.runHeaders = function() {
        fetch('/headers')
        .then(response => response.json())
        .then(result => {
            const headers = result.headers;
            const sourceIp = result.sourceIp;

            let output = `Source IP: ${sourceIp}\n\nHeaders:\n`;
            for (const [key, value] of Object.entries(headers)) {
                output += `${key}: ${value}\n`;
            }

            document.getElementById('headersResult').textContent = output;
        })
        .catch(error => {
            document.getElementById('headersResult').textContent = `Error: ${error}`;
        });
    };

    window.showUtility = showUtility;
});
