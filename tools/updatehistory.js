const config = require('../config/config.js');
const simpleGit = require('simple-git')('./');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

simpleGit.log({
    "max-count": 5
}, function(err, log) {
    console.log(log.all);
});
