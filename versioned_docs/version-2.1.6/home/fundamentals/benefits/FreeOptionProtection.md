---
id: free-option-protection
---

# Free option protection

The **free option problem** in [atomic swaps](../introduction/AtomicSwaps.mdx) arises when one party exploits market conditions by deciding to complete or abort a swap based on price movements, leaving the counterparty at a disadvantage. These cases are covered in [scenarios and safeguards](../introduction/AtomicSwaps.mdx#scenarios-and-safeguards).

Garden addresses this challenge with built-in mechanisms that ensure fairness and accountability for the participants.

### **Solver safeguards**

* Solver and its respective stakers are slashed if the solver fails to initiate a deposit on their side after the user’s deposit. The slashed amount is awarded to the user.
* This penalty directly discourages solver misuse and also ensures stakers will keep solvers accountable as they can always switch their vote to another solver.
* Settlement speed is already factored into the solver score [formula](../introduction/Auctions.md), reducing the ability of unreliable solvers to win future intents.

### **User safeguards**

* If a user fails to claim their asset after a swap is completed, a portion of the stakers’ SEED stake (proportional to the trade size) is slashed and awarded to the solver.&#x20;
* Stakers earn yield from the protocol and govern its operations, making them responsible for ensuring users interact with the UI effectively.&#x20;