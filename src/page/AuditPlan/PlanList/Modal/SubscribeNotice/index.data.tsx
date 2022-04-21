import i18n from '../../../../../locale';

export const webhooksTemplateDefault = `{
  "msg_type": "text",
  "content": {
     "text":"{{.subject}} \\n {{.body}}"
  }
}`;

export const variableData: Array<{
  name: string;
  variable: string;
}> = [
  {
    name: i18n.t(
      'auditPlan.subscribeNotice.form.webhooksTemplateHelp.variable.subject'
    ),
    variable: '{{.subject}}',
  },
  {
    name: i18n.t(
      'auditPlan.subscribeNotice.form.webhooksTemplateHelp.variable.body'
    ),
    variable: '{{.body}}',
  },
];
