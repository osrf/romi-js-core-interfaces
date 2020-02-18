import * as msgs from '../lib/romi-msgs';
import { RomiService, RomiTopic } from './transport';

// Topics

export const doorStates: RomiTopic<typeof msgs.DoorState> = {
  MessageType: msgs.DoorState,
  type: msgs.DoorState.typeName,
  topic: 'door_states',
}

export const doorRequests: RomiTopic<typeof msgs.DoorRequest> = {
  MessageType: msgs.DoorRequest,
  type: msgs.DoorRequest.typeName,
  topic: 'door_requests',
}

export const liftStates: RomiTopic<typeof msgs.LiftState> = {
  MessageType: msgs.LiftState,
  type: msgs.LiftRequest.typeName,
  topic: 'lift_states',
}

export const liftRequests: RomiTopic<typeof msgs.LiftRequest> = {
  MessageType: msgs.LiftRequest,
  type: msgs.LiftRequest.typeName,
  topic: 'lift_requests',
}

export const stationRequest: RomiTopic<typeof msgs.Station> = {
  MessageType: msgs.Station,
  type: msgs.Station.typeName,
  topic: 'station_requests',
}

export const deliveryRequest: RomiTopic<typeof msgs.Delivery> = {
  MessageType: msgs.Delivery,
  type: msgs.Delivery.typeName,
  topic: 'delivery_requests',
}

export const taskSummaries: RomiTopic<typeof msgs.TaskSummary> = {
  MessageType: msgs.TaskSummary,
  type: msgs.TaskSummary.typeName,
  topic: 'task_summaries',
}

export const fleetStates: RomiTopic<typeof msgs.FleetState> = {
  MessageType: msgs.FleetState,
  type: msgs.FleetState.typeName,
  topic: 'fleet_states',
}

export const dispenserStates: RomiTopic<typeof msgs.DispenserState> = {
  MessageType: msgs.DispenserState,
  type: msgs.DispenserState.typeName,
  topic: 'dispenser_states',
}

export const workcellConfiguration: RomiTopic<typeof msgs.WorkcellConfiguration> = {
  MessageType: msgs.WorkcellConfiguration,
  type: msgs.WorkcellConfiguration.typeName,
  topic: 'workcell_configuration',
}

// Services

export const getBuildingMap: RomiService<
  typeof msgs.GetBuildingMap_Request,
  typeof msgs.GetBuildingMap_Response
> = {
  type: 'building_map_msgs/srv/GetBuildingMap',
  service: 'get_building_map',
}
