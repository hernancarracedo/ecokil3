const express = require('express');
const router = express.Router();

// controlador
const bitacoraController = require('../controllers/bitacora');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/bitacora/add', isAuthenticated, bitacoraController.bitacoraRender);
router.post('/bitacora/new-bitacora', isAuthenticated, bitacoraController.newBitacora);
router.get('/bitacora', isAuthenticated, bitacoraController.getBitacoras);
router.get('/bitacora/edit/:id', isAuthenticated, bitacoraController.bitacoraEditRender);
router.put('/bitacora/edit-bitacora/:id', isAuthenticated, bitacoraController.bitacoraEdit);
router.put('/bitacora/delete/:id', isAuthenticated, bitacoraController.bitacoraDelete);

module.exports = router;