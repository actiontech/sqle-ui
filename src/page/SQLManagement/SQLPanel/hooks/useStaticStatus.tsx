import { SelectProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StaticEnumDictionary } from '../../../../hooks/useStaticStatus/index.type';
import {
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterStatusEnum,
} from '../../../../api/SqlManage/index.enum';

export const sourceDictionary: StaticEnumDictionary<GetSqlManageListFilterSourceEnum> =
  {
    [GetSqlManageListFilterSourceEnum.sql_audit_record]:
      'sqlManagement.selectDictionary.apiAudit',
    [GetSqlManageListFilterSourceEnum.audit_plan]:
      'sqlManagement.selectDictionary.auditPlan',
  };

export const auditLevelDictionary: StaticEnumDictionary<GetSqlManageListFilterAuditLevelEnum> =
  {
    [GetSqlManageListFilterAuditLevelEnum.normal]:
      'sqlManagement.selectDictionary.normal',
    [GetSqlManageListFilterAuditLevelEnum.notice]:
      'sqlManagement.selectDictionary.notice',
    [GetSqlManageListFilterAuditLevelEnum.warn]:
      'sqlManagement.selectDictionary.warn',
    [GetSqlManageListFilterAuditLevelEnum.error]:
      'sqlManagement.selectDictionary.error',
  };

export const statusDictionary: StaticEnumDictionary<GetSqlManageListFilterStatusEnum> =
  {
    [GetSqlManageListFilterStatusEnum.unhandled]:
      'sqlManagement.selectDictionary.unhandled',
    [GetSqlManageListFilterStatusEnum.solved]:
      'sqlManagement.selectDictionary.solved',
    [GetSqlManageListFilterStatusEnum.ignored]:
      'sqlManagement.selectDictionary.ignored',
  };

const useStaticStatus = () => {
  const { t } = useTranslation();

  const generateSourceSelectOptions: SelectProps['options'] = useMemo(() => {
    return Object.keys(sourceDictionary).map((key) => ({
      label: t(
        sourceDictionary[key as keyof typeof GetSqlManageListFilterSourceEnum]
      ),
      value: key,
    }));
  }, [t]);

  const generateAuditLevelSelectOptions: SelectProps['options'] =
    useMemo(() => {
      return Object.keys(auditLevelDictionary).map((key) => ({
        label: t(
          auditLevelDictionary[
            key as keyof typeof GetSqlManageListFilterAuditLevelEnum
          ]
        ),
        value: key,
      }));
    }, [t]);

  const generateStatusSelectOptions: SelectProps['options'] = useMemo(() => {
    return Object.keys(statusDictionary).map((key) => ({
      label: t(
        statusDictionary[key as keyof typeof GetSqlManageListFilterStatusEnum]
      ),
      value: key,
    }));
  }, [t]);
  return {
    generateSourceSelectOptions,
    generateAuditLevelSelectOptions,
    generateStatusSelectOptions,
  };
};

export default useStaticStatus;
