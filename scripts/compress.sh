#!/bin/bash
# Version key/value should be on his own line
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
cd colcon_ws/src/
cd romi-js-core-interfaces/
rm -rf node_modules/
cd ..
tar -cvzf romi-js-core-interfaces-$PACKAGE_VERSION.tar.gz romi-js-core-interfaces
zip romi-js-core-interfaces-$PACKAGE_VERSION.zip romi-js-core-interfaces
# Go home
cd ../../

