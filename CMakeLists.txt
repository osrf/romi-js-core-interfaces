cmake_minimum_required(VERSION 3.10)
project(romi-js-core-interfaces NONE)

set(
  rmf_msgs
  rmf_door_msgs
  rmf_lift_msgs
  rmf_fleet_msgs
  rmf_task_msgs
  rmf_dispenser_msgs
  rmf_workcell_msgs
  building_map_msgs
)

foreach(msg ${rmf_msgs})
  # fastrtps is broken "Could NOT find FastRTPS (missing: FastRTPS_INCLUDE_DIR FastRTPS_LIBRARIES)"
  # we don't really need this, it will work as long as ament can find the packages.
  # find_package(${msg} REQUIRED)
endforeach(msg)

add_custom_target(build ALL
  python3 bin/gentypes.py lib/core-msgs ${rmf_msgs} &&
  npx tsc --build &&
  npx webpack --mode production
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

# A dummy install target for colcon to find.
install(CODE "")
