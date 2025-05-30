---
id: starknet-relay
title: StarknetRelay
---

# EvmRelay

The `StarknetRelay` class provides an abstraction to interact with the Garden Finance relay server on the Starknet chain. It handles atomic swap operations in a gasless manner, with the relayer taking care of gas fees and expired transaction refunds. This eliminates the complexity for the end user while ensuring secure execution using typed data signatures and allowance verification.

## Constructor

```ts
new StarknetRelay(relayerUrl: string | Url, account: AccountInterface, nodeUrl?: string): IStarknetHTLC | undefined
```

**Parameters:**

- `relayerUrl` (string | Url): The base URL of the Starknet relay server.
- `account` ([AccountInterface](https://starknetjs.com/docs/6.11.0/API/classes/AccountInterface/)): The Starknet account interface used for signing messages and transactions.
- `nodeUrl` (string): URL of the Starknet RPC node to use. Defaults to public starknet-sepolia RPC if not provided

**Returns:**

- [`IStarknetHTLC`](../../Interfaces.md#istarknethtlc)

---

## Methods

### initiate

```ts
initiate(
  order: MatchedOrder,
): AsyncResult<string, string>;
```

Initiates an atomic swap by validating the order, preparing the required data, and submitting the initialization request to the relay server.

**Parameters:**

- `order` ([MatchedOrder](../types/Order.md#matchedorder)): The order to be initialized.

**Returns:**

- [`AsyncResult<string, string>`](../types/AsyncResult.md) - transaction hash

### redeem

```ts
redeem(orderId: string, secret: string): AsyncResult<string, string>;
```

Redeems an atomic swap by submitting the secret to the relay server.

**Parameters:**

- `orderId` (string): The ID of the order to be redeemed.
- `secret` (string): The secret used to redeem the order.

**Returns:**

- [`AsyncResult<string, string>`](../types/AsyncResult.md) - transaction hash

### refund

Refunds are automatically done by the relayer.