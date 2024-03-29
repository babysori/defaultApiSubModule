'use strict';

require('module-alias/register');

const { doc } = require('#/libs/aws');
const errors = require('#/libs/errors');

async function batchGet(TableName, Keys) {
  const data = await doc.batchGet({
    RequestItems: {
      [TableName]: { Keys },
    },
  }).promise();

  return data.Responses ? data.Responses[TableName] || [] : [];
}

async function batchWrite(TableName, Items) {
  const params = Items.map((i) => ({
    PutRequest: {
      Item: i,
    },
  }));

  await doc.batchWrite({
    RequestItems: {
      [TableName]: params,
    },
  }).promise();
}

module.exports = (TableName) => ({
  async get(params, ...Key) {
    if (!Key.length) {
      if (!params) throw new Error('no item');

      Key = [params];
      params = undefined;
    }

    const { length } = Key;

    try {
      if (length === 1) {
        [Key] = Key;
        if (Array.isArray(Key)) {
          if (!Key.length) throw new errors.InternalError('invalid parameter');
          return await batchGet(TableName, Key);
        }

        params = {
          TableName,
          Key,
          ...(params || {}),
        };

        const data = await doc.get(params).promise();
        return data.Item;
      }

      return await batchGet(TableName, Key);
    } catch (err) {
      if (err.name === 'InternalError') throw err;

      err.tableName = TableName;
      throw new errors.DbError(null, err);
    }
  },

  async query(
    KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, params,
  ) {
    const newParams = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ...(params || {}),
    };

    try {
      const data = await doc.query(newParams).promise();

      if (data.LastEvaluatedKey) {
        const nextParams = {
          ...params,
          ExclusiveStartKey: data.LastEvaluatedKey,
        };

        data.Items.next = async () => this.query(
          KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, nextParams,
        );
      }

      if (data && data.Items && data.Items.length) return data.Items;
      return [];
    } catch (err) {
      err.tableName = TableName;
      throw new errors.DbError(null, err);
    }
  },

  async queryLimit(
    KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, params, limit,
  ) {
    let list = [];

    let items = await this.query(
      KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, params,
    );

    if (limit && items.length >= limit) return items.slice(0, limit);

    list = list.concat(items);
    while (items.next) {
      items = await items.next();
      list = list.concat(items);

      if (limit && list.length >= limit) return list.slice(0, limit);
    }

    return list;
  },

  async queryAll(
    KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, params,
  ) {
    return this.queryLimit(
      KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, params, 0,
    );
  },

  async count(KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues, params,) {
    const newParams = {
      TableName,
      KeyConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      Select: 'COUNT',
      ...(params || {}),
    };

    return doc.scan(newParams).promise();
  },

  async put(...Item) {
    const { length } = Item;
    if (!length) throw new Error('no item');

    try {
      if (length === 1) {
        [Item] = Item;
        if (Array.isArray(Item)) {
          if (!Item.length) throw new errors.InternalError('invalid parameter');
          await batchWrite(TableName, Item);
        } else {
          await doc.put({ TableName, Item }).promise();
        }
      } else {
        await batchWrite(TableName, Item);
      }
    } catch (err) {
      if (err.name === 'InternalError') throw err;

      err.tableName = TableName;
      throw new errors.DbError(null, err);
    }
  },

  async set(Key, value, increasingFields = []) {
    if (!value || typeof (value) !== 'object' || Array.isArray(value)) {
      throw new Error('invalid parameter');
    }

    const updatedFields = Object.keys(value);
    const AttributeUpdates = {};

    updatedFields.forEach((uf) => {
      const Value = value[uf];

      if (Value === undefined || Value === null || Value === '') {
        AttributeUpdates[uf] = { Action: 'DELETE' };
        return;
      }

      if (increasingFields.indexOf(uf) < 0) {
        AttributeUpdates[uf] = { Action: 'PUT', Value };
      } else {
        AttributeUpdates[uf] = { Action: 'ADD', Value };
      }
    });

    try {
      await doc.update({
        TableName,
        Key,
        AttributeUpdates,
      }).promise();
    } catch (err) {
      err.tableName = TableName;
      throw new errors.DbError(null, err);
    }
  },

  async increase(Key, value) {
    if (!value || typeof (value) !== 'object' || Array.isArray(value)) {
      throw new Error('invalid parameter');
    }

    return this.update(Key, value, Object.keys(value));
  },

  async delete(Key) {
    try {
      await doc.delete({
        TableName,
        Key,
      }).promise();
    } catch (err) {
      err.tableName = TableName;
      throw new errors.DbError(null, err);
    }
  },

  async trucate() {
    throw new Error('unsupported');
  },
});
