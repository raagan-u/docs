---
id: integrate
---

# Integrate (using Garden API)

This cookbook walks you through how to integrate Garden into your wallet backend, bridge aggregator, or an infrastructure service, using our API. You’ll learn how to authenticate users, create and initiate cross-chain swaps, track and redeem them on the destination chain. If you’re unsure between using the SDK or APIs, see this comparison.
We’ll focus on a complete swap flow from Bitcoin Testnet4 (tBTC) to Arbitrum Sepolia (WBTC) and show how to coordinate with Garden APIs at each step.
If you prefer a working reference, check out our  demo at [Integrate](https://github.com/gardenfi/api-cookbook-demo).

## Authentication
Before placing or interacting with orders, your system needs to authenticate the user. Garden supports two authentication options:

### Option 1: Direct SIWE authentication
Garden uses Sign-In with Ethereum (SIWE) to verify wallet ownership for each user.

1. **Request a nonce**  
Generate a unique, single-use nonce as a challenge:

Endpoint:
```
POST /auth/siwe/challenges
```

Expected response:
```json
{
  "status": "Ok",
  "result": "a34f6521d29cb6f0febbef3c0799f1b8213f85162fa206a535e5e11424c87b43"
}
```

2. **Sign the nonce**
The user signs the nonce with their EVM wallet, generating a structured SIWE message. This is done by creating a local signer instance (e.g., using the 'PrivateKeySigner' from the Alloy crate in Rust), which uses the user's private key to cryptographically sign the message. The signed message ensures that:

- The nonce is unique and prevents replay attacks.
- The user's private key remains secure.

SIWE message format:
```
<domain> wants you to sign in with your Ethereum account:
<account_address>
Garden.fi
URI: <url>
Version: 1
Chain ID: <chain_id>
Nonce: <the unique nonce from the previous step>
Issued At: <current_time>
```

Here’s an example for testnet:
```
localhost:4361 wants you to sign in with your Ethereum account:
0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
Garden.fi
URI: http://localhost:4361
Version: 1
Chain ID: 11155111
Nonce: a34f6521d29cb6f0febbef3c0799f1b8213f85162fa206a535e5e11424c87b43
Issued At: 2025-04-09T07:29:20.203Z
```

3. **Verify the signed message**
Send the signed message to obtain a JSON web token (JWT).

Endpoint:
```
POST /auth/siwe/tokens
```

Request:
```json
{
 "message": "<message_string>",
 "signature": "<hex_encoded_signature>",
 "nonce": "<unique_nonce_message>"
}
```

Expected response:
```json
{
    "status": "Ok",
    "result": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMHhlOTg5MmE4QTNENTk4MTREYjE0OTkxOEFEOWZGNDI4MmMyRDk5MUU4IiwiZXhwIjoxNzQ0MzYyMDIwfQ.iHiPUkeaNBkoUPhDQLqYkP6-6F3NtdmqrfozpafX8oM"
}
```

### Option 2: API key authentication
API keys provide a convenient authentication method for developers who prefer handling authentication through in-house systems or need persistent access without requiring users to sign messages repeatedly.

1. Visit Garden’s SDK dashboard.
2. Authenticate using SIWE.
3. Create an application by providing:
   - Application name
   - Optional application icon
4. Generate an API key by specifying:
   - Key name
   - Expiration date

Include the API key in the request headers under the key "api-key," with the generated key as its value. This replaces the use of JWT bearer tokens for user authentication.

```
api-key: <your_api_key>
```

## Order lifecycle

This section mirrors the swap lifecycle and shows how each step maps to specific API calls.

At a simple level, when a user requests to swap assets, the process starts by retrieving a price quote for the intended order pair, which includes the source chain, source asset, destination chain, destination asset, and amount. After confirming the quote, the order is attested and validated by Garden's API, followed by final order creation via the `/relayer/create-order` endpoint.

For a detailed breakdown of the entire order lifecycle, including status transitions, check out the order lifecycle. For a deeper understanding of the Garden protocol, read the intent flow.

### 1. Get supported pairs

The first step in creating an order is to show all the options. Use the `/quote/strategies` endpoint to get all supported pairs from Garden. Each pair is marked by a unique ‘id’.

Endpoint:
```
GET /quote/strategies
```

Example response:
```
{
  "status": "Ok",
  "result": {
    "btyrasac": {
      "id": "btyrasac",
      "source_chain_address": "1db36714896afaee20c2cc817d170689870858b5204d3b5a94d217654e94b2fb",
      "dest_chain_address": "0x29f72597ca8a21F9D925AE9527ec5639bAFD5075",
      "source_chain": "bitcoin_testnet",
      "dest_chain": "arbitrum_sepolia",
      "source_asset": {
        "asset": "primary",
        "token_id": "bitcoin",
        "decimals": 8
      },
      "dest_asset": {
        "asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
        "token_id": "bitcoin",
        "decimals": 8
      },
      "makers": [],
      "min_amount": "10000",
      "max_amount": "100000",
      "min_source_timelock": 12,
      "min_source_confirmations": 1,
      "min_price": 1.0001,
      "fee": 30
    },
    ... followed by other supported pairs.
  }
}
```
Define `order pair` based on user selection in this format:
`source_chain:source_asset::destination_chain:destination_asset`

For our tBTC to WBTC (Arbitrum) example, that would be:
 ```
bitcoin_testnet:primary::arbitrum_sepolia:0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA
```

### 2. Get quote

Request solver quotes for expected output (or required input) amount using the selected `order pair` and specifying the `amount` in sats.

Endpoint:
```
GET /price?order_pair=<source_chain:source_asset::dest_chain::dest_asset>&amount=<desired_in_amount>&exact_out=boolean
```
`exact_out` allows you to choose between specifying what you want to spend or what you want to receive.

- exact_out=false: You specify input amount (e.g. send 0.01 BTC → get X WBTC)
- exact_out=true: You specify desired output (e.g. get 10 WBTC → send X BTC)

For our tBTC to WBTC (Arbitrum) example, here’s the request:

```
price?order_pair=bitcoin_testnet:primary::arbitrum_sepolia:0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA&amount=10000&exact_out=false
```

And, an example response:
```
{
  "status": "Ok",
  "result": {
    "quotes": {
      "btyrasac": "9970"
    },
    "input_token_price": 77328.3666062084,
    "output_token_price": 77328.3666062084
  }
}
```
The response provides asset prices (in USD) from market oracles and solver quotes for the specified amount. If the `exact_out` flag is set to ` false`, the quote reflects the output (receive) amount for the user.
 
### 3. Attest the quote

Choose from the given quotes and send it to the `/quote/attested` endpoint for Garden to attest the quote. Garden then responds with an attested quote, which includes a `signature` used for further order creation. This attested quote remains valid until the specified `deadline`.

Endpoint:
```
POST /quote/attested
```

Example request:

```json
{
    "source_chain": "bitcoin_testnet",
    "destination_chain": "arbitrum_sepolia",
    "source_asset": "primary",
    "destination_asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
    "initiator_source_address": "609c8b4b2026902fa15ad850de19d56ecee31ce9b61f0f69cc732da3a58b6ad6",
    "initiator_destination_address": "0x753Cf575A0224c590ACF3587031E88b238261f7a",
    "source_amount": "10000",
    "destination_amount": "9970",
    "fee": "1",
    "nonce": "1743337081630",
    "min_destination_confirmations": 3,
    "timelock": 432000,
    "secret_hash": "a4f60b6435fa60a4582b7874595b1917272e503ff9278e3011f902c0cf4cccbd",
    "additional_data": {
        "strategy_id": "btyrasac",
        "bitcoin_optional_recipient": "tb1qz0pnh98kfynptg9dtkj06f7sqnlxl3dxnmnjw4"
    }
}
```

Example response:

```json
{
  "status": "Ok",
  "result": {
    "source_chain": "bitcoin_testnet",
    "destination_chain": "arbitrum_sepolia",
    "source_asset": "primary",
    "destination_asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
    "initiator_source_address": "609c8b4b2026902fa15ad850de19d56ecee31ce9b61f0f69cc732da3a58b6ad6",
    "initiator_destination_address": "0x753Cf575A0224c590ACF3587031E88b238261f7a",
    "source_amount": "10000",
    "destination_amount": "9970",
    "fee": "1",
    "nonce": "1743337081630",
    "min_destination_confirmations": 3,
    "timelock": 432000,
    "secret_hash": "a4f60b6435fa60a4582b7874595b1917272e503ff9278e3011f902c0cf4cccbd",
    "additional_data": {
      "strategy_id": "btyrasac",
      "bitcoin_optional_recipient": "tb1qz0pnh98kfynptg9dtkj06f7sqnlxl3dxnmnjw4",
      "input_token_price": 81945.33486018311,
      "output_token_price": 81945.33486018311,
      "sig": "a35533c885c2df615003d9fbcba077a9b41c065b308d0883c6387db24f355ef43d933272cda468387bfe126930cb78d327c8cb179034e19d3a48bdf0597743211c",
      "deadline": 1744265309
    }
  }
}
```

### 4. Create order

When ready, create an order by sending a request to `/relayer/create-order` that includes the `additional data` from the attested quote, along with the previously prepared order details. This request is used to create the order in Garden's orderbook. Upon successful creation, the response will contain the result, which includes the unique `order ID`, allowing you to track and manage the order throughout the process.

Endpoint:
```
POST /relayer/create-order
```

Example request for tBTC to WBTC:

```json
{
  "source_chain": "bitcoin_testnet",
  "destination_chain": "arbitrum_sepolia",
  "source_asset": "primary",
  "destination_asset": "0x795Dcb58d1cd4789169D5F938Ea05E17ecEB68cA",
  "initiator_source_address": "609c8b4b2026902fa15ad850de19d56ecee31ce9b61f0f69cc732da3a58b6ad6",
  "initiator_destination_address": "0x753Cf575A0224c590ACF3587031E88b238261f7a",
  "source_amount": "10000",
  "destination_amount": "9970",
  "fee": "1",
  "nonce": "1743337081630",
  "min_destination_confirmations": 3,
  "timelock": 432000,
  "secret_hash": "a4f60b6435fa60a4582b7874595b1917272e503ff9278e3011f902c0cf4cccbd",
  "additional_data": {
    "strategy_id": "btyrasac",
    "bitcoin_optional_recipient": "tb1qz0pnh98kfynptg9dtkj06f7sqnlxl3dxnmnjw4",
    "input_token_price": 81945.33486018311,
    "output_token_price": 81945.33486018311,
    "sig": "a35533c885c2df615003d9fbcba077a9b41c065b308d0883c6387db24f355ef43d933272cda468387bfe126930cb78d327c8cb179034e19d3a48bdf0597743211c",
    "deadline": 1744265309
  }
}
```
Expected response:
```
{
  "result": <order-id>,
  "status":   "Ok",
}
```

### 5. Initiate order
The order initiation process begins when the user initiates the swap on the source chain. For EVM-based chains, this is done by making a request to the `/relayer/initiate` endpoint.  The process is different for the Bitcoin chain as it works through scripts.

Initiation on EVM

To initiate the transaction, the user must sign the HTLC initiation message using their wallet provider's EIP-712 typed data signing method. This signature authorizes the HTLC contract to lock tokens in escrow according to the specified parameters. The signature returned from this operation will be used for contract initialization.

HTLC initiation message format: 

```
{
    address redeemer;
    uint256 timelock;
    uint256 amount;
    bytes32 secretHash;
}
```

Endpoint:
```
POST /relayer/initiate
```

Example request:

```json
{
    "order_id" : "<order_id>",
    "signature": "<signature_hex_string>",
    "perform_on": "Source"
}
```

On success, we will be getting the transaction hash of the initiate event in the response body.

Expected response:

```json
{
  "result": "<tx_id>",
  "status": "Ok"
}
```
Initiation on Bitcoin

On Bitcoin chain, there are two ways to initiate:

1. User directly funds the HTLC script address using their Bitcoin wallet.
2. User constructs a transaction paying the required amount to the HTLC script address and broadcasts it.

The HTLC script address is the swap ID of the source chain swap, which can be found in the `source_swap` field in the response from `/orders/id/:id/matched`.

### 6. Get order data

To retrieve the order data for an order ID, make a request to:

Endpoint:
```
GET /orders/id/:id/matched
```

Expected response:
```json
{
  "status": "Ok",
  "result": {
    "created_at": "<timestamp>",
    "updated_at": "<timestamp>",
    "deleted_at": null,
    "source_swap": {
      "created_at": "<timestamp>",
      "updated_at": "<timestamp>",
      "deleted_at": null,
      "swap_id": "<swap_id_hash>", /* the htlc script address */
      "chain": "<chain_name>",
      "asset": "<asset_type>",
      "initiator": "<initiator_address>",
      "redeemer": "<redeemer_address>",
      "timelock": "<timelock_value>",
      "filled_amount": "<amount>",
      "amount": "<amount>",
      "secret_hash": "<secret_hash>",
      "secret": "",
      "initiate_tx_hash": "<transaction_hash>",
      "redeem_tx_hash": "",
      "refund_tx_hash": "<transaction_hash>",
      "initiate_block_number": "<block_number>",
      "redeem_block_number": "0",
      "refund_block_number": "<block_number>",
      "required_confirmations": "<number>",
      "current_confirmations": "<number>"
    }
  }
}
```


You can also fetch additional order data through the following endpoints:

```
- `GET /orders/id/:id/unmatched`: Get an unmatched order by ID 
- `GET /orders/id/:id/matched`: Get a matched order by ID
- `GET /orders/user/:user/unmatched`: Get all unmatched orders for a user
- `GET /orders/user/:user/matched`: Get all matched orders for a user
- `GET /orders/user/:user/count`: Get order count for a user
- `GET /orders/matched`: Get all matched orders
- `GET /orders/unmatched`: Get all unmatched orders
```

### 7. Redeem asset

The redemption step finalizes the swap by allowing the user to claim the assets on the destination chain after the order has been successfully initiated and confirmed.

Pre-requisites

- The swap must be complete on the source chain, and assets must be ready on the destination chain.
- The destination chain must show an `initiate_tx_hash` under `destination_swap`.
- The secret generated during order creation must be revealed.

Retrieving order details

To begin, poll the `/orders/id/:id/matched` endpoint to fetch the latest order status. Once the `destination_swap.initiate_tx_hash` is present, the destination HTLC has been funded and is ready for redemption.

Redemption on EVM chain
Use the `/relayer/redeem` endpoint to submit the redemption request. This includes the secret that proves the user has the right to claim the funds.

Endpoint:
```
POST relayer/redeem
```

Example request: 

```
json
{
    "order_id" : "<order_id>",
    "secret": "<secret>",
    "perform_on": "Destination"
}
```

Expected response:
```
{
  status: "Ok",
  result: <redeem_transaction_hash>
}
```

Redemption on Bitcoin
For Bitcoin-based swaps, redemption involves constructing and signing a transaction with the appropriate witness data.
Option 1: The HTLC on Bitcoin is constructed using the `destination_swap` details from `/orders/id/:id/matched`. To redeem:
Use the secret from order creation.


Generate the required witness data:


Secret value


Redeem leaf bytes


Control block bytes


Construct and sign the Bitcoin transaction.


Submit the transaction to the Bitcoin network.
Option 2: If you prefer not to handle Bitcoin fees, you can use Garden’s relayer service for gasless redemption by sending the transaction hex bytes in the specified format..
Endpoint:
```
POST /bitcoin/redeem
```

Example request:

```json
{
  "order_id": <order_id>,
  "redeem_tx_bytes": <transaction_hex_of_the_constructed_redeem_txn>
}
```
Expected response:
```
{
  status: "Ok",
  result: <redeem_transaction_hash>
}
```
