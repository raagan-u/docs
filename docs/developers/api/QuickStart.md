---
id: quickstart
---

# Quickstart

This page is intended to show developers integrating Garden API, which endpoints to use in the different stages of an order. For best understanding, read [intent flow](../../home/fundamentals/how-it-works/IntentFlow.md) and [order lifecycle](../core/OrderLifecycle.md) while you play with the endpoints.

At a high level, the order lifecycle begins with authentication, proceeds through order creation and initiation, and concludes with redemption and settlement. Below, we describe the APIs and how they map to each stage.

## Fetch quote

Use this endpoint to fetch pricing for a given `OrderPair` and amount. The response will return an array of objects, where each object contains a `strategy_id` as the key and the corresponding amount as the value. The amount will be in the smallest decimal unit of the source asset or destination asset, depending on the `exact_out` flag. Select a strategy from the response and save the `strategy_id`, as it must be passed in the next steps.Additionally, Affiliates can use `affiliate_fee` to charge a fee for every asset swap made through their integration.

```bash
curl -X 'GET' \
 'https://testnet.api.garden.finance/quote/?order_pair=<order_pair>&amount=<amount>&exact_out=<true/false>&affiliate_fee=<affiliate_fee_in_bps>' \
  -H 'accept: application/json'
```

**Parameters:**

- `order_pair`: String representation of [OrderPair](../sdk/Enumerations.md#orderpair).
- `amount`: The amount should be in the smallest unit of the source asset or destination asset depending on the `exact_out` flag.
- `exact_out`: Indicates whether the quote should be fetched for an exact output amount. If set to `true`, the quote will calculate the required input amount to achieve the specified output. If set to `false`, the quote will calculate the expected output for a given input amount.
- `affiliate_fee`: Optional. The total affiliate fee in basis points (bps) that will be distributed across one or more assets. This value should equal the total of all per-asset affiliate fees provided in the next step.

## Authentication

Authentication is required before you can interact with the Garden protocol. The simplest and most reliable way is by using an API key, especially for systems that handle authentication internally or need persistent access without requiring users to sign messages. You can get one by contacting the Garden team. Once issued, include it in the Authorization header as a Bearer token for all authenticated requests.

Alternatively, you can obtain a **JWT** token for authentication. It uses SIWE (Sign-In with Ethereum) for wallet verification. Refer to [Authentication guide](../sdk/Authentication.md) for more details.


## Create order

To create an order, you need to send a request with the required fields in the body. Once successful, it will return an `order_id` which will be used in the next step to either initiate the order or fetch its details. 


```bash
curl -X 'POST' \
  'https://testnet.api.garden.finance/relayer/create-order' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <authorization_token>' \
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
      },
      ...
    ],
    "additional_data": {
      "strategy_id": "<strategy_id>",
      "bitcoin_optional_recipient": "<user_bitcoin_address>",
    }'
  }'
```
The order is considered successfully created and matched if you receive a valid order object response from the [`getOrder`](#get-order) endpoint.

For **non-Bitcoin** swaps, provide both `initiator_source_address` and `initiator_destination_address`. If the swap involves **Bitcoin**, only provide the address for the non-Bitcoin chain.
 - If Bitcoin is the source chain, set **initiator_source_address** to **null**.
 - If Bitcoin is the destination chain, set **initiator_destination_address** to **null**.

## Initiate order

For **Bitcoin** initiation, the user must send the exact amount of funds to the `order.source_swap.swap_id` address.

For **EVM-based** initiation, you can either directly interact with the contract to transfer the funds or use Garden's relay service to facilitate the transaction. See the [Contracts guide](../contracts/HTLCEVM.md) for details on initiating via contract calls.

To initiate the order using the relay service, the user must sign a message following the EIP-712 standard. The message must include the following details:

- `redeemer`: `order.source_swap.redeemer` – The address of the party who will redeem.
- `timelock`: `order.create_order.timelock`
- `amount`: `order.source_swap.amount` – The amount to be swapped.
- `secretHash`: `order.create_order.secret_hash` (without `0x` prefix) – The hash of the secret used in the swap.

```bash
curl -X 'POST' \
  'https://testnet.api.garden.finance/relayer/initiate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <authorization_token>' \
  -d '{
  "order_id": "<order_id>",
  "signature": "<signature>",
  "perform_on": "Source"
}'
```

## Order redemption

Order redemptions are automatic. Poll the order details at regular intervals using the [get order](#get-order) endpoint to check status of your order.

## Get order

To check if your swap has been successfully completed, retrieve the order details using the `order_id`.
If you see a transaction hash in `order.destination_swap.redeem_tx_hash`, it means the swap has been successfully redeemed on your behalf, and the funds should have arrived in your destination wallet. You can now check your destination wallet to confirm the received funds.

```bash
curl -X 'GET' \
  'https://testnet.api.garden.finance/orders/id/<order_id>/matched' \
  -H 'accept: application/json'
```