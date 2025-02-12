---
id: sdk-demo-app
---


# SDK Demo App using Nextjs

:::note
This cookbook demonstrates the basic implementations to integrate Garden sdk to perform various actions like fetching quotes, swapping, fetching orders from orderbook. For completely working example demo app refer to [catalogfi/sdk-demo-app](https://github.com/catalogfi/sdk-demo-app).
:::

This cookbook demonstrates how to build a simple swap application using Garden SDK in a Next.js environment. We'll create a dApp that enables users to swap between TestnetBTC and WBTC on the testnet.

## What we'll build

- A swap interface for TestnetBTC ↔ WBTC conversions
- Integration with Garden SDK for handling swaps
- Wallet connection and transaction management
- Real-time quote updates

![start UI](../images/sdk-demo-app/sdk-demo-app-ui.png)

## Garden Provider Setup

First, let's set up the Garden Provider which will handle our SDK initialization and provide access to swap functionality throughout the app.

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

## Fetching quotes

Garden SDK provides `getQuote` hook which provides the current USD values and quote for the provided `fromAsset`, `toAsset`, `amount` and `isExactOut` parameters.

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

Garden SDK provides `swapAndInitiate` hook which expects inputs of type `SwapParams` and returns the initiated order of type `Matched Order`. The hook creates an order, waits for it to be matched, and initiates it if the source chain is EVM. Returns the order object or an error message.

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
While the [SDK demo app](https://github.com/catalogfi/sdk-demo-app) redirects users to [Garden Explorer](https://explorer.garden.finance/) for order status monitoring, Garden SDK provides hooks to fetch and track order status programmatically. Here's how to implement order tracking:
:::

Garden SDK provides `ParseOrderStatus` which parses the order status based on the current block number and checks if the order is `expired`, `initiated`, `redeemed`, or `refunded`.

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