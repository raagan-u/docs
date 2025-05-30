---
id: htlc-evm
---

# Atomic swap (EVM)

## Architecture

The **Hashed timelock contract (HTLC)** is a core component of atomic swaps, enabling secure cross-chain transactions. It allows an **initiator** to lock tokens in a contract that can only be claimed by a designated **redeemer** who possesses a cryptographic secret. If the redeemer does not claim the tokens within the specified timeframe, the initiator can reclaim them, ensuring no funds are lost.

In Garden's atomic swaps, two parties—the **user** and the [solver](https://docs.garden.finance/home/fundamentals/introduction/solvers)—each create complementary HTLCs on different blockchains. This mechanism guarantees that either both transactions are successfully executed or both are refunded, eliminating counterparty risk.

For a deeper understanding of atomic swaps and their role in Garden, read [atomic swaps](https://docs.garden.finance/home/fundamentals/introduction/atomic-swaps).

## Contract guarantees

- Orders can only be redeemed with the correct secret that generates the secret hash.
- Initiators can refund their tokens after the timelock expires if not redeemed.
- Once an order is fulfilled, it cannot be refunded or redeemed again.
- All order parameters are validated :
  - Redeemer cannot be a zero address.
  - Timelock must be greater than zero.
  - Amount must be greater than zero.
  - Initiator and redeemer must be different addresses.

## Order lifecycle

### Initiation
The initiation phase locks tokens into the contract. Initiator calls `initiate()` or a third party calls `initiateWithSignature()`. The contract validates all parameters. A unique `orderID` is generated from the chain ID, secret hash, and initiator address. Tokens are then transferred from the initiator to the contract. The order details are stored in the contract and an `Initiated` event is emitted.

### Redemption
The redemption phase releases tokens to the redeemer. Redeemer provides the `orderID` and the secret. The contract verifies that the secret provided is correct. If yes, then the order is marked as fulfilled. Tokens are transferred to the redeemer and a `Redeemed` event is emitted.

### Refund
The refund phase returns tokens back to the initiator. After the timelock period expires, the initiator calls `refund()`. The contract verifies if the timelock has expired. The order is then marked as fulfilled. Tokens are transferred back to the initiator and a `Refunded` event is emitted.

### Instant refund
It allows early termination of the contract. Redeemer signs a refund permission. Initiator or any party calls `instantRefund()` with the redeemer's signature. Contract verifies the signature is from the redeemer and then the order is marked as fulfilled. Tokens are transferred back to the initiator and a `Refunded` event is emitted.

## Data types and storage

### Order struct

```solidity
struct Order {
    bool isFulfilled;
    address initiator;
    address redeemer;
    uint256 initiatedAt;
    uint256 timelock;
    uint256 amount;
}
```

| Field       | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| isFulfilled | Whether the order has been redeemed or refunded               |
| initiator   | Address that initiated the order and provided the tokens      |
| redeemer    | Address that can redeem the tokens by providing the secret    |
| initiatedAt | Block number when the order was initiated                     |
| timelock    | Number of blocks that must elapse before a refund is possible |
| amount      | Amount of tokens locked in the order                          |

### Storage

The contract uses the following storage variables:

- `token`: Immutable reference to the ERC20 token being used for the swap
- `orders`: Mapping from orderID (bytes32) to Order structs
- `_INITIATE_TYPEHASH`: Type hash constant for EIP-712 signatures for initiations
- `_REFUND_TYPEHASH`: Type hash constant for EIP-712 signatures for refunds

## Contract functions

### Constructor

```solidity
constructor(address token_, string memory name, string memory version)
```

Initializes the contract with the ERC20 token address and the domain separator for EIP-712 signatures.

| Parameter | Description                                        |
| --------- | -------------------------------------------------- |
| token\_   | Address of the ERC20 token used in the atomic swap |
| name      | Name for the EIP-712 domain separator              |
| version   | Version for the EIP-712 domain separator           |

### initiate

Creates a new order with the caller as the initiator. Transfers tokens from the initiator to the contract.

| Parameter  | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
| redeemer   | Address that can redeem the tokens                                        |
| timelock   | Number of blocks before the order can be refunded                         |
| amount     | Amount of tokens to lock in the contract                                  |
| secretHash | SHA-256 hash of the secret that the redeemer must provide to claim tokens |

### initiateWithSignature

Creates a new order on behalf of a signer who authorized the operation via EIP-712 signature. The signer becomes the initiator.

| Parameter  | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
| redeemer   | Address that can redeem the tokens                                        |
| timelock   | Number of blocks before the order can be refunded                         |
| amount     | Amount of tokens to lock in the contract                                  |
| secretHash | SHA-256 hash of the secret that the redeemer must provide to claim tokens |
| signature  | EIP-712 signature from the initiator authorizing the order creation       |

### redeem

Allows anyone with valid secret to call and transfer the locked tokens to the redeemer.

| Parameter | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| orderID   | ID of the order to redeem                                                  |
| secret    | Original secret value that hashes to the secretHash used in order creation |

### refund

Returns locked tokens to the initiator after the timelock period has expired.

| Parameter | Description               |
| --------- | ------------------------- |
| orderID   | ID of the order to refund |

### instantRefund

Returns locked tokens to the initiator before the timelock expires, only if authorized by the redeemer via signature.

| Parameter | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| orderID   | ID of the order to refund immediately                            |
| signature | EIP-712 signature from the redeemer authorizing the early refund |

## Events

### Initiated

Emitted when a new order is created.

| Parameter  | Description                              |
| ---------- | ---------------------------------------- |
| orderID    | ID of the created order                  |
| secretHash | Hash of the secret needed for redemption |
| amount     | Amount of tokens locked in the order     |

### Redeemed

Emitted when an order is redeemed.

| Parameter  | Description                                      |
| ---------- | ------------------------------------------------ |
| orderID    | ID of the redeemed order                         |
| secretHash | Hash of the secret used for redemption           |
| secret     | The actual secret value provided by the redeemer |

### Refunded

Emitted when an order is refunded (either after timelock expiry or instantly with permission).

| Parameter | Description              |
| --------- | ------------------------ |
| orderID   | ID of the refunded order |

## Security considerations

### Order identification
Order IDs are deterministically calculated as ` sha256(abi.encode(block.chainid, secretHash, initiator)) ` to ensure uniqueness, preventing replay attacks across different chains and duplicate orders with the same parameters.

### Signature verification
The contract uses EIP-712 typed structured data for secure, user-friendly signatures, enabling gas-efficient meta-transactions for both order creation and early refunds.

### Order validation
The contract prevents orders with duplicate IDs. It verifies that initiator and redeemer addresses are different and ensures that all numerical parameters (timelock, amount) must be non-zero as well as the redeemer address cannot be zero.

### Error messages
The contract implements comprehensive error handling with clear, specific error messages for all failure cases. Additionally, it performs distinct validation checks for various order states including expired orders, fulfilled orders, and other validation criteria.
