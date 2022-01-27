'use strict';

require('module-alias/register');

const { userQuit } = require('#/db/mongoose_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/mongoose')(userQuit) };

module.exports = handler;
