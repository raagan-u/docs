---
id: event-broker
title: Event Broker
---

# Event Broker

The `EventBroker` class provides a strongly typed and flexible mechanism for managing custom events and their listeners. It enables emitting events with arguments, registering listeners for specific events, and removing them when needed.

## Usage

```ts
import { EventBroker } from './EventBroker';

type MyEvents = {
  userLoggedIn: (userId: string) => void;
  dataFetched: (data: Record<string, number>) => void;
};

const broker = new EventBroker<MyEvents>();
```

## Constructor

```ts
new EventBroker<E extends Events>()
```

**Parameters:**

- `E` (Events): The type of events to be managed by the broker.

**Returns:**

- An instance of the `EventBroker` class.

---

## Methods

### emit

```ts
protected emit<K extends keyof E>(event: K, ...args: Parameters<E[K]>): void
```

Emits a specified event, invoking all registered listeners with the provided arguments.

**Parameters:**

- `event` (K): The event to emit.
- `...args`: The arguments to pass to the event listener.

### on

```ts
on<K extends keyof E>(event: K, cb: E[K]): void
```

Registers a listener for a specified event.

**Parameters:**

- `event` (K): The event to listen for.
- `cb` (E[K]): The callback function to be invoked when the event occurs.

### off

```ts
off<K extends keyof E>(event: K, cb: E[K]): void
```

Removes a listener for a specified event.

**Parameters:**

- `event` (K): The event to remove the listener from.
- `cb` (E[K]): The callback function to be removed.
