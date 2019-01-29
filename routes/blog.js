const express = require('express');
const router = express.Router();
const config = require('../config');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// Blog Page
router.get('/', (req, res) => {
    let posts = db.get('blog_posts').value();

    if(posts === undefined) {
        posts = {};
    }

    res.render('blog', {
        layout: false,
        config: config,
        pageTitle: "Blog",
        posts: posts
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