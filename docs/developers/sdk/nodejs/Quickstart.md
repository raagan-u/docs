---
id: quickstart
title: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import InstallAlert from "./\_install-alert.mdx";

## 1. Installation

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

## 2. Set up wallets and providers

```typescript
import {
  BitcoinProvider,
  BitcoinNetwork,
  BitcoinWallet,
} from '@catalogfi/wallets';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

// Ethereum wallet setup
const account = privateKeyToAccount(<YOUR_PRIVATE_KEY>);

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

## 3. Configure Garden core

Initialize the **Garden** instance.

```typescript
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

For more details, see [DigestKey](../reference/classes/DigestKey.md).

## 4. Create a swap

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

## 5. Initiate the swap

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

## 6. Settle the swap

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
