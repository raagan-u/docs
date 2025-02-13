---
id: block-number-fetcher
title: BlockNumberFetcher
---

# BlockNumberFetcher

The `BlockNumberFetcher` class is responsible for fetching the current block numbers across multiple chains. Since the system depends on the current block number to calculate the status of orders, it is crucial to have a custom block number fetcher that ensures accuracy and reliability. This class is designed to retrieve block numbers without relying on public RPCs, providing a more stable and controlled data source.

## Constructor

```ts
new BlockNumberFetcher(url: string, network: Environment): IBlockNumberFetcher
```

**Parameters:**

- url (string): The base URL to fetch the block number data.
- network ([Environment](../Enumerations.md#environment)): The environment type that determines the network to fetch data from (e.g., Mainnet, Testnet).

**Returns:**

- [IBlockNumberFetcher](../types/IBlockNumberFetcher.md)

---

## Methods

### fetchBlockNumbers

```ts
fetchBlockNumbers(): AsyncResult<Response, string>;
```

Fetches the current block numbers for all supported chains.

**Returns:**

- `AsyncResult<Response, string>`

- `Response` is an object type that maps each supported [Chain](../Enumerations.md#chains) to its current block number:
  ```ts
  type Response = {
    [key in Chain]: number;
  };
  ```
