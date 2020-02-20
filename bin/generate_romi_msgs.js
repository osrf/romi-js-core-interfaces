#!/usr/bin/env node

const ChildProcess = require('child_process');

ChildProcess.spawn('python3', [
  `${__dirname}/../scripts/gentypes.py`,
  ...process.argv.slice(2),
], { stdio: 'inherit' });
