const express = require('express');
const router = express.Router();

// controlador
const visitamipController = require('../controllers/visitamip');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/visitamip/add', isAuthenticated, visitamipController.visitamipRender);
router.post('/visitamip/new-visitamip', isAuthenticated, visitamipController.newVisitamip);
router.get('/visitamip', isAuthenticated, visitamipController.getVisitasmip);
//router.get('/gasto/edit/:id', isAuthenticated, gastoController.gastoEditRender);
//router.put('/gasto/edit-gasto/:id', isAuthenticated, gastoController.gastoEdit);
//router.put('/gasto/delete/:id', isAuthenticated, gastoController.gastoDelete);

module.exports = router;