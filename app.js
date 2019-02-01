const express = require('express');
const config = require('./config/config.js');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const compression = require('compression');

// Gzip compression
app.use(compression());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Serve static html files without file extension only.
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

if(global.gConfig.hasBlog) {
    const blogroutes = require('./routes/blog');
    app.use('/blog', blogroutes);
}
const adminroutes = require('./routes/admin');
app.use('/admin', adminroutes);
const formsroutes = require('./routes/forms');
app.use('/forms', formsroutes);
const mainroutes = require('./routes/main');
app.use('/', mainroutes);

const server = app.listen(global.gConfig.sitePort, () => {});