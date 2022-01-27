'use strict';

require('module-alias/register');

const { account } = require('#/db/sequelize_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/sequelize')(account) };

module.exports = handler;
