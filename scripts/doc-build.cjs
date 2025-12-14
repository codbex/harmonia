'use strict';

var fs = require('fs');

const harmoniaFiles = fs.globSync('dist/*');

harmoniaFiles.forEach((file) => {
  copyFile(file, 'docs/public/lib/node_modules/@codbex/harmonia/dist', false);
});

function copyFile(path, to, recursive = true) {
  const fileName = path.substring(path.lastIndexOf('/') + 1);
  fs.cpSync(`./${path}`, `${to}/${fileName}`, { recursive: recursive });
}
