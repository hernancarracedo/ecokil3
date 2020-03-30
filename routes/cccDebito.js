const express = require('express');
const router = express.Router();

// controlador
const cccDebitoController = require('../controllers/cccDebito');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/cccDebito/add-debito', isAuthenticated, cccDebitoController.cccDebitoRender);
router.post('/cccDebito/new-debito', isAuthenticated, cccDebitoController.newCccDebito);
router.get('/cccDebito', isAuthenticated, cccDebitoController.getCccDebitos);
router.get('/cccDebito/edit/:id', isAuthenticated, cccDebitoController.cccDebitoEditRender);
router.put('/cccDebito/edit-debito/:id', isAuthenticated, cccDebitoController.cccDebitoEdit);
router.put('/cccDebito/delete/:id', isAuthenticated, cccDebitoController.cccDebitoDelete);

module.exports = router;