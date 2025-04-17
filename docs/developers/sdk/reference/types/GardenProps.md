---
id: garden-props
title: GardenProps
---

This type represents the configuration object for the Garden instance.

| Property           | Type                                                        | Description                                                                                              |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| environment        | Environment                                                 | Specifies the network (`mainnet` or `testnet`).                                                          |
| digestKey          | string \| [DigestKey](../reference/classes/DigestKey.md)    | It is a 32-byte non-custodial identifier used for auth, identity, and secret management in atomic swaps. |
| api                | string                                                      | Orderbook service's base URL                                                                             |
| secretManager      | [ISecretManager](../Interfaces.md#isecretmanager)           | It handles generation and retrieval of secrets and secretHashes for swaps.                               |
| orderbook          | [IOrderbook](../Interfaces.md#iorderbook)                   | Allows creating and managing orders easily                                                               |
| quote              | [IQuote](../Interfaces.md#iquote)                           | Get a quote for the given orderpair and amount.                                                          |
| blockNumberFetcher | [IBlockNumberfetcher](../Interfaces.md#iblocknumberfetcher) | Fetches the current block numbers across multiple chains.                                                |
| siweOpts           | SiweOpts                                                    | Specifies Sign-In With Ethereum (SIWE) config                                                            |
| htlc               | HTLCConfig                                                  | HTLC implementations for supported networks.                                                             |

**SiweOpts**

```ts
{
    domain?: string;
    store?: IStore;
    signingStatement?: string;
};
```

**HTLCConfig**

```ts
{
    evm?: IEVMHTLC;
    starknet?: IStarknetHTLC;
}
```

<!-- **Example Usage:**

```ts
const api = <ORDERBOOK_URL>;
const quote_api = <QUOTE_URL>;

const garden = new Garden({
    api,
    environment: Environment.TESTNET,
    digestKey: <YOUR_DIGEST_KEY>,
    quote: new Quote(quote_api),
    htlc: {
    evm: new EvmRelay(
        api,
        arbitrumWalletClient,
        Siwe.fromDigestKey(new Url(api), digestKey),
    ),
    },
});
``` -->
