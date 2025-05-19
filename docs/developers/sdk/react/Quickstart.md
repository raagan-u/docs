---
id: quickstart
title: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import InstallAlert from "../nodejs/\_install-alert.mdx";

## 1. Installation

<InstallAlert/>

### Garden dependencies

To install the required Garden packages:
<Tabs>
<TabItem value="npm" label="npm">

    ```bash
    npm install @gardenfi/core @gardenfi/orderbook @gardenfi/react-hooks
    ```

    </TabItem>
    <TabItem value="yarn" label="yarn">

    ```bash
    yarn add @gardenfi/core @gardenfi/orderbook @gardenfi/react-hooks
    ```

    </TabItem>
    <TabItem value="pnpm" label="pnpm">

    ```bash
    pnpm add @gardenfi/core @gardenfi/orderbook @gardenfi/react-hooks
    ```

    </TabItem>

</Tabs>

### wagmi dependencies

To install wagmi dependencies:
<Tabs>
<TabItem value="npm" label="npm">
    ```bash
      npm install @tanstack/react-query wagmi
    ```

    </TabItem>
    <TabItem value="yarn" label="yarn">

    ```bash
    yarn add @tanstack/react-query wagmi
    ```

    </TabItem>
    <TabItem value="pnpm" label="pnpm">

    ```bash
    pnpm add @tanstack/react-query wagmi
    ```
    </TabItem>

</Tabs>

---

### starknet dependencies

To install starknet dependencies:
<Tabs>
<TabItem value="npm" label="npm">
    ```bash
      npm install @starknet-react/core starknet starknetkit
    ```

    </TabItem>
    <TabItem value="yarn" label="yarn">

    ```bash
    yarn add @starknet-react/core starknet starknetkit
    ```

    </TabItem>
    <TabItem value="pnpm" label="pnpm">

    ```bash
    pnpm add @starknet-react/core starknet starknetkit
    ```
    </TabItem>

</Tabs>

## 2. Setup your React app.

Integrate Garden into your React app by wrapping it with the **GardenProvider**. This enables interaction with the protocol and handles session management.

- `environment`: Specifies the network (`mainnet` or `testnet`).
  <Tabs>
  <TabItem value="app.tsx" label="app.tsx" default>

        ```tsx
        import { GardenProvider } from '@gardenfi/react-hooks';
        import { Environment } from '@gardenfi/utils';
        import { useAccount } from "@starknet-react/core";
        import { useWalletClient } from 'wagmi';
        import { Swap } from './Swap';

        function App() {
          const { data: walletClient } = useWalletClient();
          const { account: starknetWallet } = useAccount();

          return (
            <GardenProvider
              config={{
                environment: Environment.TESTNET,
                wallets: {
                  evm: walletClient,
                  starknet: starkentWallet
                }
              }}
            >
              <Swap />
            </GardenProvider>
          );
        }

        export default App;
        ```

    </TabItem>
  <TabItem value="main.tsx" label="main.tsx">

  ```tsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { WagmiProvider } from 'wagmi';
  import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
  import { wagmiConfig } from 'wagmi.ts';
  import { StarknetConfig } from "@starknet-react/core";
  import {
    starknetChains,
    connectors as starknetConnectors,
    starknetProviders,
  } from "./starknetConfig.ts";

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <StarknetConfig
            chains={starknetChains}
            provider={starknetProviders}
            connectors={starknetConnectors}
            autoConnect
          >
            <App />
          </StarknetConfig>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
  ```

    </TabItem>

    <TabItem value="wagmi.ts" label="wagmi.ts">

        ```tsx
        import { createConfig, http } from 'wagmi';
        import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'wagmi/chains';
        import { injected, metaMask, safe } from 'wagmi/connectors';

        export const wagmiConfig = createConfig({
          chains: [mainnet, arbitrum, sepolia, arbitrumSepolia],
          connectors: [injected(), metaMask(), safe()],
          transports: {
            [mainnet.id]: http(),
            [arbitrum.id]: http(),
            [sepolia.id]: http(),
            [arbitrumSepolia.id]: http(),
          },
        });
        ```

      </TabItem>
       <TabItem value="starknetConfig.ts" label="starknetConfig.ts">

        ```tsx
        import { publicProvider } from "@starknet-react/core";
        import { sepolia, mainnet } from "@starknet-react/chains";
        import { argent } from "@starknet-react/core";
        import { braavos } from "@starknet-react/core";
        import { InjectedConnector } from "starknetkit/injected";
 
        export const connectors = [
          new InjectedConnector({ options: { id: "argentX" } }),
          new InjectedConnector({ options: { id: "braavos" } }),
          new InjectedConnector({ options: { id: "keplr" } }),
        ];

        export const starknetChains = [mainnet, sepolia];
        export const starknetProviders = publicProvider();
        ```
      </TabItem>

  </Tabs>

---

## 3. Create a swap component

This is the lifecycle of a swap:

- Get a quote (supports 'exact out' as well).
- Pick the best quote from the available options.
- Initiate the transaction to complete the swap.

  <Tabs>
    <TabItem value="swap.tsx" label="Swap.tsx" default>
      ```tsx
      import { SupportedAssets } from '@gardenfi/orderbook';
      import { useGarden } from '@gardenfi/react-hooks';
      import BigNumber from 'bignumber.js';
      import { useState } from 'react';

      export const Swap = () => {
        const [quote, setQuote] = useState<{
          strategyId: string;
          quoteAmount: string;
        }>();

        const { swapAndInitiate, getQuote } = useGarden();

        // Define the assets involved in the swap
        const inputAsset = SupportedAssets.testnet.arbitrum_sepolia_WBTC;
        const outputAsset = SupportedAssets.testnet.bitcoin_testnet_BTC;

        // Amount to be swapped, converted to the smallest unit of the input asset
        const amount = new BigNumber(0.01).multipliedBy(10 ** inputAsset.decimals);

        // User's Bitcoin address to receive funds
        const btcAddress = 'tb1q25q3632323232323232323232323232323232';

        const handleGetQuote = async () => {
          if (!getQuote) return;

          // Fetch a quote for the swap
          const quote = await getQuote({
            fromAsset: inputAsset,
            toAsset: outputAsset,
            amount: amount.toNumber(),
            isExactOut: false,
          });
          if (!quote.ok) {
            return alert(quote.error);
          }

          // Select a quote and save it
          const [_strategyId, quoteAmount] = Object.entries(quote.val.quotes)[0];
          setQuote({
            strategyId: _strategyId,
            quoteAmount: quoteAmount,
          });
        };

        const handleSwap = async () => {
          if (!swapAndInitiate || !quote) return;

          // Initiate the swap with the selected quote and user's details
          const order = await swapAndInitiate({
            fromAsset: inputAsset,
            toAsset: outputAsset,
            sendAmount: amount.toString(),
            receiveAmount: quote.quoteAmount,
            additionalData: {
            btcAddress,
            strategyId: quote.strategyId,
            },
          });
          if (!order.ok) {
            return alert(order.error);
          }

          console.log('✅ order created: ', order.val);
        };

        return (
          <div>
            <button onClick={handleGetQuote}>Get Quote</button>{/* Fetch swap quote */}
            <button onClick={handleSwap}>Swap</button> {/* Initiate the swap */}
          </div>
        );
      }
      ```

    </TabItem>

  </Tabs>

:::note
**Important:** The user must stay on the app during the process. If they navigate away, the transaction will pause and only resume when they return.

This is because the `GardenProvider` actively polls the transaction status and uses our Gasless API to submit the transaction on-chain to complete the swap. For API integrations, you can customize how you interact with the required API endpoints to manage transaction polling and submission.
:::
