const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection');
const path = require('path');
const user = require('./models/user');

// routers that hold the express routes for logging in and registering users
const login = require('./routes/login');
const register = require('./routes/register');
const auth = require('./passport/setup');
const passport = require('passport');
const session = require('express-session');

const sessionConfig = {
  // other people should not be able to see this
  secret: 'super secret key goes here', // this should be read from the env
  key: 'user',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000, // when does cookie expire?
    secure: false
  }
};

//connection.connect();
auth.setup();

const app = express();

// tells express to pay attention to sessions and to use the stated parameters
app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session()); // passport is supposed to keep track of sessions and get rid of them

app.use('/login', login);
app.use('/register', register);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});


// everything beyond this point needs to be authenticated
app.use(ensureAuthenticated);

app.get('/supersecret', function(req, res) {
  res.send('the password is banana');
});

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

var server = app.listen(3000, function() {
  console.log('Listening on port', server.address().port);
});
