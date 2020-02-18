import * as romicore from '../lib';
import { LiftRequest } from '../lib/romi-msgs';

async function requestLift() {
  const transport = await romicore.RclTransport.create('example');

  const buildingMap = (await transport.call(romicore.getBuildingMap, {})).building_map;

  const lift = buildingMap.lifts[0];
  const request: LiftRequest = {
    destination_floor: lift.levels[0],
    door_state: LiftRequest.DOOR_OPEN,
    lift_name: lift.name,
    request_time: romicore.toRosTime(new Date()),
    request_type: LiftRequest.REQUEST_AGV_MODE,
    session_id: 'example',
  }
  const pub = transport.createPublisher(romicore.liftRequests);
  pub.publish(request);
}

requestLift();
