'use strict';

require('module-alias/register');

const { ACCOUNT } = require('#/constants').DDBTableName;
// eslint-disable-next-line global-require
const handler = { ...require('#/libs/db_handler/dynamo')(ACCOUNT) };

handler.queryAllByOwner = (owner) => handler.queryAll(
  '#o = :o',
  { '#o': 'owner' },
  { ':o': owner },
  { IndexName: 'owner-type-index' },
);

handler.queryByOwnerType = (owner, type) => handler.query(
  '#o = :o and #t = :t',
  { '#o': 'owner', '#t': 'type' },
  { ':o': owner, ':type': type },
  { IndexName: 'owner-type-index' },
);

module.exports = handler;
