const packageJson = require('../package.json');
const child_process = require('child_process');
const packages = Object.keys(packageJson.docDependencies)
  .map((key) => `${key}@${packageJson.docDependencies[key]}`)
  .join(' ');

child_process.execSync(`npm install ${packages} --prefix ./docs/public/lib`, { stdio: [0, 1, 2] });
