type Func = (...args: any[]) => any

type ErrorSafeRaw<T extends Func | Promise<any>> = T extends Promise<any>
  ? [error: unknown, result: Awaited<T>]
  : [error: unknown, result: Awaited<ReturnType<Extract<T, Func>>>]

type ErrorSafeResult<T extends Func | Promise<any>> = T extends Promise<any>
  ? Promise<ErrorSafeRaw<T>>
  : ReturnType<Extract<T, Func>> extends Promise<any>
  ? Promise<ErrorSafeRaw<T>>
  : ErrorSafeRaw<T>

type ErrorSafeFunc<T extends Func> = (
  ...args: Parameters<T>
) => ErrorSafeResult<T>

async function createSafePromise<T extends Promise<any>>(target: T) {
  try {
    const result = await target
    return [undefined, result]
  } catch (err) {
    return [err, undefined]
  }
}

/**
 * Wraps a function in error-safe execution, returning an array of error and result.
 *
 * @example
 * const safeSum = createSafe((num1: number, num2: number) => num1 + num2)
 * const [err, res] = safeSum(10, 10)
 *
 * // With async function
 * const safeSum = createSafe(async (num1: number, num2: number) => num1 + num2)
 * const [err, res] = await safeSum(10, 10)
 */
function createSafe<T extends Func>(target: T): ErrorSafeFunc<T> {
  return ((...args: Parameters<T>) => {
    try {
      const result = target(...args)
      if (result instanceof Promise) {
        return createSafePromise(result)
      }
      return [undefined, result]
    } catch (err) {
      return [err, undefined]
    }
  }) as ErrorSafeFunc<T>
}

function safe<T extends Promise<any>>(target: T): ErrorSafeResult<T>
function safe<T extends Func>(target: T): ErrorSafeResult<T>

/**
 * A utility function to safely execute promises or functions, returning an error-first tuple.
 *
 * @example
 * const [err, res] = await safe(fetch('https://google.com'))
 * const [err, res] = safe(() => mySyncFunction(10, 20))
 * const [err, res] = await safe(() => myAsyncFunction(10, 20))
 */
function safe<T extends Promise<any> | Func>(target: T): ErrorSafeResult<T> {
  if (target instanceof Promise) {
    return createSafePromise(target) as ErrorSafeResult<T>
  }
  const safeTarget = createSafe(target)
  return safeTarget() as ErrorSafeResult<T>
}

export { safe, createSafe }
