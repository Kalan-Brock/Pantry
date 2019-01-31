const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid');
const fs = require('fs-extra');
const ejs = require('ejs');


// Dashboard
router.get('/handle', (req, res) => {
    res.send('Form handle routes!');
});

// 404 - Keep as last route.
router.get('*', function(req, res){
    res.status(404).render('404', {
        layout: false,
        pageTitle: "Forms"
    });
});

module.exports = router;