import { Client, ClientConfig } from "pg";
import { PubSub } from "graphql-subscriptions";

interface PostgresPubSubOptions extends ClientConfig {
    commonMessageHandler?: (...args: any) => any,
    client?: Client,
}

export class PostgresPubSub extends PubSub {
    constructor(config?: PostgresPubSubOptions);
    asyncIterator(triggers: string | string[]): PubSubAsyncIterator;
    subscribe(triggerName: string, onMessage: (...args: any) => void | Promise<void>): Promise<number>;
    unsubscribe(subId: number): void;
}

export interface PubSubAsyncIterator {
    next(): any | Promise<any>;
    return(): any;
    throw(error?: any): any;
    [Symbol.asyncIterator](): any;
}