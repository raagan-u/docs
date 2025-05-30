---
id: contracts
---

# Contracts

import DocCardList from '@theme/DocCardList';

<DocCardList
items={[
{
type: "link",
href: "./htlc-evm",
label: "Atomic swap (EVM)",
description: "The Hashed timelock contract (HTLC) is a core component of atomic swaps, enabling secure cross-chain transactions. It allows an **initiator** to lock tokens in a contract that can only be claimed by a designated **redeemer** who possesses a cryptographic secret. If the redeemer does not claim the tokens within the specified timeframe, the initiator can reclaim them, ensuring no funds are lost.",
docId: "developers/contracts/htlc-evm",
},
{
type: "link",
href: "./atomic-swap-btc",
label: "Atomic swap (BTC)",
description: "Unlike Ethereum, Bitcoin does not have the concept of contracts. Instead, it has scripts. In the following sections, let's explore on how we can implement the functions like `initiate`, `redeem`, `refund` and `instant refund`.",
docId: "developers/contracts/atomic-swap-btc",
}
]}
/>
