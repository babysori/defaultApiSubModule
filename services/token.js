'use strict';

const md5 = require('md5-hex');

require('module-alias/register');

const config = require('#/config');
const errors = require('#/libs/errors');
const jwt = require('#/libs/jwt');
const { UniqueId } = require('#/libs/util');

const TokenRedis = require('#/db/redis/token');

exports.checkRefreshTokenValid = async (owner, token) => {
  const tokenValue = await TokenRedis.getRefreshToken(token);

  if (tokenValue !== owner) throw new errors.InvalidRefreshTokenError();
};

exports.createAccessToken = (params) => {
  params.exp = Math.floor(Date.now() / 1000) + config.accessTokenExpiryTime;

  return jwt.generate(params);
};

exports.createRefreshToken = async (owner) => {
  const token = md5(UniqueId());

  await TokenRedis.setRefreshToken(owner, token);

  return token;
};

exports.setTokenCookie = (res, token, refreshToken) => {
  const options = { path: '/' };

  res.cookie('access_token', token, options);
  if (refreshToken) res.cookie('refresh_token', refreshToken, options);
};
