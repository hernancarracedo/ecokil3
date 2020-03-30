const express = require('express');
const router = express.Router();

// controlador
const moviccController = require('../controllers/movicc');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
//router.get('/movicc/add-debito', isAuthenticated, moviccController.moviccDebitoRender);
//router.get('/movicc/add-credito', isAuthenticated, moviccController.moviccCreditoRender);
//router.post('/movicc/new-debito', isAuthenticated, moviccController.newMoviccDebito);
//router.post('/movicc/new-credito', isAuthenticated, moviccController.newMoviccCredito);
router.get('/movicc', isAuthenticated, moviccController.getMoviscc);
//router.get('/movibanco/edit/:id', isAuthenticated, movibancoController.movibancoEditRender);
//router.put('/movibanco/edit-movibanco/:id', isAuthenticated, movibancoController.movibancoEdit);
//router.put('/movibanco/delete/:id', isAuthenticated, movibancoController.movibancoDelete);

module.exports = router;