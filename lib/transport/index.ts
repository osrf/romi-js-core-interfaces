export * from './rcl-transport';

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

export interface Publisher<T> {
  publish(msg: T): void;
}

export type Type = {
  new(...args: any): any;
}

export interface RomiTopic<MessageType extends Type = any> {
  readonly MessageType?: MessageType;
  readonly type: string;
  readonly topic: string;
}

export interface RomiService<RequestType extends Type = any, ResponseType extends Type = any> {
  readonly RequestType?: RequestType;
  readonly ResponseType?: ResponseType;
  readonly type: string;
  readonly service: string;
}

export interface Transport {
  readonly name: string;

  createPublisher<MessageType extends Type>(
    topic: RomiTopic<MessageType>,
    options?: Options,
  ): Publisher<InstanceType<MessageType>>;

  subscribe<MessageType extends Type>(
    topic: RomiTopic<MessageType>,
    cb: SubscriptionCb<InstanceType<MessageType>>,
    options?: Options,
  ): Subscription;

  call<RequestType extends Type, ResponseType extends Type>(
    service: RomiService<RequestType, ResponseType>,
    req: InstanceType<RequestType>,
  ): Promise<InstanceType<ResponseType>>;

  destroy(): void;
}
