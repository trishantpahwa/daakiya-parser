const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(morgan(':method :url :status :user-agent - :response-time ms'));
app.use(bodyParser.json());

app.get("/", (request, response) => {
	return response.status(200).json({
		message: 'Hello base!'
	});
});

app.get("/hello-world", (request, response) => {
	return response.status(200).json({
		message: 'Hello World!'
	});
});

app.use('/api', routes);

module.exports = {
	app
};