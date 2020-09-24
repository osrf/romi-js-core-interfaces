#!/bin/bash
set -e

npm ci --unsafe-perm
. /opt/ros/foxy/setup.bash && npm run build
npm test
CHROME_BIN=chromium-browser npm run test:browser -- --browsers ChromeHeadlessWithoutSandbox
