---
id: IQuote
title: IQuote
---

# Interface: IQuote

The `IQuote` interface defines the contract for interacting with the quote service. It provides the following methods:

| Method Name        | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `getQuote`         | Fetches a quote for a given order pair and amount.                                                   |
| `getAttestedQuote` | Attests a quote and returns a signature. This signature is generated based on the provided strategy. |
| `getStrategies`    | Retrieves the available strategies for quoting.                                                      |

For more details on the specific implementations, see the [Quote](../classes/quote.md) class.
