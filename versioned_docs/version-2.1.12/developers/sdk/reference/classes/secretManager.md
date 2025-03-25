---
id: secret-manager
title: Secret Manager
---

# Secret Manager

The `SecretManager` class securely manages secrets and private keys, deriving a P256 key through an EIP-712 signature. The signature is hashed using SHA-256 to produce the key, ensuring security and compatibility. It extends the `EventBroker` class and the events are:

- **`initialized`**: Fired when the `SecretManager` is successfully initialized.

## Usage

```ts
import { SecretManager } from './SecretManager';
```

## Constructor

```ts
new SecretManager(privKey?: string, walletClient?: WalletClient)
```

**Parameters:**

- `privKey` (string,optional): The private key to use for signing transactions.
- `walletClient` (WalletClient,optional): The wallet client to use for signing transactions.

## Initiation

```ts
static fromPrivKey(privKey: string): SecretManager
(or)
static fromWalletClient(walletClient: WalletClient): SecretManager
```

**Returns:**

- [ISecretManager](../Interfaces.md#isecretmanager)

---

## Methods

### initialize

```ts
async initialize(): Promise<AsyncResult<string, string>>
```

Initializes the SecretManager, deriving the p256 key if necessary and emitting the initialized event.

**Returns:**

- `AsyncResult<string, string>`

### generateSecret

```ts
async generateSecret(nonce: number): Promise<AsyncResult<{ secret: string; secretHash: string }, string>>
```

Generates a secret and its hash using a given nonce.

**Parameters:**

- `nonce` (number): The nonce to use for generating the secret.

**Returns:**

- `AsyncResult<{ secret: string; secretHash: string }, string>`

### getMasterPrivKey

```ts
async getMasterPrivKey(): Promise<AsyncResult<string, string>>
```

Retrieves the p256 key. If it hasn't been derived yet, it will attempt to derive it from the wallet client.

**Returns:**

- `AsyncResult<string, string>`
