const config = require('../config');
const simpleGit = require('simple-git')('./');

if(config.gitAutoVersion) {
    simpleGit.add('.').commit('Versioned from Pantry CMS.').push('origin', 'master');
}