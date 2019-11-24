const express = require('express');
const router = express.Router();

// controlador
const clienteController = require('../controllers/cliente');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/cliente/add', isAuthenticated, clienteController.clienteRender);
router.post('/cliente/new-cliente', isAuthenticated, clienteController.newCliente);
router.get('/cliente', isAuthenticated, clienteController.getClientes);
router.get('/cliente/edit/:id', isAuthenticated, clienteController.clienteEditRender);
router.put('/cliente/edit-cliente/:id', isAuthenticated, clienteController.clienteEdit);
router.put('/cliente/delete/:id', isAuthenticated, clienteController.clienteDelete);

module.exports = router;