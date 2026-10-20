const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const env = process.argv[2] || 'staging';
const file = `${pkg.name}-${pkg.version}.tgz`;
const target = path.join(process.env.DEPLOY_DIR || 'deployments', env);

fs.mkdirSync(target, { recursive: true });
fs.copyFileSync(file, path.join(target, file));
fs.writeFileSync(path.join(target, 'DEPLOYED.txt'), `${file} desplegado el ${new Date().toISOString()}\n`);
console.log(`Desplegado ${file} en ${target}`);
