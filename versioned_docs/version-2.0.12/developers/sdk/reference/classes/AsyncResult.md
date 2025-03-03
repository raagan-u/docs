---
id: async-result
title: AsyncResult
---

# `AsyncResult` and `Result`

The `AsyncResult` and `Result` classes are foundational utilities in the `garden` ecosystem. They provide a structured way to handle asynchronous operations and their results, eliminating the need for explicit `try-catch` blocks in most cases.

The Result class wraps the outcome of a function, while `AsyncResult` extends this concept for asynchronous operations.

```ts
import { AsyncResult, Result, Ok, Err } from '@catalogfi/utils';
```

## `Result` class

The `Result` class encapsulates an operation's result, including whether it succeeded and its associated value or error.

### Properties

| Property | Type           | Description                                                              |
| -------- | -------------- | ------------------------------------------------------------------------ |
| ok       | boolean        | Indicates whether the operation was successful (true) or failed (false). |
| val      | T              | The value returned by a successful operation.                            |
| error    | E \| undefined | The error returned by a failed operation.                                |

### Constructor

```ts
new Result(ok: boolean, val: T, error?: E | undefined)
```

## `AsyncResult` Type

The `AsyncResult` type represents an asynchronous version of `Result`.

```ts
type AsyncResult<T, E> = Promise<Result<T, E>>;
```

#### Key Features

- Combines Promise and Result, enabling both asynchronous handling and structured error management.
- Simplifies error handling: instead of try-catch, use res.error to access any errors.

## Utility Functions

### `Ok`

Creates a successful Result with the given value.

```ts
export const Ok = <T>(val: T): Result<T, never>;
```

**parameters**

- `val: T` - The value to return in the result.

### `Err`

Creates a failed Result with the given error value.

```ts
export const Err = <E>(error: E, ...optionalMsg?: string[]): Result<never, E>;
```

**parameters**

- `error: E` - The error value.
- `optionalMsg?: string[]` - Additional messages to append to the error.

## Example: using `Ok` and `Err`

```ts
//Suppose we have a function fetchData that retrieves
//some data asynchronously and uses AsyncResult for its return type.
async function fetchData(id: string): AsyncResult<{ data: string }, string> {
  if (!id) {
    return Err('Invalid ID provided');
  }

  try {
    const response = await fetch(`https://api.example.com/data/${id}`);
    if (!response.ok) {
      return Err(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return Ok({ data });
  } catch (error) {
    return Err('Unexpected error occurred', error.message);
  }
}

//Now, you can use fetchData in your application without worrying about error handling.
const result = await fetchData('123');

if (result.ok) {
  console.log('Data fetched successfully:', result.val);
} else {
  console.error('Error fetching data:', result.error);
}
```
