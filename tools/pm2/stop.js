const config = require('../../config/config.js');
const exec = require('child_process').exec;

if(process.env.NODE_ENV === 'development') {
    exec('pm2 stop ' + global.gConfig.appName);
    exec('pm2 delete ' + global.gConfig.appName);

    console.log('Server ' + gConfig.appName + ' killed.');
}