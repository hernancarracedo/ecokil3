const express = require('express');
const router = express.Router();
var multer  = require('multer');

// controlador
const documentoController = require('../controllers/documento');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
var upload = multer({ dest: 'uploads/documentos/' });

/*
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
var upload = multer({ storage: storage })
*/
 
router.get('/documento/add', isAuthenticated, documentoController.documentoRender);
router.post('/documento/new-documento', upload.single('docu'), isAuthenticated, documentoController.newDocumento);
router.get('/documento', isAuthenticated, documentoController.getDocumentos);
router.get('/documento/edit/:id', isAuthenticated, documentoController.documentoEditRender);
router.put('/documento/edit-documento/:id', isAuthenticated, documentoController.documentoEdit);
router.put('/documento/delete/:id', isAuthenticated, documentoController.documentoDelete);

module.exports = router;