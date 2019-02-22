const exec = require('child_process').exec;

exec('pm2 delete pantry');
exec('pm2 start app.js --name pantry --watch');
