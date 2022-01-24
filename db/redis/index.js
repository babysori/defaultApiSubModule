'use strict';

require('module-alias/register');

const config = require('#/config');

module.exports = require('#/libs/db_client/redis')(config.redis.endPoint);
