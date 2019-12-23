export default class CircularDependencyError extends Error {
  constructor(message: string = "A circular dependency was detected.") {
      super(message);
      Object.setPrototypeOf(this, CircularDependencyError.prototype);
  }
}