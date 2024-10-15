# error-safe (deprecated README)

A TypeScript utility library that provides a safe way to handle function and promise results, ensuring errors are captured and returned in a consistent format. Ideal for developers seeking to simplify error handling and improve code reliability.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)

## Installation

You can install **`error-safe`** via npm:

```bash
npm install error-safe
```

## Usage

Here's how to use error-safe in your TypeScript project:

**Safe Function Call**

```ts
import { safe } from 'error-safe'

const safeFunction = safe((x: number) => {
  if (x < 0) {
    throw new Error('Negative value!')
  }
  return x * 2
})

// Usage
const [error, result] = safeFunction(5) // [undefined, 10]
const [error2, result2] = safeFunction(-5) // [Error: Negative value!, undefined]
```

**Safe Promise Call**

```ts
// Usage
const [error, result] = await safe(fetch('https://google.com')) // [undefined, Response]
```

## API

`safe(target: Func | Promise<any>): SafeResultFunc | PromiseSafeResult`

target: A function or promise to be wrapped for safe execution.
Returns a safe wrapper that returns either a promise or an array with the error and result.
