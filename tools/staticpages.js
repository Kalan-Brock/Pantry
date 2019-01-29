const config = require('../config');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const fs = require('fs-extra');
const ejs = require("ejs");

// The homepage.
let html = ejs.renderFile('./views/home.ejs',
    {
        layout: false,
        config: config
    },
    {
        rmWhitespace: true,
        async: false
    },
    function(err, str)
    {
        fs.outputFile("./public/optimized/index.html", str, function(err) {
            if(err)
                console.log(err);
        });
    });


// Each page in the database, if flagged as "should_cache".
let pages = db.get('pages').value();

for(let i=0; i<pages.length; i++) {
    let slug = pages[i].slug;
    let path = "./public/optimized/" + slug + ".html";

    let html = ejs.renderFile('./views/' + pages[i].layout + '.ejs',
        {
            layout: false,
            config: config,
            page: pages[i]
        },
        {
            rmWhitespace: true,
            async: false
        },
        function(err, str)
        {
            fs.outputFile(path, str, function(err) {
                if(err)
                    console.log(err);
            });
        });
}

if(config.hasBlog) {
// Blog Main Blog Page
    let posts = db.get('blog_posts').value();

    if (posts === undefined) {
        posts = {};
    }

    let bloghtml = ejs.renderFile('./views/blog.ejs',
        {
            layout: false,
            config: config,
            pageTitle: "Blog",
            posts: posts
        },
        {
            rmWhitespace: true,
            async: false
        },
        function (err, str) {
            fs.outputFile("./public/optimized/blog.html", str, function (err) {
                if (err)
                    console.log(err);
            });
        });

    // Blog posts from database.

    for(let i=0; i<posts.length; i++) {
        if(posts[i].should_cache) {
            let slug = posts[i].slug;
            let path = "./public/optimized/blog/" + slug + ".html";

            let html = ejs.renderFile('./views/post.ejs',
                {
                    layout: false,
                    config: config,
                    post: posts[i]
                },
                {
                    rmWhitespace: true,
                    async: false
                },
                function (err, str) {
                    fs.outputFile(path, str, function (err) {
                        if (err)
                            console.log(err);
                    });
                });
        }
    }
}
