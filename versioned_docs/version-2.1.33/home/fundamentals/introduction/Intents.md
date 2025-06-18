---
id: intents
---

# Intents

Intents offer a fundamentally user-centric approach to on-chain interactions. Instead of signing a raw transaction—a rigid sequence of machine-readable instructions dictating what actions to take (as seen on platforms like Uniswap or Aave)—users define an overarching objective, or "intent," and sign that instead. This intent encapsulates the desired outcome in a structured message. For Garden, this means specifying parameters such as assets, chains, and amounts for the swap.

<figure><img src="/assets/transaction-requirements.png" alt=""/><figcaption></figcaption></figure>

By abstracting away the granular steps, intents align the interaction more closely with desired goals, making the process both intuitive and efficient. This approach is increasingly adopted as a standard in the industry, with Across using intents-based bridging and CoW Protocol applying intents for DEX trading.

## Why do we choose intents?

Intents bring flexibility, security, and efficiency to on-chain interactions:

* Intents enable solvers to tap into any on-chain/off-chain liquidity, including private order flows, **boosting accessible liquidity** compared to conventional methods.
* Solvers can **match users directly** against each other, potentially offering better prices without relying solely on external liquidity pools.
* Intents **shield users from MEV** bots and public mempool vulnerabilities by operating in a safe, walled-garden environment.
* Users can execute orders across chains without needing to hold the native gas token like ETH, making cross-chain interactions **seamless and gasless**.
* Users only **pay for successful executions**, eliminating wasted fee costs.
* Intents enable solvers to batch multiple orders, **reducing execution costs** and passing savings to users through better quotes.
* They **remove the need for custodians** (centralized or decentralized), mitigating liquidity risks and enhancing trustlessness in the system.

&#x20;
