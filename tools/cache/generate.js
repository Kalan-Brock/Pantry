const config = require('../../config/config.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);
const fs = require('fs-extra');
const ejs = require("ejs");
const ampy = require('../../tools/cache/ampy');
const sm = require('sitemap');

let sitemap = sm.createSitemap ({
    hostname: global.gConfig.siteUrl,
    cacheTime: 600000
});

let theme = global.gConfig.theme;

// The homepage.
let html = ejs.renderFile('./views/' + theme + '/home.ejs',
    {
        layout: false
    },
    {
        rmWhitespace: true,
        async: false
    },
    function(err, str)
    {
        fs.outputFile("./public/cache/optimized/index.html", str, function(err) {
            if(err)
                console.log(err);
        });
    });

sitemap.add({url: '/', changefreq: 'weekly',  priority: 0.9});


// Each page in the database, if flagged as "should_cache".
let pages = db.get('pages').value();

for(let i=0; i<pages.length; i++) {
    let slug = pages[i].slug;
    let path = "./public/cache/optimized/" + slug + ".html";
    let amppath = "./public/cache/amp/" + slug + ".html";
    sitemap.add({url: '/' + slug, changefreq: 'weekly',  priority: 0.7});


    if(global.gConfig.generateStaticFiles && pages[i].should_cache) {

        let html = ejs.renderFile('./views/' + theme + '/' + pages[i].layout + '.ejs',
            {
                layout: false,
                page: pages[i]
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

        if(global.gConfig.generateAMP && pages[i].should_amp) {
            let amphtml = ejs.renderFile('./views/' + theme + '/amp/page.ejs',
                {
                    layout: false,
                    page: pages[i]
                },
                {
                    rmWhitespace: true,
                    async: false
                },
                function (err, str) {
                    fs.outputFile(amppath, ampy(str, {cwd: './public'}));
                });
        }
    }
}

if(global.gConfig.hasBlog) {
// Blog Main Blog Page
    let posts = db.get('blog_posts').value();

    if (posts === undefined) {
        posts = {};
    }

    let bloghtml = ejs.renderFile('./views/' + theme + '/blog.ejs',
        {
            layout: false,
            pageTitle: "Blog",
            posts: posts
        },
        {
            rmWhitespace: true,
            async: false
        },
        function (err, str) {
            fs.outputFile("./public/cache/optimized/blog/index.html", str, function (err) {
                if (err)
                    console.log(err);
            });
        });

    sitemap.add({url: '/blog/', changefreq: 'weekly',  priority: 0.8});

    for(let i = 0; i < posts.length; i++) {
        if(global.gConfig.generateStaticFiles && posts[i].should_cache) {
            let slug = posts[i].slug;
            let path = "./public/cache/optimized/blog/" + slug + ".html";
            let amppath = "./public/cache/amp/blog/" + slug + ".html";
            sitemap.add({url: '/blog/' + slug, changefreq: 'weekly',  priority: 0.5});

            let html = ejs.renderFile('./views/' + theme + '/post.ejs',
                {
                    layout: false,
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

            if(global.gConfig.generateAMP && posts[i].should_amp) {
                let amphtml = ejs.renderFile('./views/' + theme + '/amp/post.ejs',
                    {
                        layout: false,
                        post: posts[i]
                    },
                    {
                        rmWhitespace: true,
                        async: false
                    },
                    function (err, str) {
                        fs.outputFile(amppath, ampy(str, {cwd: './public'}));
                    });
            }
        }
    }
}

fs.outputFile("./public/sitemap.xml", sitemap.toXML(), function (err) {
    if (err)
        console.log(err);
});
