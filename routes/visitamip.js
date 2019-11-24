const express = require('express');
const router = express.Router();

var multer  = require('multer');

// controlador
const visitamipController = require('../controllers/visitamip');

// Helpers
const { isAuthenticated } = require('../helpers/auth');
var upload = multer({ dest: 'uploads/' });

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
 
router.get('/visitamip/add', isAuthenticated, visitamipController.visitamipRender);
//router.post('/visitamip/new-visitamip', isAuthenticated, visitamipController.newVisitamip);
router.post('/visitamip/new-visitamip', upload.single('avatar'), isAuthenticated, visitamipController.newVisitamip);
router.get('/visitamip', isAuthenticated, visitamipController.getVisitasmip);
router.get('/visitamip/edit/:id', isAuthenticated, visitamipController.visitamipEditRender);
router.put('/visitamip/edit-visitamip/:id', isAuthenticated, visitamipController.visitamipEdit);
router.put('/visitamip/delete/:id', isAuthenticated, visitamipController.visitamipDelete);





module.exports = router;