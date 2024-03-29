import {ITemplateEngine, ITemplateEngineOptions, MailTemplate} from './types';
import {TemplatingError} from './templating-error';

export class TemplateEngine implements ITemplateEngine {
  async getComputedTemplate(options: ITemplateEngineOptions | MailTemplate): Promise<string> {
    if (typeof options === 'string') {
      return options;
    } else {
      const templateMapping = options.templateMapping || {};

      return options.template.replace(/{{ ?(.*?) ?}}/g, (_ignoredCompleteMatch: unknown, varToSubstitute: string) => {
        const isOptional = varToSubstitute.startsWith('?') || varToSubstitute.endsWith('?');
        if (!templateMapping[varToSubstitute] && !isOptional) {
          throw new TemplatingError(`TemplateMapping is not correctly filled, could not find ${varToSubstitute} value`);
        }
        const finalVarToSubstitute = isOptional ? varToSubstitute.replace(/\?/g, '') : varToSubstitute;
        return templateMapping[finalVarToSubstitute] || '';
      });
    }
  }
}
