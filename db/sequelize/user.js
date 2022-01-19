'use strict';

const { user } = require('../sequelize_model');
// eslint-disable-next-line global-require
const handler = { ...require('../../libs/db_handler/sequelize')(user) };

handler.getForClient = owner => handler.get({ id: owner }, { attributes: ['name', 'nickname'] });
handler.getDetailForClient = owner => handler.get({ id: owner }, { attributes: ['name', 'nickname'] });

module.exports = handler;
