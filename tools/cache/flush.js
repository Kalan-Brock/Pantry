const fs = require('fs-extra');
fs.remove('./public/cache');
console.log("Cache flushed.");