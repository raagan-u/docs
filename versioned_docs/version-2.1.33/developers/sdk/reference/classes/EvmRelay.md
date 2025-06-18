---
id: evm-relay
title: EvmRelay
---

# EvmRelay

The `EvmRelay` class provides functionality to interact with the Garden Finance relay server, which offers a gasless API to handle init and redeem operations for atomic swaps. This abstraction ensures that users don't need to manage gas fees directly, and the relay server also automatically handles refunds for expired transactions.

## Constructor

```ts
new EvmRelay(url: string | Url, wallet: walletClient, auth: IAuth): IEVMHTLC | undefined
```

**Parameters:**

- `url` (string | Url): The base URL of the relay server.
- `walletClient` ([WalletClient](https://viem.sh/docs/clients/wallet.html)): The wallet client used to sign the transaction.
- `auth` ([IAuth](../../Interfaces.md#iauth)): An authentication object used to fetch tokens for authorized requests.

**Returns:**

- [`IEVMHTLC`](../../Interfaces.md#ievmhtlc)

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

- `order` ([MatchedOrder](../../types/Order.md#matchedorder)): The order to be initialized.

**Returns:**

- [`AsyncResult<string, string>`](../classes/AsyncResult.md) - transaction hash

### redeem

```ts
redeem(orderId: string, secret: string): AsyncResult<string, string>;
```

Redeems an atomic swap by submitting the secret to the relay server.

**Parameters:**

- `orderId` (string): The ID of the order to be redeemed.
- `secret` (string): The secret used to redeem the order.

**Returns:**

- [`AsyncResult<string, string>`](../classes/AsyncResult.md) - transaction hash

### refund

Refunds are automatically handled by the relayer.
