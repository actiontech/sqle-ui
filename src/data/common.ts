export enum ResponseCode {
  SUCCESS = 0,

  // sql analyze
  NotSupportDML = 8001,
}

export enum CharCode {
  a = 97,
  z = 122,
  A = 65,
  Z = 90,
}

export enum SystemRole {
  admin = 'admin',
}

export enum ModalSize {
  big = 1000,
  mid = 800,
}

export const RuleListDefaultTabKey = 'ALL';
export const instanceListDefaultKey = 'all';
export const ruleTemplateListDefaultKey = 'all';

export const ModalFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13 },
  },
};

export const PageFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

export const PageBigFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    // md: { span: 1 },
  },
};

export const FilterFormLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

export const FilterFormColLayout = {
  xs: 24,
  sm: 12,
  xl: 8,
  xxl: 6,
};

export const filterFormButtonLayoutFactory = (
  smOffset = 0,
  xlOffset = 0,
  xxlOffset = 0
) => ({
  xs: 24,
  sm: {
    span: 12,
    offset: smOffset,
  },
  xl: {
    span: 8,
    offset: xlOffset,
  },
  xxl: {
    span: 6,
    offset: xxlOffset,
  },
});

export const FilterFormRowLayout = {
  gutter: 24,
};

export enum LoginTypeEnum {
  'ldap' = 'ldap',
  'sqle' = 'sqle',
}

export enum ManagementPermissionsEnum {
  Create_Project = 1,
}

export const SQLE_INSTANCE_SOURCE_NAME = 'SQLE';

export const SQLE_REDIRECT_KEY_PARAMS_NAME = 'target';

export const SQLE_COOKIE_TOKEN_KEY_NAME = 'sqle-token';

export const OPEN_CLOUD_BEAVER_URL_PARAM_NAME = 'open_cloud_beaver';

export const SQLE_DEFAULT_WEB_TITLE = 'Action SQLE';
