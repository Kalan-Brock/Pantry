const config = require('./config');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// Remove trailing slash if it exists, for SEO purposes.
app.use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url);
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
        res.redirect(301, req.url.slice(0, -1));
    else
        next();
});

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