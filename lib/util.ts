import { RomiService, RomiTopic } from '../transport';
import { Time } from './core-msgs/builtin_interfaces/msg/Time';

export function toRosTime(date: Date): Time {
  return {
    sec: Math.floor(date.getTime() / 1000),
    nanosec: (date.getTime() % 1000) * 1000000,
  };
}

/**
 * Wrapper around a topic or service that skips validation.
 *
 * NOTE: This is unsafe and should only be used when you trust the underlying transport to return
 * the correct types.
 */
export function skipValidation<T extends RomiTopic<unknown> | RomiService<unknown, unknown>>(
  topicOrService: T,
): T {
  const skipValidation = (msg: unknown): unknown => msg;
  const skipped = { ...topicOrService };
  if ((skipped as any).validate) {
    (skipped as any).validate = skipValidation;
  }
  if ((skipped as any).validateResponse) {
    (skipped as any).validateResponse = skipValidation;
  }
  return skipped;
}
