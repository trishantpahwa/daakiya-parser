const express = require('express');

const controllers = require('../controllers');

const router = express.Router();

router.get('/hello-world', controllers.get);

module.exports = router;