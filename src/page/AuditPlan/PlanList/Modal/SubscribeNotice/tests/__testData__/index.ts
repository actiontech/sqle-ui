export const auditPlanSubscribeNoticeConfig = {
  enable_email_notify: true,
  enable_web_hook_notify: true,
  notify_interval: 6,
  notify_level: 'error',
  web_hook_template:
    '{\n            "msg_type": "text2",\n            "bbb": {\n               "aaa":"{{.subject}} \\n {{.body}}"\n            }\n          }',
  web_hook_url: 'prospero://kdmgujzl.tw/kgkredqxr',
};
