---
id: swap-params
title: SwapParams
---

# SwapParams

The `SwapParams` type represents the parameters required for initiating a swap.

```ts
type SwapParams = {
  fromAsset: Asset;
  toAsset: Asset;
  sendAmount: string;
  receiveAmount: string;
  timelock?: number;
  minDestinationConfirmations?: number;
  nonce?: number;
  additionalData: {
    strategyId: string;
    btcAddress?: string;
  };
  affiliateFee?: AffiliateFeeOptionalChainAsset[];
};
```

| Property               | Type                                   | Description                                              |
| ---------------------- | -------------------------------------- | -------------------------------------------------------- |
| fromAsset             | Asset                                | Asset to be sent.                     |
| toAsset             | Asset                                 |  Asset to be received.              |
| sendAmount             | string                        |Amount in lowest denomination of the sendAsset.  |
| recieveAmount               | string                                 | Amount in lowest denomination of the toAsset.                        |
| timelock          | number | Time lock for the swap            |
| minDestinationConfirmations                  | number                                 | This will wait for the specified number of confirmations before redeeming the funds.          |
| nonce            | number                                 | Unique nonce for generating secret and secret hashes. If not provided, it will be generated as the total order count until now + 1.             |
| additionalData               | AdditionalData                                 | Additional data for the order.                  |
|affiliateFee | AffiliateFeeOptionalChainAsset[]| Integrator fee for the order|

**AdditionalData**

| Property               | Type                                   | Description                                              |
| ---------------------- | -------------------------------------- | -------------------------------------------------------- |
| strategyId             | string                                 | Get strategy id from the quote                    |
| btcAddress           | string                                 |  Provide btcAddress if the destination or source chain is bitcoin. This address is used as refund address if source chain is bitcoin, and as redeem address if destination chain is bitcoin. |

**AffiliateFeeOptionalChainAsset**

```ts
type AffiliateFee = {
    fee: number;
    address: string;
    chain: string;
    asset: string;
};

type AffiliateFeeOptionalChainAsset = Omit<AffiliateFee, 'chain' | 'asset'> & Partial<Pick<AffiliateFee, 'chain' | 'asset'>>;
```
| Property               | Type                                   | Description                                              |
| ---------------------- | -------------------------------------- | -------------------------------------------------------- |
| fee            | number                                | The affiliate fee amount in basis points (bps).  |
| address            | string                                 |  Recipient address where the affiliate fee will be sent.         |
| chain             | string                        | The blockchain network on which the fee payout should occur (e.g., ethereum, base).  |
| asset               | string                                 | The asset (HTLC contract address) in which the fee should be paid to affiliate. |