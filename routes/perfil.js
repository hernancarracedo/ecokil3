const express = require('express');
const router = express.Router();

// controlador
const perfilController = require('../controllers/perfil');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

//app.get('/profile'
router.get('/perfil/profile', isAuthenticated, perfilController.profileRender);

module.exports = router;