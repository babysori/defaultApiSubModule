'use strict';

require('module-alias/register');

const { account } = require('#/db/mongoose_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/mongoose')(account) };

module.exports = handler;
