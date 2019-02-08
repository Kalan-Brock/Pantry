const config = require('../../config/config.js');
const exec = require('child_process').exec;

if(process.env.NODE_ENV === 'development') {
    exec('pm2 delete ' + global.gConfig.appName, {windowsHide: true});
    exec('pm2 start app.js --name "' + global.gConfig.appName + '" --watch', {windowsHide: true});
}