var mysql = require('mysql');
var dbconfig = require('../config/database');
var conex = mysql.createConnection(dbconfig.connection);
conex.query('USE ' + dbconfig.database);

// show the login form
function signinRender(req, res) {
	// render the page and pass in any flash data if it exists
	//res.render('usuario/login.ejs', { message: req.flash('loginMessage') });
	res.render('usuario/login');
} 

// SIGNUP ==============================
// show the signup form
function signupRender (req, res) {
	// render the page and pass in any flash data if it exists
  
  res.render('usuario/signup');

}

// LOGOUT ==============================
function logout(req, res) {
	req.logout();
	res.redirect('/');
};


//Get todos los Contactos
function getUsuarios(req, res){
  sql = `SELECT id, username, role
  FROM users
  WHERE baja is null`;
  conex.query(sql, function(error, resultado, fields){
      if (error) {
        return res.status(404).send("Ha ocurrido un error en la consulta");
      }
      res.render('usuario/all-usuario', {resultado, layout: 'mainlayout'});
  });   
}


module.exports = {
    signupRender,
    signinRender,
	logout,
	getUsuarios
}
