---
id: affiliate-fee
---

# Affiliate Fees

Garden allows partners to charge an affiliate fee for each swap initiated through their SDK or API integration. This fee must be specified when requesting a quote and is charged in addition to protocol and solver fees.

Fees are expressed in basis points (bps), where 1 bps = 0.01%.
For example, a 30 bps fee equals 0.3% of the source asset value.
Affiliates can receive rewards in any supported asset listed [here](./SupportedChains.mdx). Fees can be sent entirely to a single address in one asset, or split across multiple addresses and assets.
For example: a 30 bps fee could be split by sending 10 bps in USDC to an Ethereum address, and 20 bps in WBTC to a Base address.
:::note
The asset field must correspond to the Garden HTLC contract address listed for each supported asset.
:::

## Implementation using API

To apply an affiliate fee via API, include the affiliate_fee parameter when requesting a quote:
```shell
curl -X 'GET' \
  'https://testnet.api.garden.finance/quote/?order_pair=<order_pair>&amount=<amount>&exact_out=<true/false>&affiliate_fee=30' \
  -H 'accept: application/json'
```
In this example, we’ve added a 30 bps affiliate fee.
To define how and where fees are paid out, include the affiliate_fees field when **attesting a quote**. An attested quote confirms the swap price and must be followed by order creation within a fixed time window.

Here’s a sample attested quote request:

```shell
curl -X 'POST' \
  'https://testnet.api.garden.finance/quote/attested' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "source_chain": "<source_chain>",
    "destination_chain": "<destination_chain>",
    "source_asset": "<source_asset>",
    "destination_asset": "<destination_asset>",
    "initiator_source_address": "<initiator_source_address>",
    "initiator_destination_address": "<initiator_destination_address>",
    "source_amount": "<source_amount>",
    "destination_amount": "<destination_amount>",
    "fee": "<fee>",
    "nonce": "<nonce>",
    "min_destination_confirmations": "<min_destination_confirmations>",
    "timelock": "<timelock>",
    "secret_hash": "<secret_hash>",
    "affiliate_fees": [
      {
        "address": "<address_1>",
        "chain": "ethereum",
        "asset": "<usdc_htlc_address>",
        "fee": 10
      },
      {
        "address": "<address_2>",
        "chain": "base",
        "asset": "<cbbtc_htlc_address>",
        "fee": 20
      }
    ],
    "additional_data": {
      "strategy_id": "<strategy_id>",
      "bitcoin_optional_recipient": "<user_bitcoin_address>"
    }
  }'
```

## Implementation using SDK

You can also integrate affiliate fees via the Garden SDK for both **Node.js** and **React** environments. The process involves two steps:  
- Requesting a quote with the affiliate fee applied  
- Executing the swap with fee payout configuration

### Node.js

To request a quote with an affiliate fee, include the `affiliateFee` parameter in the `options` object.

```ts
const orderpair = 'ethereum_sepolia:0x29C9C37D0Fec7E64AFab0f806c8049d9e2f9B0b6::arbitrum_sepolia:0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA'
const amount = 100000
const isExactOut = false

const quoteRes = await garden.quote.getQuote(
    orderpair,
    amount,
    isExactOut,
    {
      affiliateFee: 30, // in bps (0.3%)
    },
);
```
While creating the order using `swap` function, you can include an `affiliateFee` configuration. This lets you specify where the fees should be sent, how much to send, and optionally, which supported assets to use for the payouts.

```ts
const [_strategyId, quoteAmount] = Object.entries(quoteRes.val.quotes)[0];
const swapParams: SwapParams = {
  fromAsset,
  toAsset,
  sendAmount,
  receiveAmount: quoteAmount,
  additionalData: {
    strategyId: _strategyId,
  },
  affiliateFee:[
    {
        address: "<address_1>",
        chain: "ethereum",
        asset: "<usdc_htlc_address>",
        fee: 10
    },
    //... Add more splits as needed
  ]
};

const swapResult = await garden.swap(swapParams);
```
Checkout full SDK implementation using Node.js [here](./sdk/nodejs/Quickstart.md).


### React

To include an affiliate fee in the quote, simply pass the affiliateFee option when requesting for quote using `getQuote` function.

```ts
import { SupportedAssets } from "@gardenfi/orderbook";
import { useGarden } from "@gardenfi/react-hooks";

const { swapAndInitiate, getQuote } = useGarden();

const fromAsset = SupportedAssets.testnet.ethereum_sepolia_WBTC;
const toAsset = SupportedAssets.testnet.arbitrum_sepolia_WBTC;
const amount = 100000;
const isExactOut = false; 

const quoteRes = await getQuote({
    fromAsset,
    toAsset,
    amount,
    isExactOut,
    options: {
      affiliateFee: 30 // in bps
    },
});
```
While creating and initiating the order using `swapAndInitiate` function, you can include an `affiliateFee` array which lets you specify define the recipient addresses, fee amounts, and optionally, the supported assets in which the fees should be paid.

```ts
const [_strategyId, quoteAmount] = Object.entries(quoteRes.val.quotes)[0];
const response = await swapAndInitiate({
    fromAsset,
    toAsset,
    sendAmount: amount.toString(),
    receiveAmount: quoteAmount,
    additionalData: {
        strategyId: _strategyId,
    },
    affiliateFee: [
        {
        address: "<address_1>",
        chain: "ethereum",
        asset: "<usdc_htlc_address>",
        fee: 10
      },
      //... Add more splits as needed
    ]
});
```
Checkout full SDK implementation using React [here](./sdk/react/Quickstart.md).


