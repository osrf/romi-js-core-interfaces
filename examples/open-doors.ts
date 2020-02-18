import * as romicore from '../lib';
import { DoorMode } from '../lib/romi-msgs';

async function openDoors() {
  const transport = await romicore.RclTransport.create('example');

  const buildingMap = (await transport.call(romicore.getBuildingMap, {})).building_map;

  const pub = transport.createPublisher(romicore.doorRequests);
  for (const level of buildingMap.levels) {
    for (const door of level.doors) {
      pub.publish({
        door_name: door.name,
        request_time: romicore.toRosTime(new Date()),
        requested_mode: { value: DoorMode.MODE_OPEN },
        requester_id: 'example',
      });
    }
  }
}

openDoors();
