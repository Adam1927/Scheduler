var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');
var usersController = require('./controllers/users');
var eventsController = require('./controllers/events');
var teamsController = require('./controllers/teams');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();
const sessionKey = process.env.SESSION_KEY || 'secret';

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/animalDevelopmentDB';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['X-Secret', 'X-API-Version', 'Content-Type', 'Authorization'],
}
app.use(cors(corsOptions));
app.options('*', cors());


app.use(session({
    secret: sessionKey, // A secret key for session data encryption
    resave: false,            // Whether to save the session data on each request
    saveUninitialized: true,   // Whether to save uninitialized (empty) sessions
    cookie: {
        secure: false,         // Whether to allow setting cookies over HTTP (only over HTTPS)
        maxAge: 60 * 60 * 1000,  // Session timeout in milliseconds (1 hour)
      }
  }));

// Enable method-override middleware
app.use(methodOverride('X-HTTP-Method-Override'));

// Import routes
app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});

app.get('/api/session', function(req, res) {
    if (req.session && req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});

app.use(usersController);
app.use(eventsController);
app.use(teamsController);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://127.0.0.1:${port}/api/`);
    console.log(`Frontend (production): http://127.0.0.1:${port}/`);
});

module.exports = app;
