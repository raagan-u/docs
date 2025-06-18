---
id: digest-key
title: DigestKey
---

# Digest Key

The `Digest Key` in Garden is a 32-byte cryptographic key that serves as a unique identifier for users, designed for authentication, identity, and secret management in atomic swaps. It is used for authentication via JWTs, enabling secure access, and for identity, allowing order processing and unique user identification. Additionally, it plays a critical role in managing secrets for atomic swaps. This key functions as a Garden account, but it is strictly non-custodial, with no funds ever being associated with it or moved through it.

```ts
import { DigestKey } from '@gardenfi/utils';
```  

## Constructor

```ts
new DigestKey(digestKey: string)
```

**Parameters:**

- `digestKey` (string): A valid digest key in hexadecimal format (64-characters).

## Readonly Properties

### digestKey
```ts
get digestKey(): string;
```
Returns the digestKey.

### userId
```ts
get userId(): string;
```
Returns the userId.

## Methods

### from
```ts
DigestKey.from(digestKey: string): Result<DigestKey, string>
```
Validates the provided 32-byte cryptographic key and returns a `DigestKey` instance if valid, or an error message if invalid.

### generateRandom
```ts
DigestKey.generateRandom(): Result<DigestKey, string>
```
Generates a random digest key and returns a valid `DigestKey` instance or an error message if generation fails.

