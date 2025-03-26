---
id: digest-key
title: DigestKey
---

# Digest Key

The `DigestKey` class derives a user ID from a given digest key and ensures its validity, primarily for authentication and identity verification.

```ts
import { DigestKey } from '@gardenfi/core';
```  

## Constructor

```ts
new DigestKey(digestKey: string)
```

**Parameters:**

- `digestKey` (string): A valid digest key in hexadecimal format (64-characters).

## Methods

### from
```ts
DigestKey.from(digestKey: string): Result<DigestKey, string>
```
Validates the provided digest key and returns a `DigestKey` instance if valid, or an error message if invalid.

**Returns:**

- `Result<DigestKey, string>`

### generateRandom
```ts
DigestKey.generateRandom(): Result<DigestKey, string>
```
Generates a random digest key and returns a valid `DigestKey` instance or an error message if generation fails.

**Returns:**

- `Result<DigestKey, string>`
