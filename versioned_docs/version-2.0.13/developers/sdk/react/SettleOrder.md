---
id: settle-order
---

# Settle order

Auto Redeems provide a seamless way to handle the settlement of funds on the destination chain without developers having to manually intervene. The system is designed to work autonomously, relying on the GardenProvider and our Gasless API to ensure that the settlement is handled securely and efficiently.

## Working

The `GardenProvider` will periodically check the `pendingOrders` endpoint to retrieve a list of orders that require settlement on the destination chain. It will then execute the appropriate method—either `btcRedeem` for Bitcoin-based orders or `evmRedeem` for Ethereum-based orders—based on the chain type of each order. Additionally, our relayer will handle all associated fees, so users do not need to worry about them.

### `evmRedeem`

```ts
evmRedeem(order: MatchedOrder, secret: string): Promise<void>;
```

- **Parameters:**
  - `order`: `MatchedOrder` - The order object that contains all the necessary information for the redeem operation.
  - `secret`: `string` - The secret used to perform the redeem operation on the Ethereum chain.

- **Returns:**
  - `Promise<void>` - Resolves when the redeem operation has been executed, or if an error occurs.

### `btcRedeem`

```ts
btcRedeem(wallet: IBitcoinWallet, order: MatchedOrder, secret: string): Promise<void>;
```

- **Parameters:**
  - `wallet`: `IBitcoinWallet` - The Bitcoin wallet to be used for redeeming the funds on the Bitcoin chain.
  - `order`: `MatchedOrder` - The order object that contains information about the settlement.
  - `secret`: `string` - The secret used to redeem the funds on the Bitcoin chain.

- **Returns:**
  - `Promise<void>` - Resolves when the redeem operation has been executed, or if an error occurs.
