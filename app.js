require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
var expressValidator = require('express-validator');
const compression = require('compression');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var store = require('connect-nedb-session')(session);
var flash = require('connect-flash');

const app = express();

// Gzip compression
app.use(compression());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use((req, res, next) => {
    if (req.originalUrl.endsWith('.html'))
        res.redirect(301, req.originalUrl.slice(0, -5));
    else if (req.originalUrl.substr(-5) === 'index')
        res.redirect(301, req.originalUrl.slice(0, -6));
    else
        next();
});

app.use('/amp', express.static(path.join(__dirname, '/public/cache/amp'), {
    redirect: false,
    extensions: ['html']
}));

app.use('/', express.static(path.join(__dirname, '/public/cache/optimized'), {
    redirect: true,
    extensions: ['html']
}));

app.use('/', express.static(path.join(__dirname, '/public'), {
    redirect: false,
    extensions: ['html']
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// form and url validation
app.use(expressValidator());

// cookie, session, passport is for authentication
app.use(cookieParser());

// setup sessions
var sessionOptions = {
    store: new store({ filename: path.join('data', 'sessions.json')}),
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false,
};


if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sessionOptions.cookie.secure = true; // serve secure cookies for https
}
app.use(session(sessionOptions));

// intialize passport
app.use(passport.initialize());
// use express.session() before passport.session()
app.use(passport.session());

// initialize flash; flash must be after cookieParser and session
app.use(flash());

// global variables that are available to the views
app.use(function(req, res, next) {
    res.locals.errors = null;
    // req.user comes from passport. this makes 'user' available in the view.
    res.locals.user = req.user || null;
    // req.flash comes from flash
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

if(global.gConfig.hasBlog) {
    const blogroutes = require('./routes/blog');
    app.use('/blog', blogroutes);
}
if(global.gConfig.hasAuth) {
    const authroutes = require('./routes/auth');
    app.use('/auth', authroutes);
    const adminroutes = require('./routes/admin');
    app.use('/admin', adminroutes);
    const formsroutes = require('./routes/forms');
    app.use('/forms', formsroutes);
}
const mainroutes = require('./routes/main');
app.use('/', mainroutes);

const server = app.listen(global.gConfig.sitePort, () => {});