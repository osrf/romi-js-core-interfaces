#!/bin/bash
# Create a colcon workspace and build the project 
cd colcon_ws
source /opt/ros/eloquent/setup.bash
colcon build
source install/setup.bash 
cd src/romi-js-core-interfaces
npm run-script build:gen
npm run-script clean
# Go home
cd ../../
