'use strict';

const Mongoose = require('mongoose');

const { Schema } = Mongoose;
const { Types } = Schema;
const { Mixed, ObjectId } = Types;

const schema = new Schema({
  _id: { type: ObjectId },
  type: { type: String, required: true },
  accountId: { type: String, required: true },
  item: { type: Mixed },
  password: { type: String },
  auth: { type: Boolean },
  owner: { type: String },
}, {
  collection: 'account_quit',
  versionKey: false,
});

module.exports = (mongoose) => mongoose.model('accountQuit', schema);
