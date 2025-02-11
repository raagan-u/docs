---
id: sdk-demo-app
---

:::note
This cookbook demonstrates the basic implementations to integrate Garden sdk to perform various actions like fetching quotes, swapping, fetching orders from orderbook. For completely working example demo app refer to [SDK Demo App](https://github.com/catalogfi/sdk-demo-app).
:::

# SDK Demo App using Nextjs

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
```tsx
import { useGarden } from "@gardenfi/react-hooks";
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
</Tabs>