'use strict';

require('module-alias/register');

const errors = require('#/libs/errors');
const { UniqueId } = require('#/libs/util');

function exchangeQueryId(query) {
  if (!query._id && query.id) { // eslint-disable-line no-underscore-dangle
    query._id = query.id; // eslint-disable-line no-underscore-dangle
    delete query.id;
  }

  return query;
}

function checkId(items) {
  if (items.length) {
    items.forEach((i) => {
      if (!i._id) i._id = UniqueId(); // eslint-disable-line no-underscore-dangle
    });
  } else if (!items._id) { // eslint-disable-line no-underscore-dangle
    items._id = UniqueId(); // eslint-disable-line no-underscore-dangle
  }

  return items;
}

module.exports = (Model) => ({
  async get(query, projection) {
    try {
      return await Model.findOne(exchangeQueryId(query), projection);
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async query(query, projection) {
    try {
      return await Model.find(exchangeQueryId(query), projection);
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async count(query) {
    try {
      return await Model.count(exchangeQueryId(query));
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async put(...item) {
    const { length } = item;
    if (!length) throw new Error('no item');

    try {
      if (length === 1) {
        [item] = item;
        if (Array.isArray(item)) {
          if (!item.length) throw new errors.InternalError('invalid parameter');

          checkId(item);

          const parallelList = [];
          item.forEach((i) => {
            const data = new Model(i);
            parallelList.push(data.save());
          });

          await Promise.all(parallelList);
        } else {
          const data = new Model(checkId(item));
          await data.save();
        }
      } else {
        const data = new Model(checkId(item));
        await data.save();
      }
    } catch (err) {
      if (err.name === 'InternalError') throw err;

      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async updateOne(query, value, upsert = false) {
    if (!value || typeof (value) !== 'object' || Array.isArray(value)) {
      throw new Error('invalid parameter');
    }

    try {
      await Model.updateOne(exchangeQueryId(query), value, { upsert });
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async update(query, value, upsert = false) {
    if (!value || typeof (value) !== 'object' || Array.isArray(value)) {
      throw new Error('invalid parameter');
    }

    try {
      await Model.updateMany(exchangeQueryId(query), value, { upsert });
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async deleteOne(query) {
    try {
      await Model.deleteOne(exchangeQueryId(query));
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async delete(query) {
    try {
      await Model.deleteMany(exchangeQueryId(query));
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },

  async truncate() {
    try {
      await Model.collection.drop();
    } catch (err) {
      err.tableName = Model.modelName;
      throw new errors.DbError(null, err);
    }
  },
});
