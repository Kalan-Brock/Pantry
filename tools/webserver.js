const config = require('../config/config.js');
const exec = require('child_process').exec;

exec('pm2 delete ' + global.gConfig.appName, { detached: true, windowsHide: true });
exec('pm2 start app.js --name "' + global.gConfig.appName +'" --watch', { detached: true, windowsHide: true });