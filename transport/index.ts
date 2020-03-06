/* eslint-disable @typescript-eslint/no-explicit-any */

import EventEmitter = require('eventemitter3');

export { EventEmitter };

/**
 * Wrapper around a topic or service that skips validation.
 *
 * NOTE: This is unsafe and should only be used when you trust the underlying transport to return
 * the correct types.
 */
export function skipValidation<T extends RomiTopic<unknown> & RomiService<unknown, unknown>>(
  topicOrService: T,
): T {
  const skipValidation = (msg: unknown): unknown => msg;
  return {
    validate: topicOrService.validate ? skipValidation : undefined,
    validateResponse: topicOrService.validateResponse ? topicOrService.validateResponse : undefined,
    topic: topicOrService.topic ? topicOrService.topic : undefined,
    service: topicOrService.service ? topicOrService.service : undefined,
    type: topicOrService.type,
  } as T;
}

export class TransportEvents extends EventEmitter<{
  error: [Error];
  close: [];
}> {}

export enum HistoryPolicy {
  SystemDefault,
  KeepLast,
  KeepAll,
}

export enum ReliabilityPolicy {
  SystemDefault,
  Reliable,
  BestEffort,
}

export enum DurabilityPolicy {
  SystemDefault,
  TransientLocal,
  Volatile,
}

export interface QosPolicy {
  historyPolicy?: HistoryPolicy;
  reliabilityPolicy?: ReliabilityPolicy;
  durabilityPolicy?: DurabilityPolicy;
  depth?: number;
}

export interface Options {
  qos?: QosPolicy;
}

export type SubscriptionCb<Message> = (msg: Message) => void;

export interface Subscription {
  unsubscribe(): void;
}

export interface Publisher<Message> {
  publish(msg: Message): void;
}

export interface RomiTopic<Message> {
  readonly validate: (msg: any) => Message;
  readonly type: string;
  readonly topic: string;
}

export interface RomiService<_Request, Response> {
  readonly validateResponse: (msg: any) => Response;
  readonly type: string;
  readonly service: string;
}

export interface Transport extends TransportEvents {
  readonly name: string;

  createPublisher<Message extends object>(
    topic: RomiTopic<Message>,
    options?: Options,
  ): Publisher<Message>;

  subscribe<Message extends object>(
    topic: RomiTopic<Message>,
    cb: SubscriptionCb<Message>,
    options?: Options,
  ): Subscription;

  call<Request extends object, Response extends object>(
    service: RomiService<Request, Response>,
    req: Request,
  ): Promise<Response>;

  destroy(): void;
}
