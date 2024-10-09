#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { Collection, Item, Request, Url, Header } = require('postman-collection');
const { logRegisteredRoutes } = require('expressjs-route-coverage');
const { program } = require('commander');
const { prompt } = require('enquirer');
const figlet = require('figlet');

console.log(figlet.textSync("Daakiya Parser"))

// Set up commander to parse CLI arguments
program
    .option('-a, --app <path>', 'Path to the Express app module')
    .option('-p, --package <path>', 'Path to the package.json file')
    .option('-b, --base-url <url>', 'Base URL for the Express application')
    .option('-o, --output <file>', 'Output file name for the Postman collection');

program.parse(process.argv);

const options = program.opts();

// Function to prompt for missing values
async function getInputs() {
    const questions = [];

    if (!options.app) {
        questions.push({
            type: 'input',
            name: 'app',
            message: 'Enter the path to the Express app module'
        });
    }

    if (!options.package) {
        questions.push({
            type: 'input',
            name: 'package',
            message: 'Enter the path to the package.json file'
        });
    }

    if (!options.baseUrl) {
        questions.push({
            type: 'input',
            name: 'baseUrl',
            message: 'Enter the base URL for the Express application'
        });
    }

    if (!options.output) {
        questions.push({
            type: 'input',
            name: 'output',
            message: 'Enter the output file name for the Postman collection'
        });
    }

    // If there are any questions to ask, prompt the user
    if (questions.length > 0) {
        const answers = await prompt(questions);
        return { ...options, ...answers };
    }

    // If no prompts are needed, return the options as they are
    return options;
}

// Main function to generate the Postman collection
try {
    getInputs().then((inputs) => {
        // Importing the application based on user input
        const { app } = require(path.join(process.cwd(), inputs.app));
        const packageJSON = require(path.join(process.cwd(), inputs.package));
        const baseUrl = inputs.baseUrl;

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
                    host: baseUrl,
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
            postmanRequest.url.query = [];
            // Add each request to the Postman collection
            collection.items.add(new Item({
                name: `${method.toUpperCase()} ${path}`,
                request: postmanRequest
            }));
        });

        // Save the collection to a file
        fs.writeFileSync(inputs.output, JSON.stringify(collection.toJSON(), null, 2));
        console.log('Postman collection generated successfully!');
    }).catch(error => {
        console.error('Error getting user inputs:', error.message);
    });
} catch (error) {
    console.error('Error generating the Postman collection:', error.message);
}
