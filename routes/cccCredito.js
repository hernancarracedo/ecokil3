const express = require('express');
const router = express.Router();

// controlador
const cccCreditoController = require('../controllers/cccCredito');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 

router.get('/cccCredito/add-credito', isAuthenticated, cccCreditoController.cccCreditoRender);
router.post('/cccCredito/new-credito', isAuthenticated, cccCreditoController.newCccCredito);
router.get('/cccCredito', isAuthenticated, cccCreditoController.getCccCreditos);
router.get('/cccCredito/edit/:id', isAuthenticated, cccCreditoController.cccCreditoEditRender);
router.put('/cccCredito/edit-credito/:id', isAuthenticated, cccCreditoController.cccCreditoEdit);
router.put('/cccCredito/delete/:id', isAuthenticated, cccCreditoController.cccCreditoDelete);


module.exports = router;