'use strict';

// 보안관계로 노출을 피하기 위해 env로부터 읽어오도록 처리한 부분이 있음.

const { env } = process;
const raw = {
  common: {
    isLocal: env.NODE_ENV === 'develop',
    isTest: env.NODE_ENV === 'develop' || env.NODE_ENV === 'test',
    aws: {
      region: 'ap-northeast-2', // Seoul
      accessKeyId: env.AWS_ACCCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  },

  develop: {
    logLevel: 'warn',
  },

  test: {
    logLevel: 'info',
  },

  production: {
    logLevel: 'fatal',
  },
};

module.exports = Object.assign(raw.common, raw[env.NODE_ENV] || {});
