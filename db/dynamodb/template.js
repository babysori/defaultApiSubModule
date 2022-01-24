'use strict';

require('module-alias/register');

const { TEMPLATE } = require('#/libs/constants').DDBTableName;
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/dynamo')(TEMPLATE) };

module.exports = handler;
