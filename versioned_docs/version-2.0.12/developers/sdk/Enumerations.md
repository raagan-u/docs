---
id: enumerations
title: Enumerations
---

# Enumerations

## Chains

The `Chains` enumeration represents a set of predefined blockchain networks used within the system. Each network is associated with a string value, which is the name of the blockchain or test network.

| **Name**            | **Value**             |
| ------------------- | --------------------- |
| `bitcoin`           | `'bitcoin'`           |
| `bitcoin_testnet`   | `'bitcoin_testnet'`   |
| `bitcoin_regtest`   | `'bitcoin_regtest'`   |
| `ethereum`          | `'ethereum'`          |
| `base`              | `'base'`              |
| `arbitrum`          | `'arbitrum'`          |
| `ethereum_sepolia`  | `'ethereum_sepolia'`  |
| `arbitrum_localnet` | `'arbitrum_localnet'` |
| `arbitrum_sepolia`  | `'arbitrum_sepolia'`  |
| `ethereum_localnet` | `'ethereum_localnet'` |
| `base_sepolia`      | `'base_sepolia'`      |
| `bera_testnet`      | `'bera_testnet'`      |
| `citrea_testnet`    | `'citrea_testnet'`    |

### Type: `Chain`

Chain is a type that represents the possible values of the `Chains` enumeration. Chain can have the above values defined in the `Chains` enumeration.

```ts
type Chain = keyof typeof Chains;
```

## OrderPair

The `OrderPair` type represents a pair of assets that can be traded on the platform. It is a string that specifies the source chain and source asset, followed by the destination chain and destination asset. The source chain and source asset are separated by a colon (`:`), and the pair is combined with the destination chain and destination asset using a double colon (`::`). Here, the Asset refers to the atomic swap contract address.

```ts
type OrderPair = `${Chain}:${Asset}::${Chain}:${Asset}`;
```

#### Example

```ts
'bitcoin_testnet:primary::arbitrum_sepolia:0x1cd0bBd55fD66B4C5F7dfE434eFD009C09e628d1';
```

## `OrderActions`

Represents the different states or actions that can be performed on an order.

| Value      | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| `Idle`     | The order is in an inactive state, waiting for further action |
| `Initiate` | The order is being initiated.                                 |
| `Redeem`   | The order is being redeemed.                                  |
| `Refund`   | The order is being refunded.                                  |

## `Environment`

Represents the different network environments in which the system can operate.

| **Name**   | **Value**    |
| ---------- | ------------ |
| `MAINNET`  | `'mainnet'`  |
| `TESTNET`  | `'testnet'`  |
| `LOCALNET` | `'localnet'` |
