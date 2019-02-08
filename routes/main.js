const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);

// Home
router.get('/', (req, res) => {
    res.render(global.gConfig.theme + '/home', {
        layout: false,
        pageTitle: "Home"
    });
});

router.get('/:page', (req, res, next) => {
    let name = req.params.page;
    let thepage = db.get('pages').find({slug: name}).value();

    if(thepage === undefined) {
        return next();
    }

    res.render(global.gConfig.theme + '/' + thepage.layout, {
        layout: false,
        page: thepage
    });
});

// 404 - Keep as last route.
router.get('*', function(req, res){
    res.status(404).render(global.gConfig.theme + '/404', {
        layout: false,
        pageTitle: "Page Not Found"
    });
});

module.exports = router;