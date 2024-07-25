# netutils
 Network utilities website


Directory Structure:

network-utilities/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
├── server.js
├── package.json
└── node_modules/

network-utilities/: Root directory of your project.

    public/: Contains all static files that will be served to the client.
        index.html: Your main HTML file containing the structure of the webpage.
        styles.css: Your CSS file for styling the webpage.
        script.js: Your JavaScript file containing client-side logic.
    server.js: Your Node.js server script that handles backend logic and interactions with network utilities.
    package.json: Your Node.js project configuration file, created when you run npm init -y.
    node_modules/: Directory where your project's dependencies are installed, created when you run npm install.

Prerequisites:

Create a new Node.js profect:

mkdir network-utilities
cd network-utilities
npm init -y
npm install express body-parser
npm install dns

Run the server script: node server.js



npm install axios cors
