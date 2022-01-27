'use strict';

require('module-alias/register');

const { accountQuit } = require('#/db/mongoose_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/mongoose')(accountQuit) };

module.exports = handler;
