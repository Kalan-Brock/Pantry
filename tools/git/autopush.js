const config = require('../../config/config.js');
const simpleGit = require('simple-git')('./');

if(global.gConfig.gitAutoVersion) {
    simpleGit.add('.').commit('Auto pushed from Pantry.').push('origin', 'master');
}