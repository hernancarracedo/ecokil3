const router = require('express').Router();
const passport = require('passport');

const usuarioController = require('../controllers/usuario');


//router.get('/usuario/login', usuarioController.signinRender);
router.get('/', usuarioController.signinRender);


// process the login form
router.post('/usuario/login', passport.authenticate('local-login', {
        successRedirect : '/perfil/profile', // redirect to the secure profile section
        failureRedirect : '/usuario/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),
    function(req, res) {
        console.log("hello");
        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
   res.redirect('/');
});

router.get('/usuario/signup', usuarioController.signupRender);

router.post('/usuario/signup', passport.authenticate('local-signup', {
    successRedirect : '/perfil/profile', // redirect to the secure profile section
    failureRedirect : '/usuario/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.get('/usuario/logout', usuarioController.logout);

//router.get('/usuario', isAuthenticated, usuarioController.getUsuarios);
router.get('/usuario', usuarioController.getUsuarios);


module.exports = router;
