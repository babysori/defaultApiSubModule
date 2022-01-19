'use strict';

const { ddb } = require('../../libs/aws');
const { TEMPLATE } = require('../../libs/constants').DDBTableName;

const params = {
  TableName: TEMPLATE,
  KeySchema: [
    { AttributeName: 'owner', KeyType: 'HASH' },
    { AttributeName: 'date', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'owner', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'S' },
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'templateId', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  LocalSecondaryIndexes: [
    {
      IndexName: 'owner-id-index',
      KeySchema: [
        { AttributeName: 'owner', KeyType: 'HASH' },
        { AttributeName: 'id', KeyType: 'RANGE' },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'templateId-date-index',
      KeySchema: [
        { AttributeName: 'templateId', KeyType: 'HASH' },
        { AttributeName: 'date', KeyType: 'RANGE' },
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
