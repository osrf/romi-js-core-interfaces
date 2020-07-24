#!/bin/bash
# Source the colcon workspace if exists, before building project  
[ "colcon_ws/install/setup.bash" ] && echo "sourcing" && source colcon_ws/install/setup.bash
npm run build:gen && tsc && webpack