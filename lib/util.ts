import { Time } from '../lib/romi-msgs/builtin_interfaces/msg/Time';

export function toRosTime(date: Date): Time {
  return {
    sec: Math.floor(date.getTime() / 1000),
    nanosec: (date.getTime() % 1000) * 1000000,
  };
}
