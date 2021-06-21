export class MissingOptionsError extends Error {
  constructor(message: string) {
    super(`[MissingOptionsError] ${message}`);
    this.name = 'MissingOptionsError'
  }
}

export class MailerError extends Error {
  constructor(message: string, stack?: string) {
    super(`[MailerError] ${message}`);
    this.name = 'MailerError'
    this.stack = stack;
  }
}

export class TemplateEngineError extends Error {
  constructor(message: string, stack?: string) {
    super(`[TemplateEngineError] ${message}`);
    this.name = 'TemplateEngineError'
    this.stack = stack;
  }
}
