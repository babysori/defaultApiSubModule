'use strict';

require('module-alias/register');

const config = require('#/config');

module.exports = require('console-log-level')({
  level: config.logLevel,
  prefix: (level) => `[${level.toUpperCase()}] ${(new Date()).toISOString()}:`,
});
