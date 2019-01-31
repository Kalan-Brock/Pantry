const config = require('./config/config.js');
const simpleGit = require('simple-git')('./');

if(global.gConfig.gitAutoVersion) {
    simpleGit.add('.').commit('Versioned from Pantry CMS.').push('origin', 'master');
}