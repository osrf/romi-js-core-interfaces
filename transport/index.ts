/* eslint-disable @typescript-eslint/no-explicit-any */

import EventEmitter = require('eventemitter3');

export { EventEmitter };

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
  readonly options?: Options;
}

export interface RomiService<Request, Response> {
  readonly validateRequest: (msg: any) => Request;
  readonly validateResponse: (msg: any) => Response;
  readonly type: string;
  readonly service: string;
  readonly options?: Options;
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
