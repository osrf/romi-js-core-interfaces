import { RomiService, RomiTopic } from '../transport';
import * as msgs from './core-msgs';
import { GetBuildingMap_Response } from './core-msgs';

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
  validateResponse: msg => GetBuildingMap_Response.fromObject(msg),
  type: 'building_map_msgs/srv/GetBuildingMap',
  service: 'get_building_map',
};
