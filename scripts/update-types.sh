#!/bin/bash
COLCON_WORKSPACE=~/colcon_ws

source /opt/ros/eloquent/setup.bash
cd $COLCON_WORKSPACE
rm -rf build install log src
mkdir src
cd src
git clone --depth 1 https://github.com/osrf/rmf_core.git
git clone --depth 1 https://github.com/osrf/traffic_editor
git clone https://github.com/osrf/romi-js-core-interfaces

cd $COLCON_WORKSPACE
colcon build
cd $COLCON_WORKSPACE

source install/setup.bash 
cd src/romi-js-core-interfaces
npm run-script build:gen
npm run-script clean
cd ..
tar -cvzf romi-js-core-interfaces.tar.gz romi-js-core-interfaces
zip romi-js-core-interfaces.zip romi-js-core-interfaces