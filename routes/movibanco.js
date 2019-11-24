const express = require('express');
const router = express.Router();

// controlador
const movibancoController = require('../controllers/movibanco');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/movibanco/add', isAuthenticated, movibancoController.movibancoRender);
router.post('/movibanco/new-movibanco', isAuthenticated, movibancoController.newMovibanco);
router.get('/movibanco', isAuthenticated, movibancoController.getMovisbanco);
router.get('/movibanco/edit/:id', isAuthenticated, movibancoController.movibancoEditRender);
router.put('/movibanco/edit-movibanco/:id', isAuthenticated, movibancoController.movibancoEdit);
router.put('/movibanco/delete/:id', isAuthenticated, movibancoController.movibancoDelete);

module.exports = router;