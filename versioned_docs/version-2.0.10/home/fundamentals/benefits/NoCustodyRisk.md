---
id: no-custody-risk
---

# No custody risk

Custody risk is a persistent challenge in interoperability and more so for Bitcoin. Traditional bridges and exchanges—whether centralized or decentralized—often expose users to vulnerabilities by requiring funds to be locked or temporarily held by third parties. These risks are well-documented:

- **Centralized custody**: Hacks like the $600M Ronin Bridge exploit or exchange collapses (e.g., Mt. Gox, FTX) highlight the catastrophic risks of entrusting funds to third parties.

- **Decentralized custody**: Even decentralized solutions relying on Multi-Party Computation (MPC) or liquidity pools aren’t immune, as seen with the Nomad Bridge (&dollar;190M hack) or smart contract bugs in Wormhole (&dollar;325M hack).

These examples highlight how shared custody models, even those claiming "self-custody", can expose users to significant risks.

## How Garden eliminates custody risks

Garden takes a fundamentally different approach by enabling peer-to-peer atomic swaps. This ensures users maintain complete control of their assets at every stage of the process. Here’s how user custody is maintained at every step of the intent flow:

1. Intent creation
   - User intents are cryptographically signed and broadcast without transferring custody.
   - No funds are required to leave the user's wallet at this stage.
2. Solver auction
   - No custody risk arises here, as funds are not involved during the solver selection process.
3. Settlement
   - After a solver is selected, the user locks their funds in a Hashed Timelock Contract (HTLC) on the source chain. HTLCs enforce conditional asset transfers using cryptographic hashes and timelocks. This ensures:
     - Funds can only be claimed by the rightful owner when swap conditions are met.
     - Funds are automatically refunded to the user if the timelock expires without settlement.
4. Redemption
   - The user redeems their funds on the destination chain using a cryptographic secret. This guarantees:
     - The solver can only claim funds on the source chain after fulfilling their obligations on the destination chain.
     - Simultaneous execution prevents custody transfer to intermediaries at any point.

For more details, see [atomic swaps](../introduction/AtomicSwaps.mdx) and [intent flow](../introduction/Intents.md).
