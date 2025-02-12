---
id: orderbook
title: Orderbook
---

# Orderbook

The `Orderbook` class extends [IOrdersProvider](../types/IOrderProvider.md) and allows creating and managing orders easily.

## Usage

```ts
import { Orderbook } from '@gardenfi/orderbook';
```

### Constructor

```ts
new Orderbook(orderbookConfig: OrderbookConfig): IOrderbook
```

**Parameters:**

- `orderbookConfig` ([OrderbookConfig](../types/OrderbookConfig.md)): Configuration object containing the orderbook's base URL, wallet client, and authentication details.

**Returns:**

- [`IOrderbook`](../Interfaces.md#iorderbook)

---

## Methods

### createOrder

```ts
createOrder(
  order: CreateOrderRequestWithAdditionalData,
): AsyncResult<string, string>;
```

Creates a new order.

**Parameters:**

- `order` (CreateOrderRequestWithAdditionalData): The order details to be created.

**Returns:**

- `AsyncResult<string, string>`: The result containing the order ID on success or an error message.

### fetchOrders

```ts
fetchOrders<T extends boolean>(
  matched: T,
  pending?: boolean,
  paginationConfig?: PaginationConfig,
): AsyncResult<
  PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
  string
>;
```

Fetches orders from the orderbook. Returns either matched or unmatched orders based on the matched parameter. It is a wrapper for the [`getOrders`](./OrdersProvider.md#getorders) method in the OrdersProvider class to abstract the address parameter.

**Parameters:**

- `matched` (boolean): true to fetch matched orders, false for unmatched orders.
- `pending` (boolean, optional): Filter for pending orders. Defaults to false.
- `paginationConfig` ([PaginationConfig](../types/pagination.md), optional): Configuration for pagination.

**Returns:**

- [`AsyncResult<PaginatedData<MatchedOrder | CreateOrder>, string>`](../types/Order.md#matchedorder): The result containing the paginated list of orders.

### subscribeToOrders

```ts
subscribeToOrders(
  interval: number,
  cb: (orders: PaginatedData<MatchedOrder>) => Promise<void>,
  paginationConfig?: PaginationConfig,
  pending?: boolean,
): Promise<() => void>;
```

Subscribes to order updates by polling the orderbook at a specified interval. The callback function is invoked with the received list of matched orders. Returns a function to unsubscribe. This is a wrapper for the [`subscribeOrders`](./OrdersProvider.md#subscribeorders) method in the OrdersProvider class to abstract the address parameter.

**Parameters:**

- `interval` (number): The interval (in milliseconds) at which updates are fetched.
- `cb` (function): Callback invoked with the updated list of matched orders.
- `paginationConfig` ([PaginationConfig](../types/pagination.md), optional): Configuration for pagination.
- `pending` (boolean, optional): Filter for pending orders.

**Returns:**

- `Promise<() => void>`: A promise that resolves to an unsubscribe function.
