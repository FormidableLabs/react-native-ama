const path = require('path');

// INIT_CWD points to where `npm install` or `yarn install` was invoked
const initCwd = process.env.INIT_CWD || '';
const packageRoot = __dirname;

// Detect if this is running as part of the monorepo installation
const isMonorepo = initCwd.includes(path.join(packageRoot, '..', '..'));

// If running in the monorepo context, skip the postinstall script
if (isMonorepo) {
  console.log('Skipping postinstall: Running within monorepo');
  process.exit(0);
}

// If installed as a standalone dependency, run the postinstall logic
console.log('Running postinstall: User installation');
require('./../dist/scripts/create-config.js');
