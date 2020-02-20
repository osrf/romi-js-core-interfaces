cmake_minimum_required(VERSION 3.10)
project(romi-js-core-interfaces NONE)

add_custom_target(build ALL npm install WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

# A dummy install target for colcon to find, we don't actually want to install anything, just build
# the project when the dependencies are outdated.
install(CODE "")
