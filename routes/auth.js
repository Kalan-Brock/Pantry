const express = require('express');
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const authService = require('../services/authservice');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
authService.configurePassport(passport);


// 404 - Keep as last route.
router.get('*', function(req, res){
    res.status(404).render(global.gConfig.theme + '/404', {
        layout: false,
        pageTitle: "Page Not Found"
    });
});

module.exports = router;
