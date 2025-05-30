---
id: order
title: Order
---

## MatchedOrder

The `MatchedOrder` type represents a successfully matched order in the system. It contains the following properties:

| Property         | Type                        | Description                                             |
| ---------------- | --------------------------- | ------------------------------------------------------- |
| created_at       | string                      | Timestamp when the order was created                    |
| updated_at       | string                      | Timestamp when the order was last updated               |
| deleted_at       | string \| null              | Timestamp when the order was deleted, or null if active |
| source_swap      | [Swap](#swap)               | The source swap details                                 |
| destination_swap | [Swap](#swap)               | The destination swap details                            |
| create_order     | [CreateOrder](#CreateOrder) | The order creation details                              |

## Swap

The Swap type represents the details of a swap transaction on a specific blockchain involved in an atomic swap. Each order in the system has two swaps associated with it:

- Source Swap: Represents the transaction on the initiator's source chain.
- Destination Swap: Represents the transaction on the follower's destination chain.

| Property               | Type                                   | Description                                              |
| ---------------------- | -------------------------------------- | -------------------------------------------------------- |
| created_at             | string                                 | Timestamp when the swap was created                      |
| updated_at             | string                                 | Timestamp when the swap was last updated                 |
| deleted_at             | string \| null                         | Timestamp when the swap was deleted, or null if active   |
| swap_id                | string                                 | Unique identifier for the swap                           |
| chain                  | [Chain](../Enumerations.md#type-chain) | The blockchain network where the swap occurs             |
| asset                  | string                                 | The asset being swapped                                  |
| initiator              | string                                 | Address of the party initiating the swap                 |
| redeemer               | string                                 | Address of the party redeeming the swap                  |
| timelock               | number                                 | Time lock period for the swap                            |
| filled_amount          | string                                 | Amount that has been filled in the swap                  |
| amount                 | string                                 | Total amount of the swap                                 |
| secret_hash            | string                                 | Hash of the secret used in the atomic swap               |
| secret                 | string                                 | Secret value used in the atomic swap                     |
| initiate_tx_hash       | string                                 | Transaction hash of the swap initiation                  |
| redeem_tx_hash         | string                                 | Transaction hash of the swap redemption                  |
| refund_tx_hash         | string                                 | Transaction hash of the swap refund                      |
| initiate_block_number  | string \| null                         | Block number of the initiation, or null if not initiated |
| redeem_block_number    | string \| null                         | Block number of the redemption, or null if not redeemed  |
| refund_block_number    | string \| null                         | Block number of the refund, or null if not refunded      |
| required_confirmations | number                                 | Number of confirmations required for the swap            |

## CreateOrder

The `CreateOrder` type represents the details of an order creation request. It contains the following properties:

| Property                                                        | Type                              | Description                                                            |
| --------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| (All properties from [CreateOrderRequest](#createorderrequest)) | -                                 | As described in the [CreateOrderRequest](#createorderrequest) section. |
| created_at                                                      | string                            | Timestamp when the order was created                                   |
| updated_at                                                      | string                            | Timestamp when the order was last updated                              |
| deleted_at                                                      | string \| null                    | Timestamp when the order was deleted, or null if active                |
| create_id                                                       | string                            | Unique identifier for the order creation                               |
| block_number                                                    | string                            | Block number where the order was created                               |
| additional_data                                                 | [AdditionalData](#additionaldata) | Additional data for the order.                                         |

## CreateOrderRequest

The `CreateOrderRequest` type represents the details of an order creation request. It contains the following properties:

| Property                      | Type                                   | Description                                                                                      |
| ----------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| source_chain                  | [Chain](../Enumerations.md#type-chain) | The blockchain network for the source asset                                                      |
| destination_chain             | [Chain](../Enumerations.md#type-chain) | The blockchain network for the destination asset                                                 |
| source_asset                  | string                                 | The asset being sent                                                                             |
| destination_asset             | string                                 | The asset being received                                                                         |
| initiator_source_address      | string                                 | The address of the initiator on the source chain, or the public key if the chain is Bitcoin      |
| initiator_destination_address | string                                 | The address of the initiator on the destination chain, or the public key if the chain is Bitcoin |
| source_amount                 | string                                 | Amount of source asset (as BigDecimal string)                                                    |
| destination_amount            | string                                 | Amount of destination asset (as BigDecimal string)                                               |
| fee                           | string                                 | Fee amount (as BigDecimal string)                                                                |
| nonce                         | string                                 | Nonce value (as BigDecimal string)                                                               |
| min_destination_confirmations | number                                 | Minimum required confirmations on destination chain                                              |
| timelock                      | number                                 | Time lock period for the order                                                                   |
| secret_hash                   | string                                 | Hash of the secret used in the atomic swap                                                       |

- `Asset` should be the contract address of the token that needs to be swapped, and `'primary'` in the case of Bitcoin-related transactions.

## AdditionalData

The `AdditionalData` type represents additional data for the order. It contains the following properties:

| Property                   | Type                | Description                                                                                                                                                          |
| -------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| strategy_id                | string              | The identifier of the strategy used for the order.                                                                                                                   |
| sig                        | string              | The signature for the order object, attested by the quote server.                                                                                                    |
| input_token_price          | number              | The price of the input token at the time of order creation.                                                                                                          |
| output_token_price         | number              | The price of the output token at the time of order creation.                                                                                                         |
| deadline                   | number              | The deadline for the order to be submitted in UNIX time.                                                                                                             |
| bitcoin_optional_recipient | string \| undefined | This field must be provided if the swap involves the Bitcoin chain. It represents the address where Bitcoin funds will be transferred in case of a refund or redeem. |

## CreateOrderReqWithStrategyId

The `CreateOrderReqWithStrategyId` type represents the details of an order creation request with a strategy ID. It contains the following properties:

| Property                                                        | Type                                                         | Description                                                            |
| --------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| (All properties from [CreateOrderRequest](#createorderrequest)) | -                                                            | As described in the [CreateOrderRequest](#createorderrequest) section. |
| additional_data                                                 | `{strategy_id: string;bitcoin_optional_recipient?: string;}` | As described in the [AdditionalData](#additionaldata) section.         |

## CreateOrderRequestWithAdditionalData

The `CreateOrderRequestWithAdditionalData` type represents the details of an order creation request with additional data. It contains the following properties:

| Property                                                        | Type | Description                                                            |
| --------------------------------------------------------------- | ---- | ---------------------------------------------------------------------- |
| (All properties from [CreateOrderRequest](#createorderrequest)) | -    | As described in the [CreateOrderRequest](#createorderrequest) section. |
| (All properties from [AdditionalData](#additionaldata))         | -    | As described in the [AdditionalData](#additionaldata) section.         |
