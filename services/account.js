'use strict';

const md5 = require('md5-hex');

require('module-alias/register');

const config = require('#/config');
const errors = require('#/libs/errors');
const { isEmpty } = require('#/libs/util');

// for MySQL
// const AccountSDB = require('#/db/sequelize/account');
// const AccountQuitSDB = require('#/db/sequelize/account/quit');
// for DynamoDB
// const AccountDDB = require('#/db/dynamodb/account');
// const AccountQuitDDB = require('#/db/dynamodb/account/quit');
// for MongoDB
const AccountMDB = require('#/db/mongoose/account');
const AccountQuitMDB = require('#/db/mongoose/account/quit');

const { AccountType } = require('#/constants');

const GoogleRequest = require('./requests/google');
const AppleRequest = require('./requests/apple');
const FacebookRequest = require('./requests/facebook');
const KakaoRequest = require('./requests/kakao');
const NaverRequest = require('./requests/naver');
const LineRequest = require('./requests/line');

exports.verifyGoogleToken = async (id, idToken, accessToken) => {
  try {
    const ids = await Promise.all([
      GoogleRequest.verifyIdToken(idToken),
      GoogleRequest.verifyAccessToken(accessToken),
    ]);

    if ((ids[0] !== ids[1]) || (ids[0] !== id)) {
      throw new Error('id not matched');
    }
  } catch (err) {
    return Promise.reject([new errors.VerificationSocialAccountError(), err]);
  }
};

exports.verifyAppleToken = async (id, accessToken) => {
  try {
    const userInfo = await AppleRequest.retrieveUser(accessToken);

    if (userInfo.aud !== config.appleAppKey || userInfo.sub !== id) {
      throw new Error('aud or sub not matched');
    }
  } catch (err) {
    return Promise.reject([new errors.VerificationSocialAccountError(), err]);
  }
};

exports.verifyFacebookToken = async (id, accessToken) => {
  try {
    const idFrom = await FacebookRequest.verifyToken(accessToken);

    if (id !== idFrom) throw new Error('id not matched');
  } catch (err) {
    return Promise.reject([new errors.VerificationSocialAccountError(), err]);
  }
};

exports.verifyKakaoToken = async (id, accessToken) => {
  try {
    const idFrom = await KakaoRequest.verifyToken(accessToken);

    if (id !== idFrom) throw new Error('id not matched');
  } catch (err) {
    return Promise.reject([new errors.VerificationSocialAccountError(), err]);
  }
};

exports.verifyNaverToken = async (id, accessToken) => {
  try {
    const idFrom = await NaverRequest.verifyToken(accessToken);

    if (id !== idFrom) throw new Error('id not matched');
  } catch (err) {
    return Promise.reject([new errors.VerificationSocialAccountError(), err]);
  }
};

exports.verifyLineToken = async (id, accessToken) => {
  try {
    const idFrom = await LineRequest.verifyToken(accessToken);

    if (id !== idFrom) throw new Error('id not matched');
  } catch (err) {
    return Promise.reject([new errors.VerificationSocialAccountError(), err]);
  }
};

exports.checkDuplication = async (type, id) => {
  // for MySQL
  // const item = await AccountSDB.get({ type, id }, { attributes: ['id', 'type'] });
  // for DynamoDB
  // const item = await AccountDDB.get({ type, id });
  // for MongoDB
  const item = await AccountMDB.get({ type, id });

  if (item) throw new errors.AlreadyExistAccountError();
};

exports.checkDuplicationByOwner = async (type, owner) => {
  // for MySQL
  // const items = await AccountSDB.query({ owner, type }, { attributes: ['id', 'type'] });
  // for DynamoDB
  // const items = await AccountDDB.queryByOwnerType(owner, type);
  // for MongoDB
  const items = await AccountMDB.get({ owner, type });

  if (items.length) throw new errors.AlreadyExistAccountError();
};

exports.getObject = async (type, id, checkAuth = true) => {
  // for MySQL
  // const item = await AccountSDB.get({ type, id });
  // for DynamoDB
  // const item = await AccountDDB.get({ type, id });
  // for MongoDB
  const item = await AccountMDB.get({ type, id });

  if (!item) throw new errors.NoAccountError();
  if (checkAuth && item.auth === 0) throw new errors.NotAuthorizedError();

  return item;
};

exports.getAllObjectsByOwner = async (owner) => {
  // for MySQL
  // const items = await AccountSDB.query({ owner });
  // for DynamoDB
  // const items = await AccountDDB.queryAllByOwner(owner);
  // for MongoDB
  const items = await AccountMDB.query({ owner });

  return items;
};

exports.createObject = async (params/* , transaction */) => { // for MySQL
  const {
    type, id, password, owner,
  } = params;

  const account = {
    type, id, owner,
  };
  if (type === AccountType.EMAIL) account.auth = 0;
  // for MySQL
  // else account.auth = 1;
  if (password && (type === AccountType.USERNAME || type === AccountType.EMAIL)) {
    account.password = md5(password);
  }

  // for MySQL
  // await AccountSDB.put(transaction, account);
  // for DynamoDB
  // await AccountDDB.put(account);
  // for MongoDB
  await AccountMDB.put(account);

  return account;
};

exports.checkPassword = async (account, password) => {
  if (md5(password) !== account.password) throw new errors.InvalidPasswordError();
};

exports.changeObject = async (account, params) => {
  const { password, auth } = params;

  if (password && account.type !== AccountType.USERNAME && account.type !== AccountType.EMAIL) {
    throw new errors.InvalidInputError('no password type');
  }

  const value = {};
  if (auth && account.auth !== auth) {
    account.auth = auth;
    value.auth = auth;
  }
  if (password) {
    const newPassword = md5(password);
    if (account.password !== newPassword) {
      account.password = newPassword;
      value.password = newPassword;
    }
  }

  if (!isEmpty(value)) {
    const { type, id } = account;
    // for MySQL
    // await AccountSDB.update({ type, id }, value);
    // for DynamoDB
    // await AccountDDB.set({ type, id }, value);
    // for MongoDB
    await AccountMDB.updateOne({ type, id }, value);
  }
};

exports.removeAllObjectsByOwner = async (owner, accountQuits/* , transaction */) => { // for MySQL
  accountQuits = accountQuits.map((a) => ({
    type: a.type,
    accountId: a.id,
    item: JSON.stringify(a),
  }));

  await Promise.all([
    // for MySQL
    // AccountSDB.delete({ owner }, { transaction }),
    // AccountQuitSDB.put(transaction, accountQuits),
    // for DynamoDB
    // AccountDDB.delete({ owner }),
    // AccountQuitDDB.put(accountQuits),
    // for MongoDB
    AccountMDB.delete({ owner }),
    AccountQuitMDB.put(accountQuits),
  ]);
};
