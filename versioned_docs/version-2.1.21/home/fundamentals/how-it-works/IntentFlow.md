---
id: intent-flow
---

# Intent flow

<figure><img src="/assets/garden protocol.png" alt=""/><figcaption></figcaption></figure>

Now that we know all the actors and modules in the system, let's take a detailed technical look at how all of them come together.&#x20;

Here’s a simplified representation of the process:

1. User requests quote → Signs intent → Submits intent to order book
2. Order book selects solver → Solver begins settlement
3. User initiates transaction → Solver executes on destination chain
4. User redeems funds → Solver completes settlement

Here is the detailed look into each step of the process.

### **Creating an intent**

1. The user starts the process by requesting a **quote** for a desired swap. The quote contains details like the input asset, output asset, chains involved, and the desired amounts.
2. The user receives the quote and must **accept it** by creating a **signed intent message.**
3. This signed intent represents the user's objective, including parameters like assets, chains, amounts, and expiration details.

### **Selection of solver in the order book**

* Once the user signs the intent, it is submitted to the **order book**, a decentralized system where solvers compete to fulfill the intent.
* Auction process:
  1. All solvers submit their quotes based on the intent's parameters.
  2. The **best quote** (lowest price or highest efficiency) is determined.
  3. Solvers with a **higher staker score** than the solver with the best quote have a 5-second window to match the quote.
     * **No acceptance:** The best-quote solver wins.
     * **One acceptance:** The accepting solver wins.
     * **Multiple acceptances:** The solver with the highest staker score wins.
  4. Once a solver is selected, they prepare to execute the swap.

### **Settlement: User-side execution**

1. The settlement process begins once the selected solver is confirmed.
2. The user must **initiate settlement** by creating a **signed transaction message** for the intent.
3. The signed message is submitted to a **relayer**, which broadcasts it on the blockchain.
4. The transaction is processed on-chain, and the user’s funds are locked or transferred to the relevant contract or wallet.
5. Once the transaction achieves the required number of blockchain confirmations, the settlement progresses to the solver’s side.

### **Settlement: Solver-side execution**

1. The solver, upon receiving confirmation of the user-side transaction, initiates the corresponding transaction on their end.
2. This step involves the solver locking or transferring funds on the user’s destination chain to fulfill the intent.
3. The solver’s transaction also undergoes a confirmation process on the destination chain to ensure security and reliability.

### **Redemption**

1. After the solver’s transaction achieves the required confirmations:
   * The user’s intended asset is made available on the destination chain.
   * The solver receives their funds on the source chain, completing the swap process.
2. The user can now **redeem** their receiving asset on the destination chain. This marks the final step of the process.
