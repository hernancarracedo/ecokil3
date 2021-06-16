const express = require('express');
const router = express.Router();

// controlador
const contactoController = require('../controllers/contacto');

// Helpers
//const { isAuthenticated } = require('../helpers/auth');
const { isAuthenticated, isAdmin } = require('../helpers/auth');
 
//router.get('/contacto/add', isAuthenticated, contactoController.contactoRender);
router.get('/contacto/add', isAuthenticated, isAdmin, contactoController.contactoRender);

router.post('/contacto/new-contacto', isAuthenticated, contactoController.newContacto);
router.get('/contacto', isAuthenticated, contactoController.getContactos);
router.get('/contacto/edit/:id', isAuthenticated, contactoController.contactoEditRender);
router.put('/contacto/edit-contacto/:id', isAuthenticated, contactoController.contactoEdit);
router.put('/contacto/delete/:id', isAuthenticated, contactoController.contactoDelete);

module.exports = router;