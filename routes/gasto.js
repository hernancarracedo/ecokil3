const express = require('express');
const router = express.Router();

// controlador
const gastoController = require('../controllers/gasto');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/gasto/add', isAuthenticated,  gastoController.gastoRender);
router.post('/gasto/new-eso', isAuthenticated, gastoController.newGasto);
router.get('/gasto', isAuthenticated, gastoController.getGastos);
router.get('/gasto/edit/:id', isAuthenticated, gastoController.gastoEditRender);
router.put('/gasto/edit-eso/:id', isAuthenticated, gastoController.gastoEdit);
router.delete('/gasto/delete/:id', isAuthenticated, gastoController.gastoDelete);

module.exports = router;
