---
id: cross-chain-coincidence-of-wants-xcow
---

# Cross-chain Coincidence of Wants (xCoW)

Garden’s xCoW mechanism builds upon the concept of Coincidence of Wants (CoW), pioneered by CoW Swap for single-chain environments and extended into the cross-chain space, similar to Across Protocol. What sets Garden apart is its ability to integrate Proof-of-Work (PoW) chains like Bitcoin, overcoming the challenges of building trustless interoperability on these networks. By enabling seamless matching of complementary intents, Garden reduces reliance on external liquidity, optimizes pricing, and enhances transaction efficiency across multiple chains.

## Types of xCoW scenarios

### Simple user-to-user matching

<figure><img src="/assets/xcow-simple.png" alt=""/><figcaption></figcaption></figure>

xCoW matches users with complementary intents directly. For example, if one user wants to swap Bitcoin (BTC) for USDC and another wants to swap USDC for BTC, xCoW connects them peer-to-peer, eliminating intermediaries and improving pricing and execution speed.

### Trader rings (more than 2 participants)

<figure><img src="/assets/xcow-multi.png" alt=""/><figcaption></figcaption></figure>

For intents involving three or more participants, xCoW creates trading rings. These interconnected settlements optimize liquidity usage and reduce costs, enabling trades that might otherwise rely on fragmented liquidity pools to be executed efficiently across multiple users and chains.

### Intermediary CoW events

<figure><img src="/assets/xcow-intermediate.png" alt=""/><figcaption></figcaption></figure>

When trades require intermediate assets, xCoW matches overlapping intents to improve execution. For example:

* A user swaps Bitcoin (BTC) for Shiba Inu (SHIB).
* Another swaps Bonk (BONK) for Bitcoin (BTC).

Both trades pass through USDC as an intermediary:

* BTC → **USDC** → SHIB
* BONK → **USDC** → BTC

Here, xCoW matches the BTC ↔ USDC portion directly between users, minimizing slippage and improving pricing for both trades.

### Batching

<figure><img src="/assets/xcow-batching.png" alt=""/><figcaption></figcaption></figure>

xCoW supports batching in order to reduce gas costs. Multiple transactions are grouped and submitted on-chain as a single operation, lowering the gas cost per transaction. This mechanism ensures cost efficiency at scale, particularly for high-volume trade scenarios.