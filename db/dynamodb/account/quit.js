'use strict';

require('module-alias/register');

const { ACCOUNT_QUIT } = require('#/constants').DDBTableName;
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/dynamo')(ACCOUNT_QUIT) };

module.exports = handler;
