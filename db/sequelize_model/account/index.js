'use strict';

require('module-alias/register');

const { AccountType } = require('#/constants');

module.exports = (sequelize, DataTypes) => sequelize.define(
  'account',
  {
    type: {
      type: DataTypes.ENUM(
        AccountType.UID, AccountType.USERNAME, AccountType.EMAIL, AccountType.GOOGLE,
        AccountType.APPLE, AccountType.FACEBOOK, AccountType.KAKAO, AccountType.NAVER,
        AccountType.LINE,
      ),
      allowNull: false,
      primaryKey: true,
    },
    id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(128),
    },
    auth: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    /**
     * 연결된 User 정보
     */
    owner: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  },
  {
    tableName: 'account',
    timestamps: true,
    indexes: [
      {
        name: 'idx_owner_type',
        unique: true,
        fields: [
          { attribute: 'owner', order: 'ASC' },
          { attribute: 'type', order: 'ASC' },
        ],
      },
    ],
  },
);
