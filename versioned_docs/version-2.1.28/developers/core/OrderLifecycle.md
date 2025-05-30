---
id: order-lifecycle
---

# Order lifecycle

Understanding the lifecycle of an order is critical for developers integrating with Garden protocol. This page outlines the various states an order (or [intent](../../home/fundamentals/introduction/Intents.md)) can go through during the swap process, helping you manage integration logic effectively. For a high-level explanation of the order flow, refer to the [intent flow](../../home/fundamentals/how-it-works/IntentFlow.md).

An order's lifecycle starts when a user creates an intent to swap assets and continues through matching, execution, and final settlement. Each stage is tracked programmatically using the `OrderStatus` and `SwapStatus` enums. To track the current status of an order, refer to [get order](../sdk/react/GetOrder.md) for SDK implementations or [orderbook API](../api/GardenAPI.md) for API-based integrations.

## Order states
The tables below classify all the order statuses, providing descriptions and the corresponding actions. The **Actions** column is particularly useful for API integrators, detailing the steps they need to implement for each state. For SDK implementations, these actions are already handled, so the information serves as a reference to understand the underlying process.

### Order creation and matching

| Status      | Description                                                   | Action                                      |
|-------------|---------------------------------------------------------------|------------------------------------------------------|
| **`Created`** | The order is created and waiting for a solver to match.       | --                           |
| **`Matched`** | A solver has matched the order. | The user has to initiate the transaction on their source chain. |

### Settlement: User and solver execution

| Status                       | Description                                                              | Action                                      |
|------------------------------|--------------------------------------------------------------------------|------------------------------------------------------|
| **`InitiateDetected`**       | The user’s initiation transaction is detected on-chain but not confirmed yet. | -- |
| **`Initiated`**              | The user’s initiation is confirmed. The solver must now initiate the transaction on the destination chain. | Wait for the solver to initiate.                          |
| **`CounterPartyInitiateDetected`** | The solver’s initiation transaction is detected on-chain but not confirmed. | --        |
| **`CounterPartyInitiated`**  | The solver’s initiation is confirmed, and the user must redeem their funds on the destination chain. | The user has to redeem their funds.               |

### Redemption and completion

| Status                       | Description                                                              | Action                                      |
|------------------------------|--------------------------------------------------------------------------|------------------------------------------------------|
| **`RedeemDetected`**         | The user’s redeem transaction is detected on-chain but not confirmed yet.    | -- |
| **`Redeemed`**               | The user has redeemed their funds. The solver will now redeem their funds on the source chain. | --              |
| **`CounterPartyRedeemDetected`** | The solver’s redeem transaction is detected on-chain but not confirmed. | --                |
| **`CounterPartyRedeemed` / `Completed`** | The solver has redeemed their funds, marking the entire order as completed. | --    |

### Exceptional and failure states

| Status                       | Description                                                              | Action                                      |
|------------------------------|--------------------------------------------------------------------------|------------------------------------------------------|
| **`CounterPartySwapExpired`**| The solver’s [HTLC](../../home/fundamentals/introduction/AtomicSwaps.mdx) has expired. |  The user must wait for their HTLC to expire to claim a refund. |
| **`Expired`**                | The user’s HTLC has expired.            | The user has to refund their funds.    |
| **`RefundDetected`**         | The user’s refund transaction is detected on-chain but not confirmed.    | --          |
| **`Refunded`**               | The user’s refund is confirmed, and they have reclaimed their funds.     | --                    |
| **`DeadLineExceeded`**       | 1. Initiate transaction is not detected within 1 hour. 2. Initiate transaction is not confirmed within 12 hours. | -- |

## Swap states
Each swap (user or solver side) transitions through the following states:

| Status            | Description                                           |
|-------------------|-------------------------------------------------------|
| **`Idle`**        | The swap is not yet initiated.                        |
| **`InitiateDetected`** | Initiation transaction is detected but not confirmed. |
| **`Initiated`**   | The initiation transaction is confirmed.              |
| **`RedeemDetected`** | Redemption transaction is detected but not confirmed. |
| **`Redeemed`**    | Redemption transaction is confirmed.                  |
| **`RefundDetected`** | Refund transaction is detected but not confirmed.  |
| **`Refunded`**    | Refund transaction is confirmed.                      |
| **`Expired`**     | The swap expired, and a refund is required.           |