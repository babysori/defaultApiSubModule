'use strict';

function addPrefix(name) {
  if (process.env.NODE_ENV === 'production') return name;
  return `test.${name}`;
}

exports.DDBTableName = Object.freeze({
  TEMPLATE: addPrefix('template'),
});
