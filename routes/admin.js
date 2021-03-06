const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);
const shortid = require('shortid');
const fs = require('fs-extra');
const ejs = require('ejs');
const ampify = require('ampify');

router.get('/pages/create', (req, res) => {
    res.render('admin/pages/create', {
        layout: 'admin/layout',
        pageTitle: "Create a Page"
    });
});

router.post('/pages/create', (req, res) => {
    data = {success: true};
    let existingslug = db.get('pages').find({slug: req.body.slug}).value();
    let existingtitle = db.get('pages').find({title: req.body.title}).value();

    if(existingslug !== undefined) {
        data.success = false;
        data.errormsg = "A page with this slug already exists."
    }

    if(existingtitle !== undefined) {
        data.success = false;
        data.errormsg = "A page with this title already exists."
    }

    if(data.success) {
        data.id = shortid.generate();
        db.get('pages').push(
            {
                "id": data.id,
                "slug": req.body.slug,
                "layout": "page",
                "title": req.body.title,
                "content": req.body.content,
                "author": "Administrator",
                "published": true,
                "should_cache": true,
                "should_amp": true,
                "meta_keywords": "",
                "meta_description": "",
                "canonical": ""
            }
        ).write();

        let page = db.get('pages').find({id: data.id}).value();

        if(page === 'undefined' || !page.should_cache)
            res.json(data);

        let path = "./public/cache/optimized/" + page.slug + ".html";
        let amppath = "./public/cache/amp/" + page.slug + ".html";

        if(global.gConfig.generateStaticFiles) {
            let optimizedhtml = ejs.renderFile('./views/' + page.layout + '.ejs',
                {
                    layout: false,
                    page: page
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

        if(global.gConfig.generateAMP && page.should_amp) {
            let amphtml = ejs.renderFile('./views/amp/page.ejs',
                {
                    layout: false,
                    page: pages[i]
                },
                {
                    rmWhitespace: true,
                    async: false
                },
                function (err, str) {
                    fs.outputFile(amppath, ampify(str, {cwd: '../public'}));
                });
        }
    }

    res.json(data);
});

router.get('/pages/edit/:id', (req, res, next) => {
    let theid = req.params.id;
    let thepage = db.get('pages').find({id: theid}).value();

    if(thepage === undefined) {
        return next();
    }

    res.render('admin/pages/edit', {
        layout: 'admin/layout',
        pageTitle: "Edit " + thepage.title,
        page: thepage
    });
});

router.post('/pages/edit/:id', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    let theid = req.params.id;
    let data = {success: true, id: theid};
    let thepage = db.get('pages').find({id: theid}).value();

    if(thepage === undefined) {
        data.success = false;
        data.errormsg = "The page with id " + theid + " does not exist."
    }

    if(data.success) {
        db.get('pages')
            .find({id: theid})
            .assign({
                "slug": req.body.slug,
                "layout": "page",
                "title": req.body.title,
                "content": req.body.content,
                "author": "Administrator",
                "published": true,
                "should_cache": true,
                "should_amp": true,
                "meta_keywords": "",
                "meta_description": "",
                "canonical": ""
            })
            .write();

        let path = "./public/cache/optimized/" + req.body.slug + ".html";
        let amppath = "./public/cache/amp/" + req.body.slug + ".html";
        let page = db.get('pages').find({id: theid}).value();

        if (page === 'undefined' || !page.should_cache)
            res.json(data);

        if (global.gConfig.generateStaticFiles) {
            let optimizedhtml = ejs.renderFile('./views/' + page.layout + '.ejs',
                {
                    layout: false,
                    page: page
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

        if(global.gConfig.generateAMP && page.should_amp) {
            let amphtml = ejs.renderFile('./views/amp/page.ejs',
                {
                    layout: false,
                    page: pages[i]
                },
                {
                    rmWhitespace: true,
                    async: false
                },
                function (err, str) {
                    fs.outputFile(amppath, ampify(str, {cwd: '../public'}));
                });
        }
    }

    res.json(data);
});

router.get('/pages', (req, res) => {
    let pages = db.get('pages').value();

    if(pages === undefined) {
        pages = {};
    }

    res.render('admin/pages/list', {
        layout: 'admin/layout',
        pageTitle: "Pages",
        pages: pages
    });
});

// Dashboard
router.get('/', (req, res) => {
    res.render('admin/home', {
        layout: 'admin/layout',
        pageTitle: "Dashboard"
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