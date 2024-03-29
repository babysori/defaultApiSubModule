'use strict';

const fs = require('fs');
const path = require('path');

const basePath = `${__dirname}/index.js`;

function makeTable(file, dir) {
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
    return fs.readdirSync(fullPath).forEach((f) => makeTable(f, d));
  }

  if (path.extname(file) === '.js' && fullPath !== basePath) {
    require(fullPath); // eslint-disable-line global-require
  }
}

exports.sync = makeTable;
