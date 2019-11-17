const express = require('express');
const router = express.Router();

// controlador
const indexController = require('../controllers/index');

router.get('/', indexController.indexRender);

module.exports = router;