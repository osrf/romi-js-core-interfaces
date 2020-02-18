import * as rclnodejs from 'rclnodejs';
import { QoS as RclQoS } from 'rclnodejs';
import {
  DurabilityPolicy,
  HistoryPolicy,
  Options,
  Publisher,
  ReliabilityPolicy,
  RomiService,
  RomiTopic,
  Subscription,
  SubscriptionCb,
  Transport,
  Type,
} from '.';

export class RclTransport implements Transport {
  static async create(nodeName: string): Promise<RclTransport> {
    try {
      await rclnodejs.init();
    } catch { /* do nothing */ }
    return new RclTransport(nodeName);
  }

  get name(): string { return this._node.name(); }

  createPublisher<MessageType extends Type>(
    topic: RomiTopic<MessageType>,
    options: Options = {},
  ): Publisher<InstanceType<MessageType>> {
    const rclOptions: rclnodejs.Options = {};
    if (options.qos) {
      rclOptions.qos = new RclQoS(
        this._toRclHistoryPolicy(options.qos.historyPolicy),
        options.qos.depth,
        this._toRclReliabilityPolicy(options.qos.reliabilityPolicy),
        this._toRclDurabilityPolicy(options.qos.durabilityPolicy),
      );
    }
    return this._node.createPublisher(topic.type, topic.topic, rclOptions);
  }

  subscribe<MessageType extends Type>(
    topic: RomiTopic<MessageType>,
    cb: SubscriptionCb<InstanceType<MessageType>>,
    options: Options = {},
  ): Subscription {
    const rclOptions: rclnodejs.Options = {};
    if (options.qos) {
      rclOptions.qos = new RclQoS(
        this._toRclHistoryPolicy(options.qos.historyPolicy),
        options.qos.depth,
        this._toRclReliabilityPolicy(options.qos.reliabilityPolicy),
        this._toRclDurabilityPolicy(options.qos.durabilityPolicy),
      );
    }
    const rosSub = this._node.createSubscription(
      topic.type,
      topic.topic,
      rclOptions,
      cb as rclnodejs.SubscriptionCallback,
    );

    return {
      unsubscribe: (): void => {
        this._node.destroySubscription(rosSub);
      },
    };
  }

  async call<RequestType extends Type, ResponseType extends Type>(
    service: RomiService<RequestType, ResponseType>,
    req: InstanceType<RequestType>,
  ): Promise<InstanceType<ResponseType>> {
    let client = this._clients.get(service.service);
    if (client === undefined) {
      client = this._node.createClient(service.type, service.service);
      this._clients.set(service.service, client);
    }
    return new Promise(res => {
      client!.sendRequest(req, resp => res(resp as InstanceType<ResponseType>));
    });
  }

  destroy(): void {
    this._node.destroy();
  }

  private _node: rclnodejs.Node;
  private _clients = new Map<string, rclnodejs.Client>();

  private constructor(nodeName: string) {
    this._node = rclnodejs.createNode(nodeName);
    rclnodejs.spin(this._node);
  }

  private _toRclHistoryPolicy(historyPolicy?: HistoryPolicy): RclQoS.HistoryPolicy {
    if (historyPolicy === undefined) {
      return RclQoS.HistoryPolicy.RMW_QOS_POLICY_HISTORY_SYSTEM_DEFAULT;
    }
    switch (historyPolicy) {
      case HistoryPolicy.SystemDefault:
        return RclQoS.HistoryPolicy.RMW_QOS_POLICY_HISTORY_SYSTEM_DEFAULT;
      case HistoryPolicy.KeepLast:
        return RclQoS.HistoryPolicy.RMW_QOS_POLICY_HISTORY_KEEP_LAST;
      case HistoryPolicy.KeepAll:
        return RclQoS.HistoryPolicy.RMW_QOS_POLICY_HISTORY_KEEP_ALL;
    }
  }

  private _toRclReliabilityPolicy(
    reliabilityPolicy?: ReliabilityPolicy
  ): RclQoS.ReliabilityPolicy {
    if (reliabilityPolicy === undefined) {
      return RclQoS.ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_SYSTEM_DEFAULT;
    }
    switch (reliabilityPolicy) {
      case ReliabilityPolicy.SystemDefault:
        return RclQoS.ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_SYSTEM_DEFAULT;
      case ReliabilityPolicy.BestEffort:
        return RclQoS.ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_BEST_EFFORT;
      case ReliabilityPolicy.Reliable:
        return RclQoS.ReliabilityPolicy.RMW_QOS_POLICY_RELIABILITY_RELIABLE;
    }
  }

  private _toRclDurabilityPolicy(
    durabilityPolicy?: DurabilityPolicy
  ): RclQoS.DurabilityPolicy {
    if (durabilityPolicy === undefined) {
      return RclQoS.DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_SYSTEM_DEFAULT;
    }
    switch (durabilityPolicy) {
      case DurabilityPolicy.SystemDefault:
        return RclQoS.DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_SYSTEM_DEFAULT;
      case DurabilityPolicy.TransientLocal:
        return RclQoS.DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_TRANSIENT_LOCAL;
      case DurabilityPolicy.Volatile:
        return RclQoS.DurabilityPolicy.RMW_QOS_POLICY_DURABILITY_VOLATILE;
    }
  }
}
