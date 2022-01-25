'use strict';

require('module-alias/register');

const { USER_QUIT } = require('#/libs/constants').DDBTableName;
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/dynamo')(USER_QUIT) };

module.exports = handler;
