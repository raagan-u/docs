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
npm install @gardenfi/core @gardenfi/utils
```

</TabItem>

<TabItem value="yarn" label="yarn">

```bash
yarn add @gardenfi/core @gardenfi/utils
```

</TabItem>

<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @gardenfi/core @gardenfi/utils
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
import { SecretManager } from '@gardenfi/core';
import {
  BitcoinProvider,
  BitcoinNetwork,
  BitcoinWallet,
} from '@catalogfi/wallets';
import { privateKeyToAccount, createWalletClient, http, sepolia } from 'viem';

// Ethereum wallet setup
const account = privateKeyToAccount(YOUR_PRIVATE_KEY);

const ethereumWalletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
});

// initialize secret manager for handling atomic swap secrets and hashes
const result = await SecretManager.fromWalletClient(ethereumWalletClient);

if (result.error) {
  throw new Error(result.error);
}

const secretManager = result.val;

// create an in-memory Bitcoin wallet for handling Bitcoin operations
const btcWallet = BitcoinWallet.fromPrivateKey(
  secretManager.getMasterPrivKey(),
  bitcoinProvider
);

const bitcoinProvider = new BitcoinProvider(
  BitcoinNetwork.Testnet,
  bitcoinProvider
);
```

---

## 3. Configure Garden core

Initialize the **Garden** instance.

```typescript
import { Garden } from '@gardenfi/core';

const garden = new Garden({
  environment: Environment.TESTNET,
  evmWallet: ethereumWalletClient,
});
```

---

## 4. Create a swap

```typescript
import { Quote, SupportedAssets, Asset, SwapParams } from "@gardenfi/core";

// Try printing out the SupportedAssets object to see the other assets you can use
const orderConfig = {
  fromAsset:
  SupportedAssets.testnet.ethereum_sepolia_WBTC,
  toAsset:
  SupportedAssets.testnet.bitcoin_BTC,
  sendAmount: '1000000', // 0.01 Bitcoin
};

// helper function to create the order pair
const constructOrderpair =
(fromAsset: Asset, toAsset: Asset) =>
  `${fromAsset.chain}:${fromAsset.atomicSwapAddress}
  ::${toAsset.chain}:${toAsset.atomicSwapAddress}`;

const orderPair = constructOrderpair(
  orderConfig.fromAsset,
  orderConfig.toAsset
);

const QUOTE_API = https://pricev2.garden.finance/
const quote = new Quote(QUOTE_API);

// Get the quote for the send amount and order pair
const quoteResult = await quote.getQuote(orderPair, +orderConfig.sendAmount);
if (quoteResult.error) {
  throw new Error(quoteResult.error);
}

// choose a quote
const firstQuote = Object.entries(quoteResult.val.quotes)[0];

const [_strategyId, quoteAmount] = firstQuote;

let swapParams: SwapParams = {
  ...orderConfig,
  receiveAmount: quoteAmount,
  additionalData: {
    strategyId: _strategyId,
    // this is where the btc will be sent to
    btcAddress: await btcWallet.getAddress(),
  },
};

// This creates the order on chain and then returns the matched order
const swapResult = await garden.swap(swapParams);

if (swapResult.error) {
  throw new Error(swapResult.error);
}

console.log('Order created with id', swapResult.val.create_order.create_id);
```

---

## 5. Initiate the swap

```typescript
import { EvmRelay } from '@gardenfi/core';

// Use the EVM relay service for gasless initiates
// The relay handles transaction execution on behalf of the user.

const evmRelay = new EvmRelay(swapResult.val, orderBookApi, auth);

// Initiate the swap.
// Note: The first swap requires ETH for token approval.
// Subsequent swaps will be gasless.
// Common error: "transfer amount exceeds balance,"
// indicating insufficient token balance in your wallet.
// Important: If swapping from Bitcoin to WBTC,
// ensure funds are deposited into the `order.source_swap_id`.

const initRes = await evmRelay.init(ethereumWalletClient);
if (initRes.error) {
  console.log(`Error encountered for account: 
  ${ethereumWalletClient.account.address}`);
  throw new Error(initRes.error);
}
```

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
```
