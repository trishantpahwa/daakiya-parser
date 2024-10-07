const fs = require('fs');
const { Collection, Item, Request, Url, Header } = require('postman-collection');
const { logRegisteredRoutes } = require('expressjs-route-coverage');
const { app } = require('./sample-app/src/index'); // Take input from CLI => TP | 2024-10-06 14:53:09
const packageJSON = require('./sample-app/package.json'); // Take input from CLI => TP | 2024-10-06 14:53:02

// Base URL for your Express application
const baseUrl = 'http://localhost:3000'; // Take input from CLI => TP | 2024-10-06 14:52:48

// Generate route coverage data
const coverage = logRegisteredRoutes(app, packageJSON);
// Create a new Postman collection
const collection = new Collection({
    info: {
        name: 'Express API Collection',
        description: 'Generated from expressjs-route-coverage'
    },
    item: []
});

// Convert the route coverage data into Postman requests
coverage.forEach(route => {
    const [method, path] = route.split("   =>   ");
    const postmanRequest = new Request({
        method: method.toUpperCase(),
        url: new Url({
            raw: `${baseUrl}${path}`,
            host: baseUrl.split('//')[1],
            path: path.split('/')
        }),
        header: [
            new Header({
                key: 'Content-Type',
                value: 'application/json'
            })
        ],
        description: `Request for ${method.toUpperCase()} ${path}`
    });
    postmanRequest.url.query = []
    // Add each request to the Postman collection
    collection.items.add(new Item({
        name: `${method.toUpperCase()} ${path}`,
        request: postmanRequest
    }));
});

// Save the collection to a file
fs.writeFileSync('express-api-collection.json', JSON.stringify(collection.toJSON(), null, 2)); // Take file name input from CLI => TP | 2024-10-06 14:52:48
console.log('Postman collection generated successfully!');
