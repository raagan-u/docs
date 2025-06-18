---
id: garden-props
title: GardenConfig
---

## `GardenConfigWithWallets`
This type represents the configuration object for the Garden instance using wallets.

```ts
type GardenConfigWithWallets = {
  environment: ApiConfig;
  digestKey: string | DigestKey;
  secretManager?: ISecretManager;
  auth?: IAuth;
  orderbook?: IOrderbook;
  quote?: IQuote;
  blockNumberFetcher?: IBlockNumberFetcher;
  wallets: {
    evm?: WalletClient;
    starknet?: AccountInterface;
  };
};
```

| Property           | Type                                                        | Description                                                                                              |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| environment        | ApiConfig                                                 |   Can be either a string representing the environment (`mainnet`, `testnet`, `localnet`, etc.), or an object that includes a required `environment` field along with optional API endpoint overrides. |
| digestKey          | string \| [DigestKey](../../reference/classes/DigestKey.md)    | It is a 32-byte non-custodial identifier used for auth, identity, and secret management in atomic swaps. |URL                                                                             |
| secretManager      | [ISecretManager](../../Interfaces.md#isecretmanager)           | It handles generation and retrieval of secrets and secretHashes for swaps.                               |
| auth          | [IAuth](../../Interfaces.md#iauth)                                | Auth implementation for SIWE (Sign-In With Ethereum.)                                                |
| orderbook          | [IOrderbook](../../Interfaces.md#iorderbook)                   | Allows creating and managing orders easily                                                               |
| quote              | [IQuote](../../Interfaces.md#iquote)                           | Get a quote for the given orderpair and amount.                                                          |
| blockNumberFetcher | [IBlockNumberfetcher](../../Interfaces.md#iblocknumberfetcher) | Fetches the current block numbers across multiple chains.                                                |
| wallets               | GardenWalletModules                                                 | Specifies connected wallet clients (either EVM or starknet).



`GardenWalletModules`

```ts
{
    evm?: WalletClient;
    starknet?: AccountInterface;
}
```



## `GardenConfigWithHTLCs`
This type represents the configuration object for the Garden instance using HTLCs.

```ts
type GardenConfigWithHTLCs = {
  environment: ApiConfig;
  digestKey: string | DigestKey;
  secretManager?: ISecretManager;
  auth?: IAuth;
  orderbook?: IOrderbook;
  quote?: IQuote;
  blockNumberFetcher?: IBlockNumberFetcher;
  htlc: {
    evm?: IEVMHTLC;
    starknet?: IStarknetHTLC;
  };
};
```

| Property           | Type                                                        | Description                                                                                              |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| environment        | ApiConfig                                                 |   Can be either a string representing the environment (`mainnet`, `testnet`, `localnet`, etc.), or an object that includes a required `environment` field along with optional API endpoint overrides, specifying the network.  |
| digestKey          | string \| [DigestKey](../reference/classes/DigestKey.md)    | It is a 32-byte non-custodial identifier used for auth, identity, and secret management in atomic swaps. |URL                                                                             |
| secretManager      | [ISecretManager](../Interfaces.md#isecretmanager)           | It handles generation and retrieval of secrets and secretHashes for swaps.                               |
| auth          | [IAuth](../../Interfaces.md#iauth)                                | Auth implementation for SIWE (Sign-In With Ethereum.)                                                |
| orderbook          | [IOrderbook](../Interfaces.md#iorderbook)                   | Allows creating and managing orders easily                                                               |
| quote              | [IQuote](../Interfaces.md#iquote)                           | Get a quote for the given orderpair and amount.                                                          |
| blockNumberFetcher | [IBlockNumberfetcher](../Interfaces.md#iblocknumberfetcher) | Fetches the current block numbers across multiple chains.                                                |
| htlc               | HTLCConfig                                                  | HTLC implementations for supported networks.  

`HTLCConfig`

```ts
{
    evm?: IEVMHTLC;
    starknet?: IStarknetHTLC;
}
```