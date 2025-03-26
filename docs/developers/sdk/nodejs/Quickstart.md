---
id: quickstart
title: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import InstallAlert from "./\_install-alert.mdx";

## Installation

<Tabs>

<TabItem value="npm" label="npm">

```bash
npm install @gardenfi/core @gardenfi/utils @gardenfi/orderbook
```

</TabItem>

<TabItem value="yarn" label="yarn">

```bash
yarn add @gardenfi/core @gardenfi/utils @gardenfi/orderbook
```

</TabItem>

<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @gardenfi/core @gardenfi/utils @gardenfi/orderbook
```

</TabItem>

</Tabs>

**Additional dependencies**

<Tabs>

<TabItem value="npm" label="npm">

```bash
npm install viem @catalogfi/wallets
```

</TabItem>

<TabItem value="yarn" label="yarn">

```bash
yarn add viem @catalogfi/wallets
```

</TabItem>

<TabItem value="pnpm" label="pnpm">

```bash
pnpm add viem @catalogfi/wallets
```

</TabItem>

</Tabs>

---

## Set Up Wallets and Providers

After installation, start by setting up wallets for Ethereum and Starknet. for Bitcoin, you don't need to setup wallet.

- **Ethereum Wallet:**
    - Use the `viem` function `createWalletClient` to create the Ethereum wallet client.
    - First, convert your private key into an account using `privateKeyToAccount`.
    - Pass the account, the Ethereum chain (e.g., `sepolia`), and the transport method using `http()` to `createWalletClient`.

- **Starknet Wallet:**
    - Use the `starknet` library’s `RpcProvider` to create a provider. You can either use the default RPC node URL by leaving the arguments empty or specify your own RPC node URL by passing it as a parameter.
    - Create a Starknet wallet using the `Account` class by passing the provider, wallet address, and private key.

```typescript
import {
  BitcoinProvider,
  BitcoinNetwork,
  BitcoinWallet,
} from '@catalogfi/wallets';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { RpcProvider, Account } from 'starknet';

// Ethereum wallet setup
const account = privateKeyToAccount(`0x<YOUR_PRIVATE_KEY>`);

const ethereumWalletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
});

//Starknet wallet setup
const starknetProvider = new RpcProvider(); // using default node url

const starknetWallet = new Account(
  starknetProvider,
  <YOUR_STARKNET_ADDRESS>,
  <YOUR_STARKNET_PRIVATE_KEY>,
);
```

---

## Configure Garden core

For more details, see [DigestKey](../reference/classes/DigestKey.md).

To initialize the **Garden** instance, you need to create a digest key. You can either generate a random key or provide your own digest key. For more details, refer to the link provided above.

### Two Ways to Instantiate `Garden`:

1. **Using the Static `.from()` Method:**  
   - Use `Garden.from()` to initialize the instance.
   - Set the `environment` (e.g., `Environment.TESTNET`, `Environment.MAINNET`, or `Environment.LOCALNET`).
   - Pass the `digestKey` and the configured wallet clients in the `wallets` property (e.g., `evm` and `starknet` wallets).


  ```typescript
    // First way to instantiate garden
    import { Garden, DigestKey } from '@gardenfi/core';
    import { Environment } from '@gardenfi/utils';

    const digestKey = DigestKey.from(<YOUR_DIGEST_KEY>);

    const garden = Garden.from({
      environment: Environment.TESTNET,
      digestKey,
      wallets: {
        evm: ethereumWalletClient,
        starknet: starknetWallet
      }
    });
  ```
2. ### Manual Instantiation with Custom HTLC Implementation
    In the second approach, which is a manual method, you can provide your own implementation of HTLC (Hashed Time-Locked Contract). This custom implementation will be used to initiate and redeem transactions. For reference, check the second implementation provided in the snippet. you can refer to [IEVMHTLC](../interfaces#ievmhtlc) and [IStarknetHTLC](../interfaces#istarknethtlc) interfaces for more details. 

    To manually instantiate `Garden`, you will need to set the relayer URL, specify the environment, and provide the digest key. You’ll also have to define custom implementations for handling transactions on different chains like Ethereum and Starknet.

  ```typescript
    // Second way to instantiate garden

    const garden = new Garden({
      api: RELAYER_URL,
      environment: Environment.TESTNET,
      digestKey.val.digestKey,
      quote: new Quote(QUOTE_SERVER_URL),
      htlc: {
        evm: new EvmRelay(
          RELAYER_URL,
          evmWallet,
          Siwe.fromDigestKey(
            new Url(RELAYER_URL),
            digestKey.val.digestKey,
          ),
        ),
        starknet: new StarknetRelay(STARKNET_RELAY_URL, starknetWallet),
      },
    });
  ```


## Create a Swap

  - Select the Assets and set the amount to be send. you can choose `fromAsset` and `toAsset` from `SupportedAssets` in `@gardenfi/core`by printing the `SupportedAssets` object.
  - get quote.you will get the strategy id and amount you will receive.
  - call `swap()` function to create the order.

  ```typescript
import { Quote, SwapParams } from '@gardenfi/core';
import { Asset, SupportedAssets } from '@gardenfi/orderbook';

// Try printing out the SupportedAssets object to see the other assets you can use

const fromAsset = SupportedAssets.testnet.ethereum_sepolia_WBTC;
const toAsset = SupportedAssets.testnet.bitcoin_testnet_BTC;
/* 
  Asset selection examples based on the chain:
  - Ethereum Sepolia: SupportedAssets.testnet.ethereum_sepolia_WBTC
  - Bitcoin Testnet: SupportedAssets.testnet.bitcoin_testnet_BTC
  - Starknet Testnet: SupportedAssets.testnet.starknet_testnet_ETH
*/

const sendAmount = '1000000';

// helper function to create the order pair
const constructOrderpair = (fromAsset: Asset, toAsset: Asset) =>
`${fromAsset.chain}:${fromAsset.atomicSwapAddress}::${toAsset.chain}:${toAsset.atomicSwapAddress}`;

  const orderPair = constructOrderpair(
    orderConfig.fromAsset,
    orderConfig.toAsset
  );

// Get the quote for the send amount and order pair
  const quoteResult = await garden.quote.getQuote(
    orderPair,
    Number(orderConfig.sendAmount),
    false
  );

  if (quoteResult.error) {
    throw new Error(quoteResult.error);
  }

// choose a quote
const firstQuote = Object.entries(quoteResult.val.quotes)[0];

const [_strategyId, quoteAmount] = firstQuote;

  const swapParams: SwapParams = {
    fromAsset,
    toAsset,
    sendAmount,
    receiveAmount: quoteAmount,
    additionalData: {
    strategyId: _strategyId,
    btcAddress: <YOUR_BITCOIN_TESTNET_ADDRESS>, // provide this only when the source chain and destination chain is bitcoin
    },
  };

const swapResult = await garden.swap(swapParams);

  if (swapResult.error) {
    throw new Error(swapResult.error);
  }

console.log('Order created with id', swapResult.val.create_order.create_id);
```

## Initiate the swap

This is a manual implementation where you need to initiate the order based on the selected source chain.  
- If source chain is EVM, use the `evmHTLC` function in `garden` to initiate the order.  
- If source chain is Starknet, initiate the order using `starknetHTLC`.  
- If source chain is Bitcoin, there's no need to initiate — simply deposit the funds to `order.source_swap.swap_id`.

<Tabs>
<TabItem value="EVM -> BTC" label="EVM -> BTC">
```typescript
// Use the EVM relay service for gasless initiates
// The relay handles transaction execution on behalf of the user.
// Initiate the swap.
// Note: The first swap requires ETH for token approval.
// Subsequent swaps will be gasless.
// Common error: "transfer amount exceeds balance,"
// indicating insufficient token balance in your wallet.

const order = swapResult.val;
const initRes = await garden.evmHTLC.initiate(order);

if (initRes.error) {
  console.log(`Error encountered for account: ${ethereumWalletClient.account.address}`);
  throw new Error(initRes.error);
}
````
</TabItem>
<TabItem value="BTC -> EVM" label="BTC -> EVM">
```typescript
const order = swapResult.val; // deposit the funds into *order.source_swap.swap_id*
```

:::note  
When swapping from BTC to any other asset, deposit the fund into `order.source_swap.swap_id`.  
:::
</TabItem>

<TabItem value="STARKNET -> BTC" label="STARKNET -> BTC">
```typescript
// Use the Starknet relay service for gasless initiates
// The relay handles transaction execution on behalf of the user.
// Initiate the swap.
// Note: The first swap requires ETH for token approval.
// Subsequent swaps will be gasless.
// Common error: "transfer amount exceeds balance,"
// indicating insufficient token balance in your wallet.

const order = swapResult.val;
const initRes = await garden.starknetHTLC.initiate(order);

if (initRes.error) {
  console.log(`Error encountered for account: ${starknetWallet.address}`);
  throw new Error(initRes.error);
}
```
</TabItem>

<TabItem value="EVM -> STARKNET" label="EVM -> STARKNET">
```typescript
// Use the EVM relay service for gasless initiates
// The relay handles transaction execution on behalf of the user.
// Initiate the swap.
// Note: The first swap requires ETH for token approval.
// Subsequent swaps will be gasless.
// Common error: "transfer amount exceeds balance,"
// indicating insufficient token balance in your wallet.

const order = swapResult.val;
const initRes = await garden.evmHTLC.initiate(order);

if (initRes.error) {
  console.log(`Error encountered for account: ${ethereumWalletClient.account.address}`);
  throw new Error(initRes.error);
}
````
</TabItem>
</Tabs>

## Settle the swap

```typescript
// Automatically manages the execution of redeems or refunds.
// Regularly polls the orderbook to track the status of orders
// and triggers appropriate actions (redeem or refund) based on their state.

await garden.execute();

// Subscribe to Garden events to track transaction statuses
garden.on('error', (order, error) => {
  console.error(
    `Error occurred for order ID: ${order.create_order.create_id}, Details:`,
    error
  );
});

garden.on('success', (order, action, txHash) => {
  console.log(`${order} ${action} ${txHash}`);

  // Important note about Bitcoin redeems:
  // Until the Bitcoin transaction is mined and visible at the above URL,
  // it is highly recommended to keep the Garden instance running.
  // Garden will automatically resubmit the redeem transaction if required,
  // handling scenarios like dropped transactions or network issues.
  // If the instance is stopped, restarting it will ensure Garden checks the
  // status of the order and resubmits the redeem if necessary.

  // Wait for the swap to complete. Use Ctrl+C to stop the script when done.
  // This ensures the script continues running to monitor the swap's progress.
});

await new Promise((resolve) => setTimeout(resolve, 10000000000));
````
