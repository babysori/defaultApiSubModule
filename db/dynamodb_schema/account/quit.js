'use strict';

require('module-alias/register');

const { ddb } = require('#/libs/aws');
const { ACCOUNT_QUIT } = require('#/constants').DDBTableName;

const params = {
  TableName: ACCOUNT_QUIT,
  KeySchema: [
    { AttributeName: 'quitId', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'quitId', AttributeType: 'S' },
    { AttributeName: 'type', AttributeType: 'S' },
    { AttributeName: 'id', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'type-id-index',
      KeySchema: [
        { AttributeName: 'type', KeyType: 'HASH' },
        { AttributeName: 'id', KeyType: 'RANGE' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
};

ddb.createTable(params, (err, data) => {
  if (err && (!/^Table already/.test(err.message) && err.code !== 'ResourceInUseException')) {
    console.error(`${params.TableName} Unable to create table. Error JSON: ${JSON.stringify(err, null, 2)}`);
  } else if (!err) {
    console.log(`Created table. Table description JSON:  ${JSON.stringify(data, null, 2)}`);
  }
});
