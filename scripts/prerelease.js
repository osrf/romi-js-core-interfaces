const childProcess = require('child_process');

const gitStatus = childProcess.execSync('git status --porcelain=v1');
if (gitStatus.length) {
  console.error('There are uncommitted changes, please commit all changes before running.');
  process.exit(1);
}
childProcess.execSync(
  'npm run docs && git add docs',
);
