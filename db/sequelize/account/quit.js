'use strict';

require('module-alias/register');

const { accountQuit } = require('#/db/sequelize_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/sequelize')(accountQuit) };

module.exports = handler;
