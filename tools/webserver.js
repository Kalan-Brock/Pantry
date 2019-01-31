const config = require('../config.js');
const exec = require('child_process').exec;

exec('pm2 stop all');
exec('pm2 delete ' + config.appName);
exec('pm2 start app.js --name "' + config.appName +'" --watch');

