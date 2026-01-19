export class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;

  constructor(
    private threshold = 5,
    private timeoutMs = 10_000
  ) {}

  canRequest() {
    if (this.failures < this.threshold) return true;
    return Date.now() - this.lastFailure > this.timeoutMs;
  }

  success() {
    this.failures = 0;
  }

  failure() {
    this.failures++;
    this.lastFailure = Date.now();
  }
}
