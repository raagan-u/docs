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

## Set up wallets and providers

After installation, set up wallets only for the chains you need. Ethereum and Starknet require wallet setup, but Bitcoin does not.

```typescript
import {
  BitcoinProvider,
  BitcoinNetwork,
  BitcoinWallet,
} from '@catalogfi/wallets';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';
import { RpcProvider, Account } from 'starknet';

// Ethereum wallet setup
const account = privateKeyToAccount(`<YOUR_EVM_PRIVATE_KEY>`);
const ethereumWalletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
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

## Configure garden instance

To initialize the **Garden** instance, you need to create a digest key. You can either generate a random key or provide your own digest key.
For more details, see [DigestKey](../reference/classes/DigestKey.md).

### Two ways to initialize `Garden`

**Using wallets:**

```typescript
  // Initialize Garden with wallets
  import { Garden } from '@gardenfi/core';
  import { Environment, DigestKey } from '@gardenfi/utils';

  const digestKey = DigestKey.from(<YOUR_DIGEST_KEY>);

  const garden = Garden.fromWallets({
    environment: Environment.TESTNET,
    digestKey: digestKey.val,
    wallets: {
      evm: ethereumWalletClient,
      starknet: starknetWallet
    }
  });
```

**Manual initiation with custom HTLC implementation:**

In this approach, you manually implement your own HTLC (Hashed Time-Locked Contract) to initiate and redeem transactions. For reference, check the second implementation in the snippet. You can also refer to the [IEVMHTLC](../interfaces#ievmhtlc) and [IStarknetHTLC](../interfaces#istarknethtlc) interfaces for more details.

```typescript
  // With custom HTLC implementation
  import { Garden } from '@gardenfi/core';
  import { Environment } from '@gardenfi/utils';

  const garden = new Garden({
    environment: Environment.TESTNET,
    digestKey.val.digestKey,
    htlc: {
      evm: <IEVMHTLC>,
      starknet: <IStarknetHTLC>,
    },
  });
```

## Create a swap

- Use `SupportedAssets` from `@gardenfi/orderbook` to select assets based on the chain.
- Fetch a quote and choose a strategy.
- Call the `swap()` function to create an order.

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
  fromAsset,
  toAsset
);

// Get the quote for the send amount and order pair
const quoteResult = await garden.quote.getQuote(
  orderPair,
  Number(sendAmount),
  false,
  {
    // Optional: affiliate fee in basis points (bps), where 1 bps = 0.01%.
    // This allows affiliates or integrators to earn a commission on each swap.
    // Example: 30 bps = 0.3% of the source asset value.
    affiliateFee: 30
  }
);

if (!quoteResult.ok) {
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
    // provide btcAddress only when the source chain and destination chain is bitcoin
    btcAddress?: <YOUR_BITCOIN_TESTNET_ADDRESS>,
  },
  // Optional: affiliateFee allows integrators to earn a commission per swap
  // Provide one or more fee splits, specifying recipient address, chain, and asset
  // Asset must be from the supported set; integrators can choose between USDC and cbBTC
  affiliateFee?: [
    {
        address: <ADDRESS_1>,
        chain: "ethereum",
        asset: <USDC_HTLC_ADDRESS>,
        fee: 10 // in bps
    },
    //... Add more splits as needed
  ]
};

const swapResult = await garden.swap(swapParams);

if (!swapResult.ok) {
  throw new Error(swapResult.error);
}

const order = swapResult.val;
console.log('✅ Order created successfully, id: ', order.create_order.create_id);
```

## Initiate the swap

After creating an order, you need to send funds to the HTLC contract. The implementation will vary depending on the chain.

<Tabs>
<TabItem value="EVM -> BTC" label="EVM -> BTC">
```ts
// Use the EVM relay service for gasless initiates
// The relay handles transaction execution on behalf of the user.
// Initiate the swap.
// Note: The first swap requires ETH for token approval.
// Subsequent swaps will be gasless.
// Common error: "transfer amount exceeds balance,"
// indicating insufficient token balance in your wallet.

const order = swapResult.val;
const initRes = await garden.evmHTLC.initiate(order);

if (!initRes.ok) {
  console.log(`Error encountered for account: ${ethereumWalletClient.account.address}`);
  throw new Error(initRes.error);
}

````
</TabItem>

<TabItem value="BTC -> EVM" label="BTC -> EVM">
```typescript
const order = swapResult.val; // deposit the funds into order.source_swap.swap_id
const depositAddress = order.source_swap.swap_id;
```

:::note
When swapping BTC for any other asset, deposit the funds into order.source_swap.swap_id.
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

if (!initRes.ok) {
  console.log(`Error encountered for account: ${starknetWallet.address}`);
  throw new Error(initRes.error);
}

````

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

if (!initRes.ok) {
  console.log(`Error encountered for account: ${ethereumWalletClient.account.address}`);
  throw new Error(initRes.error);
}

````
</TabItem>
</Tabs>

## Settle the swap

Garden handles the swap settlement automatically. You only need to call the `execute` function.
It continuously polls for the order status and calls redeem when the status becomes redeemable.

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
