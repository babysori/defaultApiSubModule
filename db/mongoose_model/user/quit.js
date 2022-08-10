'use strict';

const Mongoose = require('mongoose');

const { Schema } = Mongoose;
const { Types } = Schema;
const { Mixed, ObjectId } = Types;

const schema = new Schema({
  _id: { type: ObjectId },
  item: { type: Mixed },
}, {
  collection: 'user_quit',
  versionKey: false,
});

module.exports = (mongoose) => mongoose.model('userQuit', schema);
