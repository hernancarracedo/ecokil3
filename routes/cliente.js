const express = require('express');
const router = express.Router();

// controlador
const clienteController = require('../controllers/cliente');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/cliente/add', isAuthenticated, clienteController.clienteRender);
router.post('/cliente/new-cliente', isAuthenticated, clienteController.newCliente);
router.get('/cliente', isAuthenticated, clienteController.getClientes);
//router.get('/visitamip/edit/:id', isAuthenticated, visitamipController.visitamipEditRender);
//router.put('/visitamip/edit-visitamip/:id', isAuthenticated, visitamipController.visitamipEdit);
//router.put('/visitamip/delete/:id', isAuthenticated, visitamipController.visitamipDelete);

module.exports = router;