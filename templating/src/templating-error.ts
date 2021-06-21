export class TemplatingError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'TemplatingError'
  }
}
