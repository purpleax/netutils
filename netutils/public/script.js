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
        const recordType = document.querySelector('input[name="recordType"]:checked').value;
        fetch('/dns-lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: address, recordType: recordType })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error) });
            }
            return response.json();
        })
        .then(result => {
            const formattedResult = formatDnsResult(result.result, recordType);
            document.getElementById('lookupResult').textContent = formattedResult;
        })
        .catch(error => {
            document.getElementById('lookupResult').textContent = `Error: ${error.message}`;
        });
    };

    function formatDnsResult(result, recordType) {
        let output = `DNS Lookup Result for ${recordType} Record:\n\n`;
        if (Array.isArray(result)) {
            result.forEach((record, index) => {
                output += `Record ${index + 1}:\n`;
                if (typeof record === 'object') {
                    for (const [key, value] of Object.entries(record)) {
                        output += `${key}: ${value}\n`;
                    }
                } else {
                    output += `${record}\n`;
                }
                output += '\n';
            });
        } else if (typeof result === 'object') {
            for (const [key, value] of Object.entries(result)) {
                output += `${key}: ${value}\n`;
            }
        } else {
            output += `${result}\n`;
        }
        return output;
    }

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
