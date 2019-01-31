const _ = require('lodash');

// development, testing, staging, production
process.env.NODE_ENV = 'development';

// module variables
const config = require('../config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

global.gConfig = finalConfig;