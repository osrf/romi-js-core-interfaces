import { RomiService, RomiTopic } from '../transport';
import * as msgs from './core-msgs';
import { GetBuildingMap_Response, GetBuildingMap_Request } from './core-msgs';

// Topics

export const doorStates: RomiTopic<msgs.DoorState> = {
  validate: msg => msgs.DoorState.fromObject(msg),
  type: msgs.DoorState.typeName,
  topic: 'door_states',
};

export const doorRequests: RomiTopic<msgs.DoorRequest> = {
  validate: msg => msgs.DoorRequest.fromObject(msg),
  type: msgs.DoorRequest.typeName,
  topic: 'door_requests',
};

export const adapterDoorRequests: RomiTopic<msgs.DoorRequest> = {
  validate: msg => msgs.DoorRequest.fromObject(msg),
  type: msgs.DoorRequest.typeName,
  topic: 'adapter_door_requests',
};

export const liftStates: RomiTopic<msgs.LiftState> = {
  validate: msg => msgs.LiftState.fromObject(msg),
  type: msgs.LiftState.typeName,
  topic: 'lift_states',
};

export const liftRequests: RomiTopic<msgs.LiftRequest> = {
  validate: msg => msgs.LiftRequest.fromObject(msg),
  type: msgs.LiftRequest.typeName,
  topic: 'lift_requests',
};

export const adapterLiftRequests: RomiTopic<msgs.LiftRequest> = {
  validate: msg => msgs.LiftRequest.fromObject(msg),
  type: msgs.LiftRequest.typeName,
  topic: 'adapter_lift_requests',
};

export const stationRequest: RomiTopic<msgs.Station> = {
  validate: msg => msgs.Station.fromObject(msg),
  type: msgs.Station.typeName,
  topic: 'station_requests',
};

export const deliveryRequest: RomiTopic<msgs.Delivery> = {
  validate: msg => msgs.Delivery.fromObject(msg),
  type: msgs.Delivery.typeName,
  topic: 'delivery_requests',
};

export const loop: RomiTopic<msgs.Loop> = {
  validate: msg => msgs.Loop.fromObject(msg),
  type: msgs.Loop.typeName,
  topic: 'loop_requests',
};

export const taskSummaries: RomiTopic<msgs.TaskSummary> = {
  validate: msg => msgs.TaskSummary.fromObject(msg),
  type: msgs.TaskSummary.typeName,
  topic: 'task_summaries',
};

export const fleetStates: RomiTopic<msgs.FleetState> = {
  validate: msg => msgs.FleetState.fromObject(msg),
  type: msgs.FleetState.typeName,
  topic: 'fleet_states',
};

export const destinationRequests: RomiTopic<msgs.DestinationRequest> = {
  validate: msg => msgs.DestinationRequest.fromObject(msg),
  type: msgs.DestinationRequest.typeName,
  topic: 'destination_requests',
};

export const robotModeRequests: RomiTopic<msgs.RobotMode> = {
  validate: msg => msgs.RobotMode.fromObject(msg),
  type: msgs.RobotMode.typeName,
  topic: 'robot_mode_requests',
};

export const robotPathRequests: RomiTopic<msgs.PathRequest> = {
  validate: msg => msgs.PathRequest.fromObject(msg),
  type: msgs.PathRequest.typeName,
  topic: 'robot_path_requests',
};

export const dispenserRequests: RomiTopic<msgs.DispenserRequest> = {
  validate: msg => msgs.DispenserRequest.fromObject(msg),
  type: msgs.DispenserRequest.typeName,
  topic: 'dispenser_requests',
};

export const dispenserResults: RomiTopic<msgs.DispenserResult> = {
  validate: msg => msgs.DispenserResult.fromObject(msg),
  type: msgs.DispenserResult.typeName,
  topic: 'dispenser_results',
};

export const dispenserStates: RomiTopic<msgs.DispenserState> = {
  validate: msg => msgs.DispenserState.fromObject(msg),
  type: msgs.DispenserState.typeName,
  topic: 'dispenser_states',
};

export const workcellConfiguration: RomiTopic<msgs.WorkcellConfiguration> = {
  validate: msg => msgs.WorkcellConfiguration.fromObject(msg),
  type: msgs.WorkcellConfiguration.typeName,
  topic: 'workcell_configuration',
};

// Services

export const getBuildingMap: RomiService<
  msgs.GetBuildingMap_Request,
  msgs.GetBuildingMap_Response
> = {
  validateRequest: msg => GetBuildingMap_Request.fromObject(msg),
  validateResponse: msg => GetBuildingMap_Response.fromObject(msg),
  type: 'building_map_msgs/srv/GetBuildingMap',
  service: 'get_building_map',
};
