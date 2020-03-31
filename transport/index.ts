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

export interface Service<Request, Response> {
  start(handler: (req: Request) => Promise<Response> | Response): void;
  stop(): void;
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

  createPublisher<Message extends unknown>(
    topic: RomiTopic<Message>,
    options?: Options,
  ): Publisher<Message>;

  subscribe<Message extends unknown>(
    topic: RomiTopic<Message>,
    cb: SubscriptionCb<Message>,
    options?: Options,
  ): Subscription;

  call<Request extends unknown, Response extends unknown>(
    service: RomiService<Request, Response>,
    req: Request,
  ): Promise<Response>;

  createService<Request extends unknown, Response extends unknown>(
    service: RomiService<Request, Response>,
  ): Service<Request, Response>;

  destroy(): void;
}
