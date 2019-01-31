const config = require('../config/config.js');
const exec = require('child_process').exec;

exec('pm2 stop ' + global.gConfig.appName);
exec('pm2 start app.js --name "' + global.gConfig.appName +'" --watch', {windowsHide: true});

