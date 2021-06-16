const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'No está autorizado.');
  res.redirect('/usuario/login');
};

helpers.isAdmin = (req, res, next) => {
  if (req.user.role == '55') {
    return next();
  }
  req.flash('error_msg', 'No posee los permisos necesarios.');
  res.redirect('/perfil/profile');
};

module.exports = helpers;