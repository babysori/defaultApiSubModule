'use strict';

require('module-alias/register');

const { USER } = require('#/libs/constants').DDBTableName;
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/dynamo')(USER) };

handler.getForClient = (owner) => handler.get({
  ProjectionExpression: '#name',
  ExpressionAttributeNames: { '#name': 'name' },
}, { id: owner });

handler.getDetailForClient = (owner) => handler.get({
  ProjectionExpression: '#name',
  ExpressionAttributeNames: { '#name': 'name' },
}, { id: owner });

module.exports = handler;
