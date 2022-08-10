'use strict';

const fs = require('fs');
const path = require('path');
const Mongoose = require('mongoose');

require('module-alias/register');

const config = require('#/config');
const { dotCaseToCamelCase } = require('#/libs/util');

const basePath = `${__dirname}/index.js`;

const options = { useNewUrlParser: true, useUnifiedTopology: true };
if (config.mongoose.useSSL) {
  options.ssl = true;
  options.sslCA = `${process.cwd()}/.keys/rds-combined-ca-bundle.pem`;
  options.retryWrites = false;
}
const mongoose = Mongoose.createConnection(config.mongoose.endPoint, options);
const db = { mongoose };

function importFile(file, dir) {
  let fullPath = __dirname;

  if (file) {
    if (dir) {
      fullPath = path.join(__dirname, dir, file);
    } else {
      fullPath = path.join(__dirname, file);
    }
  }

  const stats = fs.statSync(fullPath);

  if (stats.isDirectory()) {
    const d = dir ? `${dir}/${file}` : file;
    return fs.readdirSync(fullPath).forEach((f) => importFile(f, d));
  }

  if (path.extname(file) === '.js' && fullPath !== basePath) {
    const r = require(fullPath); // eslint-disable-line global-require

    if (r) {
      let name = path.basename(file, '.js');

      if (name === 'index') {
        name = dir;
      } else {
        name = dir ? path.join(dir, name) : name;
      }
      name = name.replace(/\//g, '.');

      db[dotCaseToCamelCase(name)] = r(mongoose);
    }
  }
}

importFile();

module.exports = db;
