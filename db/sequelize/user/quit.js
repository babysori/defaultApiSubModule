'use strict';

require('module-alias/register');

const { userQuit } = require('#/db/sequelize_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/sequelize')(userQuit) };

module.exports = handler;
