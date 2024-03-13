// Generic typing
export type MailTemplate = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomTemplatingOptions = any;

export interface ITemplateEngine {
    /**
     * Returns a promise of the computed template
     * @param options any kind of options
     */
    getComputedTemplate: (options: CustomTemplatingOptions) => Promise<string>;
}

// Implemented typing
export type TemplateMapping = { [key: string]: string };

export interface ITemplateEngineOptions {
    template: MailTemplate;
    templateMapping?: TemplateMapping;
}
