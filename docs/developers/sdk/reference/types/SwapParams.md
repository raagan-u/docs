---
id: swap-params
title: SwapParams
---

# SwapParams

The `SwapParams` type represents the parameters required for initiating a swap.

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

**AdditionalData**

| Property               | Type                                   | Description                                              |
| ---------------------- | -------------------------------------- | -------------------------------------------------------- |
| strategyId             | string                                 | Get strategy id from the quote                    |
| btcAddress           | string                                 |  Provide btcAddress if the destination or source chain is bitcoin. This address is used as refund address if source chain is bitcoin, and as redeem address if destination chain is bitcoin. |