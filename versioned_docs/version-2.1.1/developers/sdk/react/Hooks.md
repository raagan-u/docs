---
id: hooks
title: Hooks
---

# useGarden

The `useGarden` hook is a comprehensive, pre-packaged React hook that simplifies the integration of Garden SDK into your dApp. It encapsulates the functionality of both `useOrderbook` and `useSecretManager` while exposing a unified API to handle all core interactions, from order management to secret handling.

## Return Type

```ts
import type { GardenContextType } from '@garden/core';
```

### garden

`IGardenJS | undefined`

An instance of the Garden SDK core, providing advanced functionality.

### orderbook

`IOrderbook | undefined`

The instance of the orderbook used for creating and fetching orders.

### quote

`IQuote | undefined`

The quote instance for retrieving swap price details.

### swapAndInitiate

`(params: SwapParams) => AsyncResult<MatchedOrder, string>`

Creates an order, waits for it to be matched, and initiates it if the source chain is EVM. Returns the order object or an error message.

### pendingOrders

`OrderWithStatus[]`

An array of the user's pending orders, including those awaiting initiation, redemption, or refund.
Each order has a `status` field that can be used to determine its current status.

### getQuote

`(params: QuoteParams) => AsyncResult<QuoteResponse, string>`

Fetches a quote for the given parameters, including the USD values of the assets. Returns the quote details or an error message.

### isExecuting

`boolean`

Indicates whether secret manager is currently being initialized.

### isExecutorRequired

`boolean`

Indicates whether an executor is required for the order.
This becomes true when there are pending orders and the secret manager is not initialized.
