'use strict';

function addPrefix(name) {
  if (process.env.NODE_ENV === 'production') return name;
  return `test.${name}`;
}

exports.AccountType = Object.freeze({
  UID: 'uid',
  USERNAME: 'username',
  EMAIL: 'email',
  GOOGLE: 'google',
  APPLE: 'apple',
  FACEBOOK: 'fb',
  KAKAO: 'kakao',
  NAVER: 'naver',
  LINE: 'line',
});

exports.DDBTableName = Object.freeze({
  ACCOUNT: addPrefix('account'),
  ACCOUNT_QUIT: addPrefix('account.quit'),
  USER: addPrefix('user'),
  USER_QUIT: addPrefix('user.quit'),
});
