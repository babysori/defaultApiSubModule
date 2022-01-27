'use strict';

const { sequelize } = require('#/db/sequelize_model');

exports.transaction = (callback) => sequelize.transaction((transaction) => callback(transaction));
