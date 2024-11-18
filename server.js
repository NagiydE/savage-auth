// server.js

// set up =====================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3333; // whatever environment settings the client has set up will be priortized, it will run on our set port.
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash'); //checks for errors

var morgan       = require('morgan'); // for login
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser'); // ABLE TO SEE WHATS COMING IN WITH REQUESTS
var session      = require('express-session');

var configDB = require('./config/database.js'); //IMPORTING FRPM ANOTHER FILE

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  // console.log(db)
  require('./app/routes.js')(app, passport, db); // Why do we do this vs keeping everything in server? calling our routes files, exporting a function/ calling the function and telling it to run and passing app, passport, database as arguments to run function.
  
}); // connect to our database

require('./config/passport')(passport); // a function pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console, so we dont have to use console logs for everything
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')) // so that our static files don't need indiviudal routes


app.set('view engine', 'ejs'); // set up ejs for templating, will spit out html for us

// required for passport. helps you to remain logged in 
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session THESE ARE NOT SHOWING UP!


// launch ======================================================================
app.listen(port);
console.log('Reporting for duty on port: ' + port); //shows user that console log is running
