const express = require('express');
const router = express.Router();

// controlador
const tareaController = require('../controllers/tarea');

//Helpers
const { isAuthenticated } = require('../helpers/auth');

router.get('/tarea', tareaController.getTareas);
router.get('/tarea/add', tareaController.tareaRender);
router.post('/tarea/new-tarea', tareaController.newTarea);
router.get('/tarea/editar/:id', tareaController.tareaEditRender);
router.put('/tarea/edit-tarea/:id', tareaController.tareaEdit);

module.exports = router;
