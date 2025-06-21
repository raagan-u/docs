---
id: authentication
title: authentication
---

# Authentication
Garden supports two authentication methods. First one is API key authentication and other is SIWE authentication. 

API key based authentication don't require users to sign messages repeatedly.You can get one by contacting the Garden team. Once issued, include it in the Authorization header as a Bearer token for all authenticated requests.

For session-based, user-specific flows, Garden uses Sign-In with Ethereum ([SIWE](https://eips.ethereum.org/EIPS/eip-4361)) to verify wallet ownership and issue a JWT token.

### Fetch nonce

Use this endpoint to fetch a unique, single-use nonce that will be signed by the user:

```bash
curl -X 'GET' \
  'https://testnet.api.garden.finance/auth/siwe/challenges' \
  -H 'accept: application/json'
```

### Verify nonce

The retrieved nonce should be included in a message formatted according to EIP-4361. The user signs the nonce with their EVM wallet, generating a structured SIWE message. The signed message ensures that the nonce is unique and prevents replay attacks also ensures that user's private key remains secure.

SIWE message format:
```bash
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
```bash
localhost:4361 wants you to sign in with your Ethereum account:
0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
Garden.fi
URI: http://localhost:4361
Version: 1
Chain ID: 11155111
Nonce: a34f6521d29cb6f0febbef3c0799f1b8213f85162fa206a535e5e11424c87b43
Issued At: 2025-04-09T07:29:20.203Z
```
Send the signed message to verify the nonce and upon successful verification, you'll receive a JWT token in the response.

```bash
curl -X 'POST' \
  'https://testnet.api.garden.finance/auth/siwe/tokens' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "<constructed_message>",
    "signature": "<user_signature>",
    "nonce": "<nonce>"
  }'
```
Use this token for all authenticated requests like order creation, initiation, or redemption.