# Fluid-SES

A syntax fluid mail sender library that uses SES and NodeMailer.

![build-status](https://img.shields.io/github/checks-status/neoxia/fluid-ses/master)
![last-commit](https://img.shields.io/github/last-commit/neoxia/fluid-ses)

## Prerequisite
Following environment variables must be defined:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## Installation

With npm:
```bash
npm i fluid-ses-core
```
With yarn:
```bash
yarn add fluid-ses-core
```

## Local installation

### Install & build

```bash
yarn && yarn run build:all
```

### Run tests

```bash
yarn run test:all
```

## Basic usages

### Initializing Fluid-SES

```typescript
const fluidSes = new FluidSes({ region: 'eu-west-1' });
```

### Sending a mail
```typescript
await fluidSes.sourceName('Fluid mailer')
      .sourceMail('fluid-mailer@something.com')
      .addressees(['someone@something.com','someoneElse@something.com'])
      .subject('Urgent matter')
      .template('My incredible message')
      .sendMail();
```


## Constructor optional options

### defaultSourceName and defaultSourceMail
In order to avoid specifying sender identity each time, you can give default value for those

```typescript
const fluidSes = new FluidSes({ 
    region: 'eu-west-1',
    defaultSourceName: 'System sender',
    defaultSourceMail: 'sytem-sender@your-company.com'
});
```

### mailTrap
Fluid SES allows you to filter addressees based on a custom function. If addressee list ends up empty after the call of the mailTrap method, it ends up not sending a mail at all.
Here is the signature :
```typescript
mailTrap: (addressees: Array<string | Address>) => Promise<Array<string | Address>>;
```

Example:
```typescript
const myMailTrap = async (addressees: Array<string | Address>) => {
    return process.env.env === 'prod' ? addressees : [];
}

const fluidSes = new FluidSes({ 
    region: 'eu-west-1',
    mailTrap: myMailTrap
});
```

### templateEngine
If you want to use another template engine, you can define new ones this way

```typescript
class MyCustomTemplateEngine extends ITemplateEngine {
    getComputedTemplate (options: CustomTemplatingOptions): Promise<string> {
      // Process and then returns filled template as a promise
    };
}

const fluidSes = new FluidSes({
    region: 'eu-west-1',
    templateEngine: MyCustomTemplateEngine
});
```


## Templating

### With default template engine
```typescript
const defaultTemplate = 'Hello {{ name }}, ' +
    'your {{ article }} with number {{ command }} has been shipped.';

const myTemplate: ITemplateEngineOptions = {
    template: defaultTemplate,
    templateMapping: {
        name: 'Joe',
        article: 'Computer',
        command: '21673',
    },
};

await fluidSes.sourceName('Fluid mailer')
      .sourceMail('fluid-mailer@something.com')
      .addressees(['someone@something.com','someoneElse@something.com'])
      .subject('Urgent matter')
      .template(myTemplate)
      .sendMail();
```

## Other options

### useBcc

```typescript
await fluidSes.sourceName('Fluid mailer')
      .sourceMail('fluid-mailer@something.com')
      .addressees(['someone@something.com','someoneElse@something.com'])
      .subject('Urgent matter')
      .useBcc(true) // default is false
      .template('My incredible message')
      .sendMail();
```
This will use only the first addressee of the array as 'to' material and the others will be added as bcc.

### attachments
This allows you to add attachments to your mails.
```typescript
const attachments: Attachment[] = [{ filename: 'something' }];

await fluidSes.sourceName('Fluid mailer')
    .sourceMail('fluid-mailer@something.com')
    .addressees(['someone@something.com','someoneElse@something.com'])
    .subject('Urgent matter')
    .attachments(attachments)
    .template('My incredible message')
    .sendMail();
```

### additionalOptions
If you are willing to use Nodemailer options that aren't already supported by Fluid SES you can still use them this way :

```typescript
const myNodeMailerOptions: Mail.Options = {
    encoding: 'utf-8',
};

await fluidSes.sourceName('Fluid mailer')
    .sourceMail('fluid-mailer@something.com')
    .addressees(['someone@something.com','someoneElse@something.com'])
    .subject('Urgent matter')
    .additionalOptions(myNodeMailerOptions) // Won't override options comming natively from Fluid SES
    .template('My incredible message')
    .sendMail();

await fluidSes.sourceName('Fluid mailer')
    .sourceMail('fluid-mailer@something.com')
    .addressees(['someone@something.com','someoneElse@something.com'])
    .subject('Urgent matter')
    .additionalOptions(myNodeMailerOptions, true) // Will override options comming natively from Fluid SES
    .template('My incredible message')
    .sendMail();
```
