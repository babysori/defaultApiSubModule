'use strict';

require('module-alias/register');

const errors = require('#/libs/errors');

const UserSDB = require('#/db/sequelize/user');
const UserQuitSDB = require('#/db/sequelize/user.quit');

exports.getObject = async (owner) => {
  const user = await UserSDB.get({ id: owner });

  if (!user) throw new errors.NoUserError();
  if (user.abuser) throw new errors.AbuserError();
  if (user.resumeAt && user.resumeAt > Date.now()) throw new errors.SuspendedUserError();

  return user;
};

exports.getInfo = async (owner) => {
  const item = await UserSDB.getForClient(owner);

  if (!item) throw new errors.NoUserError();

  return item;
};

exports.getDetailInfo = async (owner) => {
  const item = await UserSDB.getDetailForClient(owner);

  if (!item) throw new errors.NoUserError();

  return item;
};

exports.createObject = async (params, transaction) => {
  const {
    owner, name, nickname,
  } = params;

  const user = {
    id: owner, name, nickname,
  };

  await UserSDB.put(transaction, user);

  return user;
};

exports.changeObject = async (user, params) => {
  const {
    nickname,
  } = params;

  const where = { id: user.id };
  const value = { nickname };
  await UserSDB.update(where, value);
};

exports.removeObject = async (userQuit, transaction) => {
  userQuit = {
    id: userQuit.id,
    item: JSON.stringify(userQuit),
  };

  await Promise.all([
    UserSDB.delete({ id: userQuit.id }, { transaction }),
    UserQuitSDB.put(transaction, userQuit),
  ]);
};
