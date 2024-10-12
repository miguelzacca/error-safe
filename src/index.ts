type Func = (...args: any[]) => any

type PromiseSafeResult<T extends Promise<any>> = Promise<
  [error: any, result?: Awaited<T>]
>

type SafeResultFunc<T extends Func> = (
  ...args: Parameters<T>
) => ReturnType<T> extends Promise<any>
  ? Promise<[error: any, result?: Awaited<ReturnType<T>>]>
  : [error: any, result?: ReturnType<T>]

function safe<T extends Func | Promise<any>>(
  target: T,
): T extends Promise<any>
  ? PromiseSafeResult<T>
  : SafeResultFunc<Extract<T, Func>> {
  if (target instanceof Promise) {
    return target
      .then((data) => [undefined, data])
      .catch((err) => [err, undefined]) as T extends Promise<any>
      ? PromiseSafeResult<T>
      : never
  }

  return ((...args: Parameters<Extract<T, Func>>) => {
    try {
      const result = target(...args)
      if (result instanceof Promise) {
        return result
          .then((data) => [undefined, data])
          .catch((err) => [err, undefined])
      }
      return [undefined, result]
    } catch (err) {
      return [err, undefined]
    }
  }) as T extends Promise<any> ? never : SafeResultFunc<Extract<T, Func>>
}

export { safe }
