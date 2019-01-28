const config = require('./config');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Remove trailing slash if it exists, for SEO purposes.  Serve static html files without file extension only.
app.use((req, res, next) => {
    if (req.originalUrl.substr(-1) === '/' && req.originalUrl.length > 1)
        res.redirect(301, req.originalUrl.slice(0, -1));
    else if (req.originalUrl.endsWith('.html'))
        res.redirect(301, req.originalUrl.slice(0, -5));
    else if (req.originalUrl.substr(-5) === 'index')
        res.redirect(301, req.originalUrl.slice(0, -5));
    else
        next();
});

app.use('/', express.static(__dirname + '/public', {
    redirect: false,
    extensions: ['html']
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// Routes Configuration
if(config.hasBlog) {
    const blogroutes = require('./routes/blog');
    app.use('/blog', blogroutes);
}
const adminroutes = require('./routes/admin');
app.use('/admin', adminroutes);
const mainroutes = require('./routes/main');
app.use('/', mainroutes);

const server = app.listen(config.sitePort, () => {});