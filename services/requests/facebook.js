'use strict';

const request = require('request');

require('module-alias/register');

const errors = require('#/libs/errors');

const VERIFICATION_URL = 'https://graph.facebook.com/v7.0/me';

exports.verifyToken = (access_token) => new Promise((resolve, reject) => {
  request({
    method: 'GET',
    url: VERIFICATION_URL,
    qs: { access_token, fields: 'id' },
  }, (e, r, b) => {
    if (e || !b) {
      return reject([new errors.InvalidInputError(), e]);
    }
    try {
      b = JSON.parse(b);
    } catch (err) {
      return reject([new errors.ParsingError(), err]);
    }

    return resolve(b.id ? `${b.id}` : null);
  });
});
