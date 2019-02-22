const exec = require('child_process').exec;

exec('pm2 stop pantry');
exec('pm2 delete pantry');

console.log('Server killed.');
