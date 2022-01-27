'use strict';

const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const schema = new Schema({
  type: { type: String, required: true },
  _id: { type: String, alias: 'id' },
  password: { type: String },
  auth: { type: Boolean },
  owner: { type: String },
}, {
  collection: 'account',
  versionKey: false,
});

module.exports = (mongoose) => mongoose.model('account', schema);
