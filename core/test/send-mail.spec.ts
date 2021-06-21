import {FluidSes} from '../src';
import {SinonStub, stub} from 'sinon';
import Mail, {Attachment} from 'nodemailer/lib/mailer';
import {CustomTemplatingOptions, TemplateEngine} from '@fluid-ses/templating';

describe('Fluid ses core tests', () => {
  const region = 'eu-west-1';

  const sourceName = 'name';
  const sourceMail = 'something@mail.com';
  const completeSource = `${sourceName} <${sourceMail}>`;

  const subject = 'some subject';

  const addressees = ['other@mail.com', 'other2@gmail.com'];

  const attachments: Attachment[] = [{ filename: 'something' }];

  const templateContent = 'my template';
  const templatingOptions: CustomTemplatingOptions = { template: templateContent };

  const singleAddressee = 'other@mail.com';
  const singleAttachment: Attachment = { filename: 'something' };

  let mailerStub: SinonStub<[Mail.Options]>;
  let templateEngineStub: SinonStub<[CustomTemplatingOptions], Promise<string>>;

  beforeEach(() => {
    // Stub methods
    mailerStub = stub(Mail.prototype, 'sendMail');
    templateEngineStub = stub(TemplateEngine.prototype, 'getComputedTemplate')

    // Default behavior
    mailerStub.resolves();
    templateEngineStub.resolves(templateContent);
  })

  afterEach(() => {
    mailerStub.restore();
    templateEngineStub.restore();
  })

  it('Should throw MissingOptionsError if missing option Addressees', async () => {
    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceName(sourceName)
        .sourceMail(sourceMail)
        .subject(subject)
        .template(templatingOptions)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('MissingOptionsError');
    }
  });

  it('Should throw MissingOptionsError if missing option Subject', async () => {
    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceName(sourceName)
        .sourceMail(sourceMail)
        .addressees(addressees)
        .template(templatingOptions)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('MissingOptionsError');
    }
  });

  it('Should throw MissingOptionError if missing option Template Options', async () => {
    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceName(sourceName)
        .sourceMail(sourceMail)
        .addressees(addressees)
        .subject(subject)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('MissingOptionsError');
    }
  });

  it('Should throw a MissingOptionError if no source name nor default source name is provided', async () => {
    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceMail(sourceMail)
        .addressees(addressees)
        .subject(subject)
        .template(templatingOptions)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('MissingOptionsError');
    }
  });

  it('Should throw a MissingOptionError if no source mail nor default source mail is provided', async () => {
    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceName(sourceName)
        .addressees(addressees)
        .subject(subject)
        .template(templatingOptions)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('MissingOptionsError');
    }
  });

  it('Should throw a MailerError if an error occurs during mail sending', async () => {
    // Mailer throws
    mailerStub.throws();

    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceName(sourceName)
        .sourceMail(sourceMail)
        .addressees(addressees)
        .subject(subject)
        .template(templatingOptions)
        .attachments(attachments)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('MailerError');
    }
  });

  it('Should throw a TemplateEngineError if an error occurs during mail sending', async () => {
    // Engine throws
    templateEngineStub.throws();

    const fluidSes = new FluidSes({region});
    try {
      await fluidSes.sourceName(sourceName)
        .sourceMail(sourceMail)
        .addressees(addressees)
        .subject(subject)
        .template(templatingOptions)
        .attachments(attachments)
        .sendMail();
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('TemplateEngineError');
    }
  });

  it('Should call nodemailer with correct params', async () => {
    const fluidSes = new FluidSes({region});
    await fluidSes.sourceName(sourceName)
      .sourceMail(sourceMail)
      .addressees(addressees)
      .subject(subject)
      .template(templatingOptions)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1);
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual(addressees);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual(undefined);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual(undefined);
  });

  it('Should use default source name if provided', async () => {
    const fluidSes = new FluidSes({region, defaultSourceName: sourceName});
    await fluidSes.sourceMail(sourceMail)
      .addressees(addressees)
      .subject(subject)
      .template(templatingOptions)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1);
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual(addressees);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual(undefined);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual(undefined);
  });

  it('Should use default source mail if provided', async () => {
    const fluidSes = new FluidSes({region, defaultSourceMail: sourceMail});
    await fluidSes.sourceName(sourceName)
      .addressees(addressees)
      .subject(subject)
      .template(templatingOptions)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1);
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual(addressees);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual(undefined);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual(undefined);
  });

  it('Should send mails with bcc when calling individual', async () => {
    const fluidSes = new FluidSes({region});
    await fluidSes.sourceName(sourceName)
      .sourceMail(sourceMail)
      .addressees(addressees)
      .subject(subject)
      .template(templatingOptions)
      .useBbc(true)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1)
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual(addressees[0]);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual([addressees[1]]);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual(undefined);
  });

  it('Should send attachments when provided', async () => {
    const fluidSes = new FluidSes({region});
    await fluidSes.sourceName(sourceName)
      .sourceMail(sourceMail)
      .addressees(addressees)
      .subject(subject)
      .template(templatingOptions)
      .attachments(attachments)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1);
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual(addressees);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual(attachments);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual(undefined);
  });

  it('Should call mailer correctly when providing non-array addressees option', async () => {
    const fluidSes = new FluidSes({region});
    await fluidSes.sourceName(sourceName)
      .sourceMail(sourceMail)
      .addressees(singleAddressee)
      .subject(subject)
      .template(templatingOptions)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1);
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual([singleAddressee]);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual(undefined);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual(undefined);
  });

  it('Should call mailer correctly when providing non-array attachments option', async () => {
    const fluidSes = new FluidSes({region});
    await fluidSes.sourceName(sourceName)
      .sourceMail(sourceMail)
      .addressees(addressees)
      .subject(subject)
      .template(templatingOptions)
      .attachments(singleAttachment)
      .sendMail();

    expect(mailerStub.callCount).toEqual(1);
    expect(mailerStub.firstCall.firstArg.from).toEqual(completeSource);
    expect(mailerStub.firstCall.firstArg.to).toEqual(addressees);
    expect(mailerStub.firstCall.firstArg.subject).toEqual(subject);
    expect(mailerStub.firstCall.firstArg.text).toEqual(templateContent);
    expect(mailerStub.firstCall.firstArg.attachments).toEqual([singleAttachment]);
    expect(mailerStub.firstCall.firstArg.bcc).toEqual(undefined);
  });
});
