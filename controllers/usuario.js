// show the login form
function signinRender(req, res) {
	// render the page and pass in any flash data if it exists
	res.render('usuario/login.ejs', { message: req.flash('loginMessage') });
} 

// SIGNUP ==============================
// show the signup form
function signupRender (req, res) {
	// render the page and pass in any flash data if it exists
	res.render('usuario/signup.ejs', { message: req.flash('signupMessage') });
}

// LOGOUT ==============================
function logout(req, res) {
	req.logout();
	res.redirect('/');
};

module.exports = {
    signupRender,
    signinRender,
    logout
}
