'use strict';

require('module-alias/register');

const { user } = require('#/db/mongoose_model');
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/mongoose')(user) };

handler.getForClient = (owner) => handler.get({ id: owner }, ['name', 'nickname']);
handler.getDetailForClient = (owner) => handler.get({ id: owner }, ['name', 'nickname']);

module.exports = handler;
