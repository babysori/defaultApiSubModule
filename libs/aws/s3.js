'use strict';

const { s3 } = require('.');

exports.makePreSignedUrl = (Bucket, Key, type, ContentType, Expires) => s3.getSignedUrl(
  'putObject', {
    Bucket,
    Key,
    Expires,
    ContentType,
  },
);

exports.getPreSignedUrl = (Bucket, Key, filename, Expires) => {
  const params = {
    Bucket,
    Key,
    Expires,
  };

  if (filename) params.ResponseContentDisposition = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;

  return s3.getSignedUrl('getObject', params);
};
