import {SES} from '@aws-sdk/client-ses';
import {createTransport, SentMessageInfo, Transporter} from 'nodemailer';
import {CustomAttachment, IFluidSESConstructorOptions, IFluidSESMailOptions} from './types';
import {CustomTemplatingOptions, ITemplateEngine, TemplateEngine} from '@fluid-ses/templating';
import {MailerError, MissingOptionsError, TemplateEngineError} from './core-errors';
import Mail from 'nodemailer/lib/mailer';


export class FluidSes {
    private _options: IFluidSESMailOptions = {};

    private readonly _defaultSourceMail: string | undefined = '';
    private readonly _defaultSourceName: string | undefined = '';
    private readonly _mailTrap: (addressees: string[]) => Promise<string[]>;
    private readonly _templateEngine: ITemplateEngine;
    private readonly _transporter: Transporter;

    private static async _noTrap(addressees: string[]): Promise<string[]> {
      return addressees;
    }

    constructor(constructOptions: IFluidSESConstructorOptions) {
      this._defaultSourceMail = constructOptions.defaultSourceMail;
      this._defaultSourceName = constructOptions.defaultSourceName;
      this._mailTrap = constructOptions.mailTrap || FluidSes._noTrap;
      this._templateEngine = constructOptions.templateEngine || new TemplateEngine();

      const mailer = new SES({
        apiVersion: '2010-12-01',
        region: constructOptions.region,
      });

      this._transporter = createTransport({SES: mailer});
    }

    /**
     * Define templatingOptions option
     * @param templatingOptions
     * @returns {this}
     */
    public template(templatingOptions: CustomTemplatingOptions): FluidSes {
      this._options.templatingOptions = templatingOptions;
      return this;
    }

    /**
     * Define subject option
     * @param subject
     * @returns {this}
     */
    public subject(subject: string): FluidSes {
      this._options.subject = subject;
      return this;
    }

    /**
     * Define sourceMail option
     * @param sourceMail
     * @returns {this}
     */
    public sourceMail(sourceMail: string): FluidSes {
      this._options.sourceMail = sourceMail;
      return this;
    }

    /**
     * Define sourceName option
     * @param sourceName
     * @returns {this}
     */
    public sourceName(sourceName: string): FluidSes {
      this._options.sourceName = sourceName;
      return this;
    }

    /**
     * Define addressees option
     * @param addressees
     * @returns {this}
     */
    public addressees(addressees: string[] | string): FluidSes {
      this._options.addressees = Array.isArray(addressees) ? addressees : [addressees];
      return this;
    }

    /**
     * Define attachments option
     * @param attachments
     * @returns {this}
     */
    public attachments(attachments: CustomAttachment[] | CustomAttachment): FluidSes {
      this._options.attachments = Array.isArray(attachments) ? attachments : [attachments];
      return this;
    }

    /**
     * Define useBbc option
     * @param useBbc (boolean)
     * @returns {this}
     */
    public useBbc(useBbc: boolean): FluidSes {
      this._options.useBbc = useBbc;
      return this;
    }

    /**
     * Send mail based on options, reset options afterward
     * @returns Nothing or error
     */
    public async sendMail(): Promise<SentMessageInfo | void> {
      try {
        const mailSending = await this._sendMail();
        this._clearOptions();
        return mailSending;
      } catch (e) {
        this._clearOptions();
        throw e;
      }
    }

    /**
     * Get computed template, reset options afterward
     * @returns Filled template
     */
    public async getComputedTemplate(): Promise<string> {
      try {
        const filledTemplate = await this._computedTemplate();
        this._clearOptions();
        return filledTemplate;
      } catch (e) {
        this._clearOptions();
        throw e;
      }
    }

    private async _sendMail(): Promise<SentMessageInfo> {
      if (!this._options.addressees || !this._options.subject) {
        throw new MissingOptionsError('Addressees and Subject must be defined');
      }

      const finalAddressees = await this._mailTrap(this._options.addressees);

      if (finalAddressees.length) {
        const filledTemplate = await this._computedTemplate();
        const completeSource = this._getCompleteSource();
        let mailSendingOptions: Mail.Options;
        if (this._options.useBbc && finalAddressees.length > 1) {
          mailSendingOptions = {
            from: completeSource,
            to: finalAddressees[0],
            bcc: finalAddressees.slice(1),
            subject: this._options.subject,
            text: filledTemplate,
            attachments: this._options.attachments,
          }
        } else {
          mailSendingOptions = {
            from: completeSource,
            to: finalAddressees,
            subject: this._options.subject,
            text: filledTemplate,
            attachments: this._options.attachments,
          }
        }
        try {
          return this._transporter.sendMail(mailSendingOptions);
        } catch (e) {
          throw new MailerError(e.message, e.stack);
        }
      }
    }

    private _clearOptions(): void {
      this._options = {};
    }

    private _getCompleteSource(): string {
      const sourceName = this._getSourceName();
      const sourceMail = this._getSourceMail();
      if (!sourceName || !sourceMail) {
        throw new MissingOptionsError('Source name and source mail must be defined');
      }
      return `${sourceName} <${sourceMail}>`;
    }

    private _getSourceName(): string | undefined {
      return this._options.sourceName || this._defaultSourceName;
    }

    private _getSourceMail(): string | undefined {
      return this._options.sourceMail || this._defaultSourceMail;
    }

    private _computedTemplate(): Promise<string> {
      if (!this._options.templatingOptions) {
        throw new MissingOptionsError('Templating options must be defined');
      }
      const templatingOptions = this._options.templatingOptions || {};

      try {
        return this._templateEngine.getComputedTemplate(templatingOptions);
      } catch (e) {
        throw new TemplateEngineError(e.message, e.stack);
      }
    }
}
