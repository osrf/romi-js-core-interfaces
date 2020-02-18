const MAX_SAFE_TIMEOUT = 2147483647;

function wrapAssertion(
  assertion: jasmine.ImplementationCallback,
  timeout: number,
): jasmine.ImplementationCallback {
  const wrapped = (done: DoneFn): void => {
    const timer = setTimeout(() => {
      done.fail('timeout');
    }, timeout);

    const finish = (): void => {
      clearTimeout(timer);
      done();
    };

    finish.fail = (message?: Error | string): void => {
      done.fail(message);
    };

    assertion(finish);
    if (assertion.length === 0) {
      finish();
    }
  };
  return wrapped;
}

function itt(
  expectation: string,
  assertion: jasmine.ImplementationCallback,
  timeout = 5000,
): void {
  it(expectation, wrapAssertion(assertion, timeout), MAX_SAFE_TIMEOUT);
}

function fitt(
  expectation: string,
  assertion: jasmine.ImplementationCallback,
  timeout = 5000,
): void {
  fit(expectation, wrapAssertion(assertion, timeout), MAX_SAFE_TIMEOUT);
}

function xitt(
  expectation: string,
  assertion: jasmine.ImplementationCallback,
  timeout = 5000,
): void {
  xit(expectation, wrapAssertion(assertion, timeout), MAX_SAFE_TIMEOUT);
}

const global_ = global as any;
global_.itt = itt;
global_.fitt = fitt;
global_.xitt = xitt;

export {};

type JasmineIt = (
  expectation: string,
  assertion: jasmine.ImplementationCallback,
  timeout?: number) => void;

declare global {
  /**
   * it (with) timeout.
   *
   * Normally cleanup functions like `afterEach` are NOT called when a spec timed out. This wraps
   * the assertion in a timer and calls `done.fail` when the timer expires.
   * @param expectation
   * @param assertion
   * @param timeout
   */
  const itt: JasmineIt;

  /**
   * See [[itt]]
   */
  const fitt: JasmineIt;

  /**
   * See [[itt]]
   */
  const xitt: JasmineIt;
}
