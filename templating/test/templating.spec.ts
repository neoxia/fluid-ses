import {MailTemplate, TemplateEngine, TemplateMapping} from '../src';

describe('Testing default templating function', () => {
  // TemplateEngine
  const templateEngine = new TemplateEngine();

  // Templates
  const templateWithNoVariable: MailTemplate = 'This is a message with no variable';
  const templateWithOneVariable: MailTemplate = 'This is a message with one variable : {{ varOne }}';
  const templateWithTwoVariables: MailTemplate = 'This is a message with two variables : {{ varOne }} and {{ varTwo }}';
  const templateWithOneOptionalVariable: MailTemplate = 'This a message with an optional variable: {{ varOne? }} !';
  const templateWithMultipleLines: MailTemplate = `This
        is
        a
        message
        on
        multiple
        lines
    `;
  const templateWithMultipleLinesAndOneVariable: MailTemplate = `This
        is
        a
        message
        with
        a
        variable
        here : {{ varOne }} 
        on
        multiple
        lines
    `;

  // Templates var
  const varOneValue = 'Something-1';
  const varTwoValue = 'Something-2';

  // Filled templates
  const filledTemplateWithOneVariable = `This is a message with one variable : ${varOneValue}`;
  const filledTemplateWithTwoVariables = `This is a message with two variables : ${varOneValue} and ${varTwoValue}`;
  const filledTemplateWithOneOptionalVariable = `This a message with an optional variable: ${varOneValue} !`;
  const unfilledTemplateWithOneOptionalVariable = 'This a message with an optional variable:  !';
  const filledTemplateWithMultipleLinesAndOneVariable: MailTemplate = `This
        is
        a
        message
        with
        a
        variable
        here : ${varOneValue} 
        on
        multiple
        lines
    `;

  // TemplateMappings
  const templateMappingWithNoVariable: TemplateMapping = {};
  const templateMappingWithOneUndefinedVariable: TemplateMapping = {
    varOne: undefined as unknown as string,
  };
  const templateMappingWithOneVariable: TemplateMapping = {
    varOne: varOneValue,
  };
  const templateMappingWithTwoVariables: TemplateMapping = {
    varOne: varOneValue,
    varTwo: varTwoValue,
  };

  it('Should return base template with no variable and by giving an empty template mapping.', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithNoVariable, templateMapping: templateMappingWithNoVariable});
    expect(filledTemplate).toEqual(templateWithNoVariable);
  });

  it('Should return base template with no variable and by giving an undefined mapping.', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithNoVariable, templateMapping: undefined as unknown as TemplateMapping});
    expect(filledTemplate).toEqual(templateWithNoVariable);
  });

  it('Should throw a TemplatingError when giving an empty TemplateMapping with a template with one var.', async () => {
    try {
      await templateEngine.getComputedTemplate({template: templateWithOneVariable, templateMapping: templateMappingWithNoVariable});
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('TemplatingError');
    }
  });

  it('Should throw a TemplatingError when giving a TemplateMapping with an undefined var with a template with one var.', async () => {
    try {
      await templateEngine.getComputedTemplate({template: templateWithOneVariable, templateMapping: templateMappingWithOneUndefinedVariable});
      fail('Should throw an Error');
    } catch (e) {
      expect(e.name).toEqual('TemplatingError');
    }
  });

  it('Should return filled template with one variable.', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithOneVariable, templateMapping: templateMappingWithOneVariable});
    expect(filledTemplate).toEqual(filledTemplateWithOneVariable);
  });

  it('Should return filled template with two variables.', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithTwoVariables, templateMapping: templateMappingWithTwoVariables});
    expect(filledTemplate).toEqual(filledTemplateWithTwoVariables);
  });

  it('Should return filled template with one optional variable.', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithOneOptionalVariable, templateMapping: templateMappingWithOneVariable});
    expect(filledTemplate).toEqual(filledTemplateWithOneOptionalVariable);
  });

  it('Should return filled template with one optional variable with no provided TemplateMapping.', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithOneOptionalVariable, templateMapping: templateMappingWithNoVariable});
    expect(filledTemplate).toEqual(unfilledTemplateWithOneOptionalVariable);
  });

  it('Should return base template with no variable and multiples lines', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithMultipleLines, templateMapping: templateMappingWithNoVariable});
    expect(filledTemplate).toEqual(templateWithMultipleLines);
  });

  it('Should return base template with one variable and multiples lines', async () => {
    const filledTemplate = await templateEngine.getComputedTemplate({template: templateWithMultipleLinesAndOneVariable, templateMapping: templateMappingWithOneVariable});
    expect(filledTemplate).toEqual(filledTemplateWithMultipleLinesAndOneVariable);
  });

  it('Should return plain template', async () => {
    const template = await templateEngine.getComputedTemplate(templateWithNoVariable);
    expect(template).toEqual(templateWithNoVariable);
  });
});
