import Mail, {Address, Attachment} from 'nodemailer/lib/mailer';
import {CustomTemplatingOptions, ITemplateEngine} from '@fluid-ses/templating';

export interface IFluidSESConstructorOptions {
    defaultSourceMail?: string;
    defaultSourceName?: string;
    region: string
    /**
     * Must returns filtered addressees mails
     * @param addressees
     */
    mailTrap?: (addressees: Array<string | Address>) => Promise<Array<string | Address>>;
    templateEngine?: ITemplateEngine;
}

export interface IFluidSESMailOptions {
    subject?: string;
    templatingOptions?: CustomTemplatingOptions;
    addressees?: Array<string | Address>;
    sourceMail?: string;
    sourceName?: string;
    useBbc?: boolean;
    attachments?: CustomAttachment[];
    additionalOptions?: Mail.Options;
}

export type CustomAttachment = Attachment;
