'use strict';

require('module-alias/register');

const config = require('#/config');

const RedisClient = require('./index');

const REFRESH_TOKEN_KEY = (token) => `token:refresh:${token}`;

exports.getRefreshToken = (token) => RedisClient.get(REFRESH_TOKEN_KEY(token));

exports.setRefreshToken = (owner, token) => RedisClient.setAndExpire(
  REFRESH_TOKEN_KEY(token),
  owner,
  config.refreshTokenExpiryTime,
);
