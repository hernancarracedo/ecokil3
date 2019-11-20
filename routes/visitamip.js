const express = require('express');
const router = express.Router();

// controlador
const visitamipController = require('../controllers/visitamip');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
 
router.get('/visitamip/add', isAuthenticated, visitamipController.visitamipRender);
router.post('/visitamip/new-visitamip', isAuthenticated, visitamipController.newVisitamip);
router.get('/visitamip', isAuthenticated, visitamipController.getVisitasmip);
router.get('/visitamip/edit/:id', isAuthenticated, visitamipController.visitamipEditRender);
router.put('/visitamip/edit-visitamip/:id', isAuthenticated, visitamipController.visitamipEdit);
router.put('/visitamip/delete/:id', isAuthenticated, visitamipController.visitamipDelete);

module.exports = router;