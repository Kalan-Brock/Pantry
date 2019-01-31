const express = require('express');
const router = express.Router();
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
        pageTitle: "Blog",
        posts: posts
    });
});

router.get('/:post', (req, res, next) => {
    let name = req.params.post;
    let thepost = db.get('blog_posts').find({slug: name}).value();

    if(thepost === undefined) {
        return next();
    }

    res.render('post', {
        layout: false,
        post: thepost
    });
});

// 404 - Keep as last route.
router.get('*', function(req, res){
    res.status(404).render('404', {
        layout: false,
        pageTitle: "Page Not Found"
    });
});

module.exports = router;