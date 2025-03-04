---
id: solvers
---
# Solvers

Solvers are the market makers of Garden protocol, responsible for ensuring user [intents](Intents.md) are executed efficiently and securely. By leveraging diverse liquidity sources—on-chain, off-chain, and private order flows—solvers are incentivized to optimize every transaction for users, delivering competetive quotes.

Solvers address key challenges in decentralized systems. They enhance liquidity access by enabling the protocol to utilize existing DeFi liquidity rather than fragmenting it with native pools. For users, solvers offer [benefits](./Intents.md#why-do-we-choose-intents) such as better pricing, MEV resistance, and higher chances of transaction finality, making the system more efficient and user-friendly.

## How do solvers work?

1. Solvers receive user intents via the [order book](Auctions.md), detailing the desired outcomes such as assets, chains, and amounts.
2. Solvers evaluate available liquidity sources and identify the most efficient path to execute the intent.
3. Each solver provides their best quote back to the order book, which selects the most competitive option for optimal user pricing.
4. Once chosen, solvers fulfill the user’s intent by leveraging their tools and liquidity.

Currently, Garden doesn’t impose any protocol fee for users or solvers.

## How to become a solver?

To become a solver, here's what you need:

* Solvers must stake **210,000 SEED** as collateral. This stake aligns solvers with the network’s goals and acts as a safeguard against dishonesty or inefficiency.
* Solvers should have the ability to run arbitrage bots, manage liquidity, and maintain 24/7 operational uptime to meet the demands of intent execution.
* Adequate liquidity and tools for rebalancing assets are essential to efficiently execute intents.

Please reach out to us in the [townhall](https://discord.com/invite/Fp4ZmZZrFu) for help with onboarding.
