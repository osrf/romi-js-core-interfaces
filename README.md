# About RoMi-js

RoMi-js is a set of libraries to make it easier to interface with RoMi with nodejs or in the
browser.

# Installing

```
npm install @osrf/romi-js-core-interfaces
```

# Using RoMi-js

RoMi-js aims to provide an easy to use and flexible architecture. There are 2 main components in
RoMi-js, the interfaces which describes the topics and messages that connects to RoMi and a
transport that facilite the sending and receiving of these messages.

To use RoMi-js, first you have to choose a transport library suitable for your use case. Currently
there are 2 transport libraries available using rclnodejs and soss, rclnodejs only works on node
while soss only works on the browser. Install one of them depending on your use case

```
npm install @osrf/romi-js-rclnodejs-transport
```
or
```
npm install @osrf/romi-js-soss-transport
```

This example will use `@osrf/romi-js-rclnodejs-transport` but the code for other transports will be
almost the same.

## Typescript

RoMi-js can be used with either javascript or typescript. One of the main advantage of using RoMi-js
as opposed to rclnodejs or soss directly is the type information it provides so it is recommended to
use RoMi-js with typescript if possible.

## Obtaining an Instance of Transport

Each transport may have a different way to obtain an instance, in the case of the rclnodejs
transport, we need to use a `create` async method.

```ts
import { RclnodejsTransport } from '@osrf/romi-js-rclnodejs-transport';

async function main() {
  const transport = await RclnodejsTransport.create('nodeName');
}
```

## Receiving Messages

Each transport exposes a subscribe method to start listening to incoming messages, they take in a
`RomiTopic` which describes the internal interfaces used by ROS2. This package provides the core
interfaces used by RoMi, here is an example that subscribes and prints out the fleet state.

```ts
import { RclnodejsTransport } from '@osrf/romi-js-rclnodejs-transport';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

async function main() {
  const transport = await RclnodejsTransport.create('nodeName');
  transport.subscribe(RomiCore.fleetStates, fleetState => console.log(fleetState));
}
```

## Sending Messages

Sending messages is a matter of creating a publisher and then calling the publish method. The
example below will send a request to open a door.

```ts
import { RclnodejsTransport } from '@osrf/romi-js-rclnodejs-transport';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

async function main() {
  const transport = await RclnodejsTransport.create('nodeName');
  const publisher = transport.createPublisher(RomiCore.doorRequests);
  publisher.publish({
    door_name: 'doorName',
    request_time: RomiCore.toRosTime(new Date()),
    requested_mode: { value: RomiCore.DoorMode.MODE_OPEN },
    requester_id: 'nodeName',
  });
}
```

## Calling a Service

```ts
import { RclnodejsTransport } from '@osrf/romi-js-rclnodejs-transport';
import * as RomiCore from '@osrf/romi-js-core-interfaces';

async function main() {
  const transport = await RclnodejsTransport.create('nodeName');
  const resp = await transport.call(RomiCore.getBuildingMap, {});
  const buildingMap = resp.building_map;
}
```

## Hosting a Service

Not supported yet

## Specifying ROS2 QoL Options

Not supported yet

# Building

This package can be built using colcon or npm, it is recommended to build with colcon as that has
the advantage of making sure the dependencies are up to date.

## Using colcon

Create a colcon workspace.
```
mkdir -p colcon_ws/src
```
Refer to the [colcon documentation](https://colcon.readthedocs.io/en/released/) for more details on
how a colcon workspace works.

Checkout the required dependencies.
```
cd colcon_ws/src
git clone --depth 1 https://github.com/osrf/rmf_core.git
git clone --depth 1 https://github.com/osrf/traffic_editor
git clone https://github.com/osrf/romi-js-core-interfaces
```

Refer to the documentations of [rmf_core](https://github.com/osrf/rmf_core#Installation) and
[traffic_editor](https://github.com/osrf/traffic_editor#Installation) to prepare the workspace to
build them.

Run colcon in the workspace directory.
```
cd colcon_ws
colcon build
```

## Using npm

Follow the instructions of [rmf_core](https://github.com/osrf/rmf_core#Installation) and
[traffic_editor](https://github.com/osrf/traffic_editor#Installation) to build and install them.

Build and install with npm
```
npm install
```
