# graphql-pg-subscriptions

A graphql subscriptions implementation using postgres and apollo's graphql-subscriptions.

This package implements the PubSubEngine Interface from the graphql-subscriptions package and also the new AsyncIterator interface. It allows you to connect your subscriptions manger to a postgres based Pub Sub mechanism to support multiple subscription manager instances.

## Installation

```bash
npm i graphql-pg-subscriptions
```

## Usage

First of all, follow the instructions in [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions) to add subscriptions to your app.

Afterwards replace `PubSub` with `PostgresPubSub`:

```js
// Before
import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();
```

```js
// After
import { PostgresPubSub } from "graphql-pg-subscriptions";

export const pubsub = new PostgresPubSub();
```

This library uses [`node-postgres`](https://github.com/brianc/node-postgres) to connect to PostgreSQL. If you want to customize connection options, please refer to their [connection docs](https://node-postgres.com/features/connecting).

```js
import { PostgresPubSub } from "graphql-postgres-subscriptions";
import { Client } from "pg";

const client = new Client({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 3211,
});
client.connect();
const pubsub = new PostgresPubSub({ client });
```

**Important**: Don't pass clients from `pg`'s `Pool` to `PostgresPubSub`. As [node-postgres creator states in this StackOverflow answer](https://stackoverflow.com/questions/8484404/what-is-the-proper-way-to-use-the-node-js-postgresql-module), the client needs to be around and not shared so pg can properly handle `NOTIFY` messages (which this library uses under the hood)

### commonMessageHandler

The second argument to `new PostgresPubSub()` is the `commonMessageHandler`. The common message handler gets called with the received message from PostgreSQL.
You can transform the message before it is passed to the individual filter/resolver methods of the subscribers.
This way it is for example possible to inject one instance of a [DataLoader](https://github.com/facebook/dataloader) which can be used in all filter/resolver methods.

```javascript
const getDataLoader = () => new DataLoader(...)
const commonMessageHandler = ({attributes: {id}, data}) => ({id, dataLoader: getDataLoader()})
const pubsub = new PostgresPubSub({ client, commonMessageHandler });
```

```javascript
export const resolvers = {
  Subscription: {
    somethingChanged: {
      resolve: ({ id, dataLoader }) => dataLoader.load(id)
    }
  }
};
```

## Error handling

`PostgresPubSub` instances emit a special event called `"error"`. This event's payload is an instance of Javascript's `Error`. You can get the error's text using `error.message`.

```js
const ps = new PostgresPubSub({ client });

ps.subscribe("error", err => {
  console.log(err.message); // -> "payload string too long"
}).then(() => ps.publish("a", "a".repeat(9000)));
```

For example you can log all error messages (including stack traces and friends) using something like this:

```js
ps.subscribe("error", console.error);
```

This is a forked version of [GraphQLCollege/graphql-postgres-subscriptions](https://github.com/GraphQLCollege/graphql-postgres-subscriptions), where I add typescript and dependency error.

## Stay in touch

- Author - [Siam Ahnaf](https://www.siamahnaf.com/)
- Website - [https://www.siamahnaf.com/](https://www.siamahnaf.com/)
- Twitter - [https://twitter.com/siamahnaf198](https://twitter.com/siamahnaf198)
- Github - [https://github.com/siamahnaf](https://github.com/siamahnaf)