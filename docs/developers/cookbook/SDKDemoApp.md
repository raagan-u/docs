---
id: sdk-demo-app
---


# Exchange (using Garden SDK)

:::note
This cookbook demonstrates the basic implementations to integrate Garden sdk to perform various actions like fetching quotes, swapping, fetching orders from orderbook. For completely working example demo app refer to [catalogfi/sdk-demo-app](https://github.com/catalogfi/sdk-demo-app).
:::

This cookbook demonstrates how to build a simple bridge using Garden SDK in a Next.js environment. Garden SDK provides a seamless way to perform swaps between any two [supported assets](../SupportedChains.mdx). But for now the demonstration of this cookbook is limited to BTC (`testnet4`) to WBTC (`Ethereum Sepolia`)

## What you'll build

- **Cross-chain swaps**: Enable seamless swaps between BTC(`testnet4`) to WBTC (`Ethereum Sepolia`)
- **Real-time quotes**: Get real-time quotes for selected `fromAsset`, `toAsset`, `amount` params
- **Initialize swap**: Initiate the swap and wait for the counterparty to initiate
- **Order status tracking**: Keep users informed about the status of their swaps

![start UI](../images/sdk-demo-app/sdk-demo-app-ui.png)
![UI](../images/sdk-demo-app/sd-demo-app-final-ui.png)

## Garden Provider Setup

Think of Garden Provider as your app's command center! It's a context wrapper that gives your application access to all of Garden SDK's features

Here's how you can set up the Garden Provider:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="provider" label="GardenProviderWrapper.tsx">
```tsx
"use client";

import { GardenProvider } from "@gardenfi/react-hooks";
import { Environment } from "@gardenfi/utils";
import { useWalletClient } from "wagmi";

const getStorage = (): Storage => {
    if (typeof window !== "undefined") {
        return localStorage;
    }
    return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null,
    };
};

function GardenProviderWrapper({ children }: { children: React.ReactNode }) {
    const { data: walletClient } = useWalletClient();

    return (
        <GardenProvider
            config={{
                store: getStorage(),
                environment: Environment.TESTNET,
                walletClient: walletClient,
            }}
        >
            {children}
        </GardenProvider>
    );
}

export default GardenProviderWrapper;
```
</TabItem>

</Tabs>

## Authentication

To interact with blockchain networks, your app needs a way to sign transactions. Garden SDK uses `walletClient` from the `wagmi` library to handle this. You'll need to:

1. Get the [walletClient](https://wagmi.sh/react/api/hooks/useWalletClient#usewalletclient) using the `useWalletClient` hook
2. Pass it to your `GardenProvider` configuration

The `walletClient` manages:
- Wallet connections
- Transaction signing
- Network interactions

## Fetching quotes

Great! Now that you have your `walletClient`, you can use it to initialize the `GardenProvider`. Before diving into swap, your app needs to fetch real-time quotes for their swap params `fromAsset`, `toAsset`, `amount`.

Here's how you can fetch real-time quotes for your swap! The `getQuote` hook from Garden SDK helps you get the current USD values and exchange rates between any two supported assets. You'll need to provide:

- The token you want to swap from (`fromAsset`)
- The token you want to receive (`toAsset`)
- The amount you want to swap (`amount`)
- Whether you're specifying the input or output amount (`isExactOut`)

Let's see the following basic implementation:

<Tabs>

  <TabItem value="provider" label="TokenSwap.tsx">
```tsx
import { useGarden } from "@gardenfi/react-hooks";
import BigNumber from "bignumber.js";

const TokenSwap = ()=>{
    const { getQuote } = useGarden();
    const {swapParams} = swapStore();
    const fetchQuote = async (amount: string) => {
        if (!getQuote) return;

        const amountInDecimals = new BigNumber(amount).multipliedBy(
            10 ** swapParams.fromAsset.decimals
        );

        const quote = await getQuote({
            fromAsset: swapParams.fromAsset,
            toAsset: swapParams.toAsset,
            amount: amountInDecimals.toNumber(),
            isExactOut: false,
        });
    }
}
```
</TabItem>

<TabItem value="swapStore" label="SwapStore.ts">
```ts
import { SupportedAssets } from "@gardenfi/orderbook";
import { SwapParams } from "@gardenfi/core";
import { create } from "zustand";
interface SwapState {
  swapParams: SwapParams;
  setSwapParams: (params: Partial<SwapState["swapParams"]>) => void;
}
export const swapStore = create<SwapState>((set) => ({
  swapParams: {
    fromAsset: SupportedAssets.testnet.ethereum_sepolia_WBTC,
    toAsset: SupportedAssets.testnet.bitcoin_testnet_BTC,
    sendAmount: "0",
    receiveAmount: "0",
    additionalData: { strategyId: "" },
  },
  setSwapParams: (params) =>
    set((state) => ({
      swapParams: { ...state.swapParams, ...params },
    })),
}));
```
</TabItem>
</Tabs>

## Swap and initiate

Great! Now that you have the quotes, it's time to execute the swap! Garden SDK provides `swapAndInitiate` hook that handles the entire swap process for you. 

Here's what it does:
1. Creates your swap order
2. Waits for it to be matched with a suitable counterparty
3. Automatically initiates the swap if you're on an EVM chain

You'll need to provide the swap parameters (including the quote details you got earlier), and the hook will return either your matched order or an error message if something goes wrong. 

Here's how you can implement this:

<Tabs>

  <TabItem value="swalAndInitiate" label="TokenSwap.tsx">
```tsx
import { useGarden } from "@gardenfi/react-hooks";
const TokenSwap = ()=>{
    const { swapAndInitiate } = useGarden();
    const performSwap = async (strategyId: string, receiveAmount: string)=>{
    const response = await swapAndInitiate({
      fromAsset: swapParams.fromAsset,
      toAsset: swapParams.toAsset,
      sendAmount,
      receiveAmount,
      additionalData: {
        btcAddress,
        strategyId,
      },
    });
    }
}
```
</TabItem>

<TabItem value="swapParams" label="SwapParams.ts">
```ts
// type defined in @gardenfi/core
export type SwapParams = {
    /**
     * Asset to be sent.
     */
    fromAsset: Asset;
    /**
     * Asset to be received.
     */
    toAsset: Asset;
    /**
     * Amount in lowest denomination of the asset.
     */
    sendAmount: string;
    /**
     * Amount in lowest denomination of the asset.
     */
    receiveAmount: string;
    /**
     * Time lock for the swap.
     */
    timelock?: number;
    /**
     * This will wait for the specified number of confirmations before redeeming the funds.
     */
    minDestinationConfirmations?: number;
    /**
     * Unique nonce for generating secret and secret hashes. If not provided, it will be generated as the total order count until now + 1.
     */
    nonce?: number;
    /**
     * Additional data for the order.
     */
    additionalData: {
        /**
         * Get strategy id from the quote
         */
        strategyId: string;
        /**
         * Provide btcAddress if the destination or source chain is bitcoin. This address is used as refund address if source chain is bitcoin, and as redeem address if destination chain is bitcoin.
         */
        btcAddress?: string;
    };
};
```
</TabItem>

<TabItem value="matchedOrder" label="MatchedOrder.ts">
```ts
// type defined in @gardenfi/orderbook
export type MatchedOrder = {
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    source_swap: Swap;
    destination_swap: Swap;
    create_order: CreateOrder;
};
```
</TabItem>

</Tabs>


## Fetch Order Status

:::note
While the [SDK demo app](https://github.com/catalogfi/sdk-demo-app) redirects users to [Garden Explorer](https://explorer.garden.finance/) for order status monitoring, Garden SDK provides hooks to fetch and track order status programmatically.
:::

Your swap is now initiated - but what's happening with your order? You can keep your users informed! While you could redirect users to the [Garden Explorer](https://explorer.garden.finance/), you can create a better user experience by tracking the order status right in your app.

The Garden SDK makes this easy with the `ParseOrderStatus` hook, which tells us exactly what's happening with the order. It checks the current block numbers on both chains and tells us if the order is:
- `Expired` - The user's swap has expired, and they have to refund their funds.
- `Initiated` - User initiated, waiting for counterparty to initiate.
- `Redeemed` - User redeemed, counterparty has to redeem
- `Refunded` - User refunded

Let's see how to implement this status tracking:

<Tabs>
  <TabItem value="fetchOrder" label="OrderStatusParser.tsx">
```tsx

const OrderStatusParser = ()=>{
    const status = ParseOrderStatus(
      order.val,
      blockNumbers.val[order.val.source_swap.chain],
      blockNumbers.val[order.val.destination_swap.chain],
    );
    console.log('status :', status);
}

```
</TabItem>

</Tabs>

Ta-Daa! You have now everything that is needed to build a simple swap application using the Garden SDK.