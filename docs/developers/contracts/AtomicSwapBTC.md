---
id: atomic-swap-btc
---

# Atomic swap (BTC)

:::note
The article assumes that the reader has knowledge of taproot in bitcoin and does not cover the construction of transactions.
:::

## Introduction

Unlike Ethereum, Bitcoin does not have the concept of contracts. Instead, it has scripts.
In the following sections, let's explore on how we can implement the functions like `initiate`, `redeem`, `refund` and `instant refund`.

## HTLC script

Instead of first looking at the OP codes / Script, let's build following functions for better understanding of HTLCs in the bitcoin

Functions:

- Initiate
- Redeem
- Refund
- InstantRefund

These functions looks similar to what we have on [EVM contracts](../contracts/HTLCEVM.md).

Let's use the following struct for passing swap info

```jsx
type HTLC struct {
    // X-only pubkey of the initiator
    InitiatorPubkey []byte
    // X-only pubkey of the redeemer
    RedeemerPubkey []byte
    SecretHash     []byte
    // expiry in blocks
    Timelock uint32
}
```

### Initiate

Initiating an atomic swap on Bitcoin involves creating a transaction that locks funds in an HTLC script. Here's what happens during initiation:

1. The initiator creates a Bitcoin transaction that:

   - Spends from their wallet (input)
   - Creates an output that pays to the HTLC script address
   - The script address is derived from the HTLC parameters (pubkeys, secret hash, and timelock)

2. The HTLC script ensures that the locked funds can only be spent if either:
   - The redeemer provides the correct secret and their signature (redeem path)
   - The initiator claims back after timelock expiry (refund path)
   - Both parties agree to cancel (instant refund path)

The amount locked in the script becomes the swap amount. The transaction must be confirmed on the Bitcoin blockchain before the counterparty proceeds with their side of the swap.

### Redeem

Redeeming an atomic swap means claiming the locked funds by providing the secret that matches the hash used during initiation.

The redeem process involves:

1. Creating a transaction that spends from the HTLC script address
2. Providing the secret that matches the hash
3. Signing the transaction with the redeemer's private key

Let's understand this through a high-level function similar to an EVM contract:

```go
func Redeem(htlc *HTLC, secret []byte, signature []byte) {
    if sha256(secret) != htlc.SecretHash || recover(sig) != htlc.RedeemerPubkey {
        panic("script verification failed")
    }
    withdraw()
}
```

This function performs two critical checks:

1. Secret validation: Ensures the provided secret hashes to the expected value
2. Signature verification: Confirms the redeemer is authorized to claim

When translated to Bitcoin Script, we need to consider its stack-based nature. Here's how the script works:

```jsx
OP_SHA256;
OP_DATA_32;
{
  secretHash;
}
OP_EQUALVERIFY;
OP_DATA_32;
{
  redeemerPubkey;
}
OP_CHECKSIG;
```

Stack visualization:

```
Initial State:          After OP_SHA256:       After Push secretHash:
+----------------+      +----------------+      +----------------+
|     secret     |      | hashed_secret  |      |   secretHash   | ← Known hash from HTLC
+----------------+      +----------------+      +----------------+
|   signature    |      |   signature    |      | hashed_secret  | ← Computed hash from provided secret
+----------------+      +----------------+      +----------------+
                                                |   signature    |
                                                +----------------+

After EQUALVERIFY:     After Push pubkey:     After CHECKSIG:
+----------------+      +----------------+      +----------------+
|   signature    |      | redeemerPubkey |      |     true      | ← Script succeeds only if true
+----------------+      +----------------+      +----------------+
                        |   signature    |
                        +----------------+
```
Important notes:

- The stack grows and shrinks from the top (top element is consumed first)
- `OP_SHA256` consumes the secret and produces its hash (proves knowledge of preimage)
- `OP_EQUALVERIFY` is critical - it fails immediately if the hashes don't match
- Signature verification happens only if the secret was valid

If all conditions are met, the script returns true and the funds can be sent to the redeemer's address.

### Refund

The refund mechanism is a critical safety feature in atomic swaps that prevents funds from being locked forever if the swap fails to complete.

Key concepts in refunding:

1. Timelock: A waiting period measured in blocks
2. Relative time: Measured from when the swap was initiated
3. Initiator authentication: Only the original sender can refund

The refund process involves:

1. Waiting for the timelock to expire
2. Creating a transaction that spends from the HTLC script
3. Providing proof of being the initiator (signature)

Let's look at the high-level function:

```go
func Refund(htlc *HTLC, currentBlockHeight uint32, initiatedBlockHeight uint32, signature []byte) {
    if currentBlockHeight - initiateBlockHeight > htlc.Timelock {
        panic("not expired")
    }
    if recover(signature) != htlc.InitiatorPubkey {
        panic("invalid signature")
    }
    withdraw()
}
```

This translates to the following Bitcoin Script:

```jsx
OP_10;
OP_CHECKSEQUENCEVERIFY;
OP_DROP;
OP_DATA_32;
{
  initiatorPubkey;
}
OP_CHECKSIG;
```

Stack visualization:

```
Initial State:          After OP_10:           After CSV:
+----------------+      +----------------+      +----------------+
|   signature    |      |      10        |      |      10        |
+----------------+      +----------------+      +----------------+
                        |   signature    |      |   signature    |
                        +----------------+      +----------------+

After OP_DROP:         After Push pubkey:     After CHECKSIG:
+----------------+      +----------------+      +----------------+
|   signature    |      | initiatorPubkey|      |     true      |
+----------------+      +----------------+      +----------------+
                        |   signature    |
                        +----------------+
```

Important notes:

- `OP_CHECKSEQUENCEVERIFY` verifies that enough time has passed (relative to when UTXO was created)
- CSV fails and prevents spending if the timelock hasn't expired
- CSV doesn't consume the timelock value, so `OP_DROP` is needed to remove it
- The final signature check ensures only the original initiator can refund

This provides a secure way to recover funds if:

- The counterparty never participates
- Network issues prevent completion
- The counterparty abandons the swap

### InstantRefund

Instant refund is a cooperative cancellation mechanism that allows both parties to mutually agree to terminate the swap early, without waiting for the timelock to expire.

Key concepts in instant refund:

1. Multi-signature: Requires both parties to agree
2. No timelock: Can be executed at any time
3. Mutual authentication: Both parties must provide valid signatures

The instant refund process involves:

1. Creating a transaction that spends from the HTLC script address
2. Both parties signing the transaction
3. Providing both signatures in the correct order

Let's understand this through a high-level function similar to an EVM contract:

```go
func InstantRefund(htlc *HTLC, initiatorSignature []byte, redeemerSignature []byte) {
    if recover(initiatorSignature) != htlc.InitiatorPubkey {
        panic("invalid initiator signature")
    }
    if recover(redeemerSignature) != htlc.RedeemerPubkey {
        panic("invalid redeemer signature")
    }
    withdraw()
}
```

This function performs two critical checks:

1. Initiator signature validation: Ensures the initiator has agreed to cancel
2. Redeemer signature validation: Ensures the redeemer has agreed to cancel

When translated to Bitcoin Script, we need to consider its stack-based nature. Here's how the script works:

```jsx
OP_DATA_32;
{
  initiatorPubkey;
}
OP_CHECKSIG;
OP_DATA_32;
{
  redeemerPubkey;
}
OP_CHECKSIGADD;
OP_2;
OP_NUMEQUAL;
```

Stack visualization:

```txt
Initial State:              After Push initiatorPubkey:   After First CHECKSIG:
+----------------------+    +----------------------+    +----------------------+
| initiatorSignature   |    | initiatorPubkey      |    | 1 or 0              |
+----------------------+    +----------------------+    +----------------------+
| redeemerSignature    |    | initiatorSignature   |    | redeemerSignature    |
+----------------------+    +----------------------+    +----------------------+
                            | redeemerSignature    |
                            +----------------------+

After Push redeemerPubkey:    After CHECKSIGADD:         After Push 2:
+----------------------+    +----------------------+    +----------------------+
| redeemerPubkey      |    | 1+1 or 1+0 or 0+0    |    | 2                    |
+----------------------+    +----------------------+    +----------------------+
| 1 or 0              |                                | 1+1 or 1+0 or 0+0    |
+----------------------+                                +----------------------+
| redeemerSignature    |
+----------------------+

After NUMEQUAL:
+----------------------+
| true/false          |
+----------------------+
```

Important notes about `OP_CHECKSIGADD`:

- It consumes three stack elements:
  - A public key (redeemerPubkey)
  - A numeric value to add to (result of first CHECKSIG)
  - A signature to verify (redeemerSignature)
- It performs these operations:
  - Verifies if the signature is valid for the pubkey
  - Adds 1 (if valid) or 0 (if invalid) to the numeric value
  - Pushes the sum back onto the stack
- The final state:
  - Sum = 2: Both signatures valid (1+1)
  - Sum = 1: Only one signature valid (1+0 or 0+1)
  - Sum = 0: Neither signature valid (0+0)
- `OP_NUMEQUAL` with 2 ensures both signatures must be valid

This approach efficiently implements a 2-of-2 multisignature requirement using Tapscript's enhanced capabilities.
The direction of stack operations is critical to understand: the top item in each visualization is the top of the stack (the item that will be consumed first by the next operation).

The script ensures:

1. Both signatures are valid
2. The signatures match their respective public keys
3. Both parties have agreed to the cancellation

This provides a cooperative way to cancel the swap if:

- Both parties mutually agree to abort
- A better trade opportunity arises
- Market conditions change before completion

## Conclusion: Understanding Bitcoin HTLCs

Hash Time-Locked Contracts (HTLCs) provide a powerful mechanism for atomic swaps on Bitcoin by combining three essential spending paths:

- Redeem Path: Allows the counterparty to claim funds by revealing the secret and providing a valid signature. This is the typical happy path in a successful swap.
- Refund Path: Protects the initiator by enabling them to recover funds after a timelock expires. This prevents permanent fund loss if the swap doesn't complete.
- InstantRefund Path: Offers flexibility by allowing cooperative cancellation when both parties agree, without waiting for the timelock.

When implementing HTLCs with Taproot, these scripts benefit from:

- **Enhanced Privacy:** Only the executed path is revealed on-chain
- **Lower Fees:** Smaller script size and potential for key-path spending
- **Improved Security:** Using Schnorr signatures and x-only pubkeys
