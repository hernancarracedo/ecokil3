// server.js
// set up ======================================================================
// se toman todas las herramientas que se necesitan para la aplicacion
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8000;

var passport = require('passport');
var flash    = require('connect-flash');
var methodOverride = require('method-override');

//configurarcion para subir archivos por formularios
//var multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })

// configuration ===============================================================
// connect to our database
require('./config/passport')(passport); // pass passport for configuration


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

//app.set('view engine', 'ejs'); // set up ejs for templating
/*
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs'
  }));
*/

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');


app.use(methodOverride('_method'));


// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
  });


app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use(require('./routes/usuario'));
app.use(require('./routes/perfil'));
//app.use(require('./routes/index'));
app.use(require('./routes/gasto'));
app.use(require('./routes/tarea'));
app.use(require('./routes/visitamip'));
app.use(require('./routes/cliente'));
app.use(require('./routes/contacto'));
app.use(require('./routes/movibanco'));
app.use(require('./routes/movicc'));
app.use(require('./routes/cccCredito'));
app.use(require('./routes/cccDebito'));
app.use(require('./routes/documento'));
app.use(require('./routes/bitacora'));

// launch ======================================================================
app.listen(port);
console.log('Agarrate catalina en el puerto ' + port);
