# daakiya-parser

A CLI tool to parse the routes in an ExpressJS application and generate a Postman collection.

![Made with love in India](https://madewithlove.now.sh/in?heart=true&template=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Installation

```
# On your terminal, run the following command:
npm i -g daakiya-parser
```

## Usage

```
# On your terminal, run the following command:

daakiya-parser -a <path-to-express-app> -p <path-to-express-apps-package-json> -b <base-url> -o <output-file>
```

Example usage:

```
daakiya-parser -a ./sample-app/src/index.js -p ./sample-app/package.json -b http://localhost:3000 -o ./sample-app/postman-collection.json
```

> Please do not forget to export the app variable in your ExpressJS application. It will not work without the export.

```
    const express = require('express');
    .
    .

    const app = express();
    .
    .
    .
    module.exports = { app };
```

![Exmaple](./1728450375.svg)

To-Dos:

-   [ ] Add support for Flask.
-   [ ] Improve error handling.
-   [ ] Write unit tests.

