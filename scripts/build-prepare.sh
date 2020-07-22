#!/bin/bash
# Create a colcon workspace folder inside the project and downloads related projects
[ -d "colcon_ws" ] && rm -rf colcon_ws 
mkdir colcon_ws
cd colcon_ws
mkdir src
cd src
git clone --depth 1 https://github.com/osrf/rmf_core.git
git clone --depth 1 https://github.com/osrf/traffic_editor
mkdir romi-js-core-interfaces
cd ../../
rsync -Rr . --exclude colcon_ws --exclude node_modules colcon_ws/src/romi-js-core-interfaces/


