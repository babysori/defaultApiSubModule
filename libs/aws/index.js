'use strict';

const Index = require('aws-sdk');
const https = require('https');

require('module-alias/register');

const config = require('#/config');

if (process.env.NODE_ENV === 'develop') {
  const options = {
    endpoint: 'http://localhost:8000',
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  };

  exports.ddb = new Index.DynamoDB(options);
  exports.doc = new Index.DynamoDB.DocumentClient(options);
} else {
  const agent = new https.Agent({
    maxSocket: 256,
    keepAlive: true,
    rejectUnauthorized: true,
  });

  Index.config.update({
    region: config.aws.region,
    httpOptions: { agent },
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  });

  exports.ddb = new Index.DynamoDB();
  exports.doc = new Index.DynamoDB.DocumentClient();
  exports.s3 = new Index.S3({
    signatureVersion: 'v4',
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  });

  exports.cloudfront = new Index.CloudFront();

  exports.sns = new Index.SNS();
  exports.ses = new Index.SES({
    region: 'us-east-1', // 서울 지역은 서비스 불가.
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  });
}
