# Fluid-SES

A syntax fluid mail sender library that uses SES and NodeMailer.

## Prerequisite
Following environment variables must be defined:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

## Initializing Fluid-SES

```typescript
const fluidSes = new FluidSes({ region: 'eu-west-1' });
```

## Sending a mail
```typescript
await fluidSes.sourceName('Fluid mailer')
      .sourceMail('fluid-mailer@something.com')
      .addressees(['someone@something.com','someoneElse@something.com'])
      .subject('Urgent matter')
      .template('My incredible message')
      .sendMail();
```
