---
id: snapshot
---
# Snapshot

Garden uses [Snapshot](https://snapshot.box/#/s:gardenfinance.eth), a gasless and user-friendly off-chain voting mechanism, to empower the community to participate in protocol governance. Here are some high-level details of the voting mechanism.

* **Vote type:** Basic (single-choice voting).
* **Quorum required:** 6,000 votes.
* **Vote period:** 7 days.
* **Garden ENS name:** `gardenfinance.eth` (Snapshot spaces are tied to ENS names)

## **Roles on snapshot**

Garden’s Snapshot system features two key roles:

1. **Super admin:**
   * Manages and oversees the Snapshot space.
   * Maintains the integrity of the governance process.
2. **Author:**
   * Can create and submit proposals for voting.
   * Any staker with more than 500 votes is eligible to become an author.

## Voting power

Voting power in Garden is determined by staking [multipliers](../fundamentals/introduction/Stakers.md) and ownership of the Gardener Pass NFT. Stakers gain increased voting power based on their staking multiplier, which rewards long-term commitment to the protocol. Additionally, Gardener Pass NFT holders receive a fixed voting power of 70 votes.
