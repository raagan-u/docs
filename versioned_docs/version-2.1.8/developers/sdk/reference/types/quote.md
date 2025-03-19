---
id: quote
title: Quote
---

# Quote

## QuoteResponse

The `QuoteResponse` type represents the response from the quote API. It contains the following properties:

| Property           | Type                                | Description                                       |
| ------------------ | ----------------------------------- | ------------------------------------------------- |
| quotes             | `{ [strategy_id: string]: string }` | Map of strategy IDs to their corresponding quotes |
| input_token_price  | number                              | The price of the input token                      |
| output_token_price | number                              | The price of the output token                     |

## Strategies

The `Strategies` type represents a mapping of [`OrderPair`](../Enumerations.md#orderpair) identifiers to their corresponding strategy details. Each strategy provides specific limits and fees associated with it. The structure is as follows:

**Type Definition**

```typescript
export type Strategies = Record<
  string,
  {
    id: string;
    minAmount: string;
    maxAmount: string;
    fee: number;
  }
>;
```

**Explanation**

- Key: A string representing the [`OrderPair`](../Enumerations.md#orderpair) for which the strategy is applicable.
- Value: An object containing the following properties:

| Property  | Type   | Description                                            |
| --------- | ------ | ------------------------------------------------------ |
| id        | string | Unique identifier for the strategy.                    |
| minAmount | string | Minimum amount allowed for the strategy (as a string). |
| maxAmount | string | Maximum amount allowed for the strategy (as a string). |
| fee       | number | Fee percentage applied to the strategy.                |
