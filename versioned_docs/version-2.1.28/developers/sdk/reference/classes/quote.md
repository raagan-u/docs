---
id: quote
title: Quote
---

# Quote

The `Quote` class is a key component in the Garden SDK, offering methods to:

- Fetch quotes for specific order pairs and amounts.
- Generate attested quotes with signature for order validation.
- Retrieve available strategies for quoting, including fees, limits, and order pair details.

## Usage

```ts
import { Quote } from '@gardenfi/core';
```

## Constructor

```ts
new Quote(quoteUrl: string): IQuote
```

**Parameters:**

- `quoteUrl` (string): The base URL for the quote API endpoint.

**Returns:**

- [`IQuote`](../Interfaces.md#iquote)

---

## Methods

### getQuote

```ts
  getQuote(
    orderpair: string,
    amount: number,
    isExactOut: boolean,
  ): AsyncResult<QuoteResponse, string>;
```

**Parameters:**

- `orderpair` (string): A string representing the order pair for which the quote is requested. Chain name and asset are separated by a colon(:) and chain pairs are separated by double colon(::).

  `eg:- bitcoin_testnet:primary::arbitrum_sepolia:0x1cd0bBd55fD66B4C5F7dfE434eFD009C09e628d1`

- `amount` (number): The amount of the order pair to fetch a quote for.
- `isExactOut` (boolean): Whether the amount is an exact output amount.

**Returns:**

- [`AsyncResult<QuoteResponse, string>`](../types/quote.md#quoteresponse)

### getAttestedQuote

```ts
  getAttestedQuote(
    order: CreateOrderReqWithStrategyId,
  ): AsyncResult<CreateOrderRequestWithAdditionalData, string>;
```

**Description:**

This method generates an attested quote for a given order. It includes the order details and a signature to ensure the order's validity.

**Parameters:**

- `order`([CreateOrderReqWithStrategyId](./CreateOrderReqWithStrategyId.md)): The order to fetch an attested quote for.

**Returns:**

- [`AsyncResult<CreateOrderRequestWithAdditionalData, string>`](../types/Order.md#createorderrequestwithadditionaldata)

### getStrategies

```ts
  getStrategies(): AsyncResult<Strategies, string>;
```

**Description:**

This method retrieves the available strategies for quoting. It returns a list of strategies with their associated details, such as fees, limits, and supported order pair information.

**Returns:**

- [`AsyncResult<Strategies, string>`](../types/quote.md#strategies)
