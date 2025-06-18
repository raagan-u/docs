---
id: affiliate-fee
---

# Affiliate Fees

Garden allows partners to charge an affiliate fee for each swap initiated through their SDK or API integration. This fee must be specified when requesting a quote and is charged in addition to protocol and solver fees.

Fees are expressed in basis points (bps), where 1 bps = 0.01%. For example, a 30 bps fee equals 0.3% of the source asset value.

Affiliates can earn rewards in USDC or cbBTC on [supported chains](./SupportedChains.mdx). Fees can be sent entirely to a single address in one asset, or split across multiple addresses and assets. 
For example, a 30 bps fee could be split by sending 10 bps in USDC to an Ethereum address, and 20 bps in cbBTC to a Base address.

The amount of each asset the affiliate will receive is calculated based on prices at the time of the quote and is also stored in the order data. All affiliate fees collected during the week are distributed to the specified addresses at the end of the week.

## Implementation using API

To apply an affiliate fee via API, include the `affiliate_fee` parameter when requesting a quote:
```shell
curl -X 'GET' \
  'https://testnet.api.garden.finance/quote/?order_pair=<order_pair>&amount=<amount>&exact_out=<true/false>&affiliate_fee=30' \
  -H 'accept: application/json'
```
In this example, we’ve added a 30 bps affiliate fee.

To define how and where fees are paid out, include the `affiliate_fees` field when **attesting a quote**. An attested quote confirms the swap price and must be followed by order creation within a fixed time window.

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
        "address": "<affiliate_address_1>",
        "chain": "<chain_1>",
        "asset": "<asset_1>",
        "fee": <affiliate_fee_1>
      },
      {
        "address": "<affiliate_address_2>",
        "chain": "<chain_2>",
        "asset": "<asset_2>",
        "fee": <affiliate_fee_2>
      }
    ],
    "additional_data": {
      "strategy_id": "<strategy_id>",
      "bitcoin_optional_recipient": "<user_bitcoin_address>"
    }
  }'
```
Refer to the [Supported assets](./SupportedChains.mdx) to find the asset addresses of USDC and cbBTC. Check out the full implementation using API [here](./api/QuickStart.md).

## Implementation using SDK

You can also integrate affiliate fees via the Garden SDK for both **Node.js** and **React** environments. The process involves two steps:  
- Requesting a quote with the affiliate fee applied.  
- Attesting the quote and submitting the order.

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
      affiliateFee: 10, // in bps
    },
);
```
While creating the order using the `swap` function, you can include the `affiliateFee` property to specify the recipient addresses, the fee amounts (in bps), and optionally the assets and chains you want the payout to be in. Garden supports payout in USDC and cbBTC.

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
        address: "<affiliate_address_1>",
        chain: "<chain_1>",
        asset: "<asset_1>",
        fee: 10
    },
    //... Add more splits as needed
  ]
};

const swapResult = await garden.swap(swapParams);
```
Check out full SDK implementation using Node.js [here](./sdk/nodejs/Quickstart.md).


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
      affiliateFee: 10 // in bps
    },
});
```
While creating and initiating the order using `swapAndInitiate` function, you can include an `affiliateFee` array which lets you specify define the recipient addresses, fee amounts, and optionally the assets and chains you want the payout to be in. Garden supports payout in USDC and cbBTC.

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
        address: "<affiliate_address_1>",
        chain: "<chain_1>",
        asset: "<asset_1>",
        fee: 10
      },
      //... Add more splits as needed
    ]
});
```
Check out full SDK implementation using React [here](./sdk/react/Quickstart.md).


