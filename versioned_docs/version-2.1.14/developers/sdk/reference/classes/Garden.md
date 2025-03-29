---
id: garden
title: Garden
---

# Garden

The `Garden` class serves as a high-level wrapper around the core modules of the system: `quote`, `orderbook`, `secretManager`, and `EVMRelay`. It provides a simplified interface with primary functionalities for creating and executing swaps.

**Key Features**

- **Swap Creation**: Facilitates the creation of new orders through the `swap` method.
- **Swap Execution**: Allows for the execution of orders via the `execute` method.
- **Modular Access**: Provides access to underlying modules (`quote`, `orderbook`, `secretManager`, and `EVMRelay`) for advanced interactions if needed.

## Usage

```ts
import { Garden } from '@gardenfi/core';
```

## Constructor

```ts
new Garden(config: GardenConfig): IGarden
```

**Parameters:**

- `config` ([GardenConfig](../types/GardenConfig.md)): The configuration object for the Garden instance.

**Returns:**

- [`IGarden`](../Interfaces.md#igardenjs)

---

## Methods

### swap

```ts
swap(params: SwapParams): AsyncResult<MatchedOrder, string>
```

The `swap` function creates a new order based on the provided parameters. It validates the input, uses the [secretManager](./secretManager.md) to generate a secret and secret hash using a nonce, which is calculated as the user's number of orders plus one, and fetch attested quote from the [quote](./quote.md) module. After these steps, it posts the order to the [orderbook](./Orderbook.md) to create a new order.

This function simplifies the process of creating a swap by handling validation, secret generation, and order creation automatically.

**Parameters:**

- `params` ([SwapParams](../types/SwapParams.md)): The parameters for creating the swap.

**Returns:**

- [`AsyncResult<MatchedOrder, string>`](../types/Order.md#matchedorder)

### execute

```ts
execute(): Promise<() => void>
```

Executes the pending orders and provides a cancel function to stop the execution.

**Returns:**

- `Promise<() => void>`: A promise that resolves to a function for canceling the execution.

---

## Readonly Properties

### orderbook

```ts
get orderbook(): IOrderbook
```

Returns [Orderbook](./Orderbook.md) instance.

### evmRelay

```ts
get evmRelay(): IEVMRelay
```

Returns [EvmRelay](./EvmRelay.md) instance.

### quote

```ts
get quote(): IQuote
```

Returns [Quote](./Quote.md) instance.

### btcWallet

```ts
get btcWallet(): IBitcoinWallet | undefined
```

The Bitcoin wallet, if available, for managing BTC transactions.

### orderbookUrl

```ts
get orderbookUrl(): string
```

The URL of the orderbook for accessing and managing orders.

### blockNumberFetcher

```ts
get blockNumberFetcher(): IBlockNumberFetcher
```

Returns [BlockNumberFetcher](./BlockNumberFetcher.md) instance.

### secretManager

```ts
get secretManager(): ISecretManager
```

Returns [SecretManager](./SecretManager.md) instance.

---

## Events

The Garden class emits several events that you can subscribe to for monitoring order status and system operations:

### `error`

Triggered when an error occurs during order processing.

**Parameters:**

- `order` ([MatchedOrder](../types/Order.md#matchedorder)): The order that encountered an error
- `error` (string): Description of the error that occurred

### `success`

Emitted when an order action is successfully completed.

**Parameters:**

- `order` ([MatchedOrder](../types/Order.md#matchedorder)): The successfully processed order
- `action` ([OrderActions](../Enumerations.md#orderactions)): The type of action that was completed
- `result` (string): Details about the successful operation

### `onPendingOrdersChanged`

Fired whenever the list of pending orders is updated.

**Parameters:**

- `orders` ([OrderWithStatus[]](../types/Order.md#orderwithstatus)): Array of current pending orders with their status

### `log`

Emits logging information for debugging and monitoring purposes.

**Parameters:**

- `id` (string): Identifier for the log entry
- `message` (string): The log message content
