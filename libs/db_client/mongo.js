'use strict';

const { MongoClient } = require('mongodb'); // eslint-disable-line import/no-unresolved

require('module-alias/register');

const errors = require('#/libs/errors');
const logger = require('#/libs/logger');

module.exports = (dbconfig) => {
  const { endPoint, database, useSSL } = dbconfig;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  if (useSSL) {
    options.ssl = true;
    options.sslCA = `${process.cwd()}/.keys/rds-combined-ca-bundle.pem`;
    options.retryWrites = false;
  }

  const client = new MongoClient(endPoint, options);

  client.connect((err) => {
    if (err) {
      logger.error(err);
    }
  });

  const db = client.db(database);

  return ({
    async get(collection, query, projection) {
      try {
        return db.collection(collection).findOne(query, projection);
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async query(collection, query, projection) {
      try {
        return db.collection(collection).find(query, projection);
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async put(collection, ...item) {
      const { length } = item;
      if (!length) throw new Error('no item');

      try {
        const c = db.collection(collection);

        if (length === 1) {
          [item] = item;
          if (Array.isArray(item)) {
            if (!item.length) throw new errors.InternalError('invalid parameter');

            await c.insertMany(item);
          } else {
            await c.insertOne(item);
          }
        } else {
          await c.insertMany(item);
        }
      } catch (err) {
        if (err.name === 'InternalError') throw err;

        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async updateOne(collection, query, value, upsert = false) {
      try {
        await db.collection(collection).updateOne(query, value, { upsert });
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async update(collection, query, value, upsert = false) {
      try {
        await db.collection(collection).updateMany(query, value, { upsert });
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async deleteOne(collection, query) {
      try {
        await db.collection(collection).deleteOne(query);
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async delete(collection, query) {
      try {
        await db.collection(collection).deleteMany(query);
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },

    async truncate(collection) {
      try {
        await db.collection(collection).drop();
      } catch (err) {
        err.tableName = collection;
        throw new errors.DbError(null, err);
      }
    },
  });
};
