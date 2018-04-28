require('dotenv').config();

require('babel-register')({
	presets: ['env', 'react', 'stage-0']
});

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
mongoose.Promise = require('bluebird').Promise;

// twitter oauth 2.0 requires sessions
app.use(session({secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon(path.join(__dirname, 'public', 'favicon_c9.ico')));
app.use(express.static(path.resolve(__dirname, 'universal-app')));

// application routes
app.use(require('./universal-app/server/routes/userRoutes.js'));
app.use(require('./universal-app/server/routes/pinRoutes.js'));
app.use(require('./universal-app/server/routes/indexRoute.jsx'));

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Node.js listening on port ${port} ...`);
});
