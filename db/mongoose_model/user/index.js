'use strict';

const Mongoose = require('mongoose');

const { Schema } = Mongoose;
const { Types } = Schema;
const { ObjectId } = Types;

const schema = new Schema({
  _id: { type: ObjectId },
  abuser: { type: Boolean },
  resumeAt: { type: Date },
  name: { type: String },
  nickname: { type: String },
}, {
  collection: 'user',
  versionKey: false,
});

// schema.virtual('fullname').get(() => this.first + ' ' + this.last);
// schema.set('toJSON', { virtuals: true });

module.exports = (mongoose) => mongoose.model('user', schema);
