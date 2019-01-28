const express = require('express');
const router = express.Router();
const config = require('../config');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Home
router.get('/', (req, res) => {
    res.render('home', {
        layout: false,
        config: config,
        pageTitle: "Home"
    });
});

router.get('/:page', (req, res, next) => {
    let name = req.params.page;
    let thepage = db.get('pages').find({slug: name}).value();

    if(thepage === undefined) {
        return next();
    }

    res.render(thepage.layout, {
        layout: false,
        config: config,
        page: thepage
    });
});

// 404 - Keep as last route.
router.get('*', function(req, res){
    res.status(404).render('404', {
        layout: false,
        config: config,
        pageTitle: "Page Not Found"
    });
});

module.exports = router;