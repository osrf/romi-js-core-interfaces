#!/bin/bash
# Create a colcon workspace folder inside the project and downloads related projects
[ ! -d "colcon_ws" ] && mkdir colcon_ws
cd colcon_ws
[ ! -d "src" ] && mkdir src
cd src
[ -d "rmf_core" ] && git pull || git clone --depth 1 https://github.com/osrf/rmf_core.git
[ -d "traffic_editor" ] && git pull || git clone --depth 1 https://github.com/osrf/traffic_editor
[ ! -d "romi-js-core-interfaces" ] && ln -s ../../. romi-js-core-interfaces
cd ../../

