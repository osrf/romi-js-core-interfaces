const childProcess = require('child_process');

const gitStatus = childProcess.execSync('git status --porcelain=v1');
if (gitStatus.length) {
  console.error('There are uncommitted changes, please commit all changes before running.');
  process.exit(1);
}
childProcess.execSync(
  // eslint-disable-next-line max-len
  'npm run clean && npm install && npm run build && npm test && npm run test:browser && npm run docs && git add docs',
);
