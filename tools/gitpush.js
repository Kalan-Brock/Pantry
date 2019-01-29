const simpleGit = require('simple-git')('./');

simpleGit.add('.').commit('Versioned from Pantry CMS.').push('origin', 'master');