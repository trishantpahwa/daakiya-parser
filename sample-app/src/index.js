const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(cors());
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