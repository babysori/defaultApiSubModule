'use strict';

// 보안관계로 노출을 피하기 위해 env로부터 읽어오도록 처리한 부분이 있음.

const { env } = process;
const raw = {
  common: {
    isLocal: env.NODE_ENV === 'develop',
    isTest: env.NODE_ENV === 'develop' || env.NODE_ENV === 'test',
    isQA: Number(env.QA_MODE) || 0,

    aws: {
      region: 'ap-northeast-2', // Seoul
      accessKeyId: env.AWS_ACCCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },

    logDb: {
      endPoint: env.LOG_DB_END_POINT,
      database: 'logs',
    },

    sequelize: {
      username: env.SEQUELIZE_USER,
      password: env.SEQUELIZE_PASSWORD,
      database: 'default',
      host: env.SEQUELIZE_END_POINT,
      port: 3306,
      dialect: 'mysql',
      pool: {
        min: 2,
        max: 10,
        idle: 5000,
      },
      operatorsAliases: 0,
      logging: false,
    },
    mongoose: {
      endPoint: `${env.MONGOOSE_END_POINT}/default`,
    },
    redis: {
      endPoint: `${env.REDIS_END_POINT}`,
    },
  },

  develop: {
    logLevel: 'warn',

    clustering: false,
    makeTable: true,

    aws: {
      region: 'us-east-1',
      accessKeyId: 'key',
      secretAccessKey: 'key',
    },

    logDb: {
      endPoint: 'mongodb://localhost:27017',
      database: 'logs',
    },

    sequelize: {
      username: 'root',
      password: '1234',
      database: 'default',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql',
      pool: {
        min: 2,
        max: 10,
        idle: 5000,
      },
      operatorsAliases: 0,
      logging: console.log,
    },
    mongoose: {
      endPoint: 'mongodb://localhost:27017/default',
    },
    redis: {
      endPoint: 'localhost',
    },

    accessTokenExpiryTime: 3600 * 24,
  },

  test: {
    logLevel: 'info',

    clustering: true,
    makeTable: true,
  },

  production: {
    logLevel: 'fatal',

    clustering: true,
    makeTable: false,
  },
};

module.exports = Object.assign(raw.common, raw[env.NODE_ENV] || {});
