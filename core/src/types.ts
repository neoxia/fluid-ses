import {Attachment} from 'nodemailer/lib/mailer';
import {CustomTemplatingOptions, ITemplateEngine} from '@fluid-ses/templating';

export interface IFluidSESConstructorOptions {
    defaultSourceMail?: string;
    defaultSourceName?: string;
    region: string
    /**
     * Must returns filtered addressees mails
     * @param addressees
     */
    mailTrap?: (addressees: string[]) => Promise<string[]>;
    templateEngine?: ITemplateEngine;
}

export interface IFluidSESMailOptions {
    subject?: string;
    templatingOptions?: CustomTemplatingOptions;
    addressees?: string[];
    sourceMail?: string;
    sourceName?: string;
    useBbc?: boolean;
    attachments?: CustomAttachment[];
}

export type CustomAttachment = Attachment;
