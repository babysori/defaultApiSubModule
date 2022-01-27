'use strict';

require('module-alias/register');

const errors = require('#/libs/errors');

// for MySQL
// const UserSDB = require('#/db/sequelize/user');
// const UserQuitSDB = require('#/db/sequelize/user.quit');
// for DynamoDB
// const UserDDB = require('#/db/dynamodb/user');
// const UserQuitDDB = require('#/db/dynamodb/user/quit');
// for MongoDB
const UserMDB = require('#/db/mongoose/user');
const UserQuitMDB = require('#/db/mongoose/user/quit');
const { isEmpty } = require('#/libs/util');

exports.getObject = async (owner) => {
  // for MySQL
  // const user = await UserSDB.get({ id: owner });
  // for DynamoDB
  // const user = await UserDDB.get({ id: owner });
  // for MongoDB
  const user = await UserMDB.get({ id: owner });

  if (!user) throw new errors.NoUserError();
  if (user.abuser) throw new errors.AbuserError();
  if (user.resumeAt && user.resumeAt > Date.now()) throw new errors.SuspendedUserError();

  return user;
};

// 추가적으로 USER에 연관된 Table의 Data도 처리
exports.getInfo = async (owner) => {
  // for MySQL
  // const item = await UserSDB.getForClient(owner);
  // for DynamoDB
  // const item = await UserDDB.getForClient({ id: owner });
  // for MongoDB
  const item = await UserMDB.getForClient({ id: owner });

  if (!item) throw new errors.NoUserError();

  return item;
};

// 클라이언트에서 상세정보가 필요한 경우 사용함. USER에 연관된 Table의 Data도 처리.
exports.getDetailInfo = async (owner) => {
  // for MySQL
  // const item = await UserSDB.getDetailForClient(owner);
  // for DynamoDB
  // const item = await UserDDB.getDetailForClient(owner);
  // for MongoDB
  const item = await UserMDB.getDetailForClient(owner);

  if (!item) throw new errors.NoUserError();

  return item;
};

exports.createObject = async (params/* , transaction */) => { // for MySQL
  const {
    owner, name, nickname,
  } = params;

  const user = {
    id: owner, name, nickname,
  };

  // for MySQL
  // await UserSDB.put(transaction, user);
  // for DynamoDB
  // await UserDDB.put(user);
  // for MongoDB
  await UserMDB.put(user);

  return user;
};

exports.changeObject = async (user, params) => {
  const {
    nickname,
  } = params;
  const value = {};
  const { id } = user;

  if (nickname) value.nickname = nickname;

  if (!isEmpty(value)) {
    // for MySQL
    // await UserSDB.update({ id }, value);
    // for DynamoDB
    // await UserDDB.set({ id }, value);
    // for MongoDB
    await UserMDB.update({ id }, value);
  }

  user.nickname = nickname;
};

exports.removeObject = async (userQuit/* , transaction */) => { // for MySQL
  const { id } = userQuit;
  userQuit = {
    id,
    item: JSON.stringify(userQuit),
  };

  await Promise.all([
    // for MySQL
    // UserSDB.delete({ id: userQuit.id }, { transaction }),
    // UserQuitSDB.put(transaction, userQuit),
    // for DynamoDB
    // UserDDB.delete({ id }),
    // UserQuitDDB.put(userQuit),
    // for MongoDB
    UserMDB.delete({ id }),
    UserQuitMDB.put(userQuit),
  ]);
};
