cmake_minimum_required(VERSION 3.10)
project(romi-js-core-interfaces NONE)

find_package(rmf_door_msgs REQUIRED)
find_package(rmf_lift_msgs REQUIRED)
find_package(rmf_fleet_msgs REQUIRED)
find_package(rmf_task_msgs REQUIRED)
find_package(rmf_dispenser_msgs REQUIRED)
find_package(rmf_workcell_msgs REQUIRED)
find_package(building_map_msgs REQUIRED)

add_custom_target(build ALL npm install WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

# A dummy install target for colcon to find. Javascript doesn't have the concept of "install".
install(CODE "")
