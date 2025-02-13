---
id: orders-provider
title: OrdersProvider
---

# OrdersProvider

The `OrdersProvider` class implements the `IOrderProvider` interface, providing methods to interact with the orderbook, retrieve orders, and manage order subscriptions. It supports both matched and unmatched orders, allows for polling order updates, and provides count information for orders associated with a specific address.

### Usage

```ts
import { OrdersProvider } from '@gardenfi/orderbook';
```

### Constructor

```ts
new OrdersProvider(url: string | Url)
```

**Parameters:**

- `url`: The base URL to interact with the orderbook API.

**Returns:**

- [`IOrderProvider`](../Interfaces.md#iordersprovider)

---

## Methods

### getOrder

```ts
  getOrder<T extends boolean>(
    id: string,
    matched: T,
  ): AsyncResult<T extends true ? MatchedOrder : CreateOrder, string>;
```

Retrieves a specific order by its `id`, based on whether it's matched or unmatched.

**Parameters:**

- `id`: The `createId` of the order.
- `matched`: A boolean indicating whether to fetch a matched (`true`) or unmatched (`false`) order.

**Returns:**

- An `AsyncResult` containing either a [`MatchedOrder`](../types/Order.md#matchedorder) or a [`CreateOrder`](../types/Order.md#createorder) depending on the `matched` value.

### getMatchedOrders

```ts
getMatchedOrders(
    address: string,
    pending: boolean,
    paginationConfig?: PaginationConfig,
  ): AsyncResult<PaginatedData<MatchedOrder>, string>;
```

Fetches all matched orders for a given `address`, with an option to filter by pending status.

**Parameters:**

- `address`: The address for which the matched orders are retrieved.
- `pending`: If true, returns only pending matched orders.
- [`paginationConfig`](../types/Pagination.md#paginationconfig): Optional pagination configuration for results.

**Returns:**

- [`AsyncResult<PaginatedData<MatchedOrder>, string>`](../types/Order.md#matchedorder)

### getUnMatchedOrders

```ts
  getUnMatchedOrders(
    address: string,
    paginationConfig?: PaginationConfig,
  ): AsyncResult<PaginatedData<CreateOrder>, string>;
```

Fetches all unmatched orders for a given `address`, with optional pagination configuration.

**Parameters:**

- `address`: The address for which the unmatched orders are retrieved.
- [`paginationConfig`](../types/Pagination.md#paginationconfig): Optional pagination configuration.

**Returns:**

- [`AsyncResult<PaginatedData<CreateOrder>, string>`](../types/Order.md#createorder)

### getOrders

```ts
getOrders<T extends boolean>(
  matched: T,
  paginationConfig?: PaginationConfig,
): AsyncResult<
  PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
  string
>;
```

Retrieves either matched or unmatched orders based on the `matched` parameter, with optional pagination.

**Parameters:**

- `matched`: If true, returns matched orders; otherwise, returns unmatched orders.
- [`paginationConfig`](../types/Pagination.md#paginationconfig): Optional pagination configuration.

**Returns:**

- [`AsyncResult<PaginatedData<T extends true ? MatchedOrder : CreateOrder>, string>`](../types/Order.md#matchedorder)

### subscribeOrders

```ts
subscribeOrders<T extends boolean>(
  account: string,
  matched: T,
  interval: number,
  cb: (
    orders: PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
  ) => Promise<void>,
  pending?: boolean,
  paginationConfig?: PaginationConfig,
): Promise<() => void>;
```

Subscribes to an account’s orders by polling at a specified interval.
The method continuously fetches orders at the given interval and invokes the provided callback with the received orders.

**Parameters:**

- `account`: The account to subscribe to.
- `matched`: If true, subscribes to matched orders; otherwise, subscribes to unmatched orders.
- `interval`: The interval (in milliseconds) to fetch orders.
- `cb`: The callback to execute when the orders are updated.
- `pending`: Optional flag to include pending orders.
- [`paginationConfig`](../types/Pagination.md#paginationconfig): Optional pagination configuration.

**Returns:**

- A promise that resolves to a function that can be called to unsubscribe from the updates.

### getOrdersCount

```ts
getOrdersCount(address: string): AsyncResult<number, string>
```

Fetches the number of orders associated with a given `address`, typically used for nonce calculation.

**Parameters:**

- `address`: The address for which the order count is fetched.

**Returns:**

- `AsyncResult<number, string>`
