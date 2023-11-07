import { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import { Button, Card, PageHeader, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import BaseInfoForm from './BaseInfoForm';
import { useForm } from 'antd/lib/form/Form';
import {
  BaseInfoFormFields,
  BaseInfoFormRef,
  SQLInfoFormFields,
  SQLInfoFormProps,
  SQLInfoFormRef,
} from './index.type';
import SQLInfoForm from './SQLInfoForm';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import AuditResult from '../../Order/AuditResult';
import sql_audit_record from '../../../api/sql_audit_record';
import { ICreateSQLAuditRecordV1Params } from '../../../api/sql_audit_record/index.d';
import { useRef, useState } from 'react';
import { IAuditTaskResV1, ISQLAuditRecordResData } from '../../../api/common';
import { ResponseCode } from '../../../data/common';
import EmptyBox from '../../../components/EmptyBox';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';
import { Link } from '../../../components/Link';

const SQLAuditCreate: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [baseForm] = useForm<BaseInfoFormFields>();
  const [sqlInfoForm] = useForm<SQLInfoFormFields>();
  const { projectName } = useCurrentProjectName();
  const [task, setTask] = useState<IAuditTaskResV1>();
  const baseRef = useRef<BaseInfoFormRef>(null);
  const sqlInfoRef = useRef<SQLInfoFormRef>(null);

  const scrollToAuditResult = () => {
    const auditResultCardElement = document.getElementById(
      'audit-result-task-card'
    );
    auditResultCardElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  const auditSQL: SQLInfoFormProps['submit'] = async (values) => {
    const baseValues = await baseForm.validateFields();
    const params: ICreateSQLAuditRecordV1Params = {
      project_name: projectName,
      sqls: values.sql,
      input_sql_file: values.sqlFile?.[0],
      input_mybatis_xml_file: values.mybatisFile?.[0],
      input_zip_file: values.zipFile?.[0],
      instance_name: values.instanceName,
      instance_schema: values.instanceSchema,
      db_type: values.dbType,
      git_http_url: values.gitHttpUrl,
      git_user_name: values.gitUserName,
      git_user_password: values.gitUserPassword,
    };

    return sql_audit_record.CreateSQLAuditRecordV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
        if ((baseValues.tags?.length ?? 0) > 0) {
          return updateTags(res.data.data, baseValues);
        } else {
          setTask(res.data.data.task);
          message.success(t('sqlAudit.create.SQLInfo.successTips'));
          scrollToAuditResult();
        }
      }
    });
  };

  const updateTags = async (
    record: ISQLAuditRecordResData,
    values: BaseInfoFormFields
  ) => {
    return sql_audit_record
      .updateSQLAuditRecordV1({
        tags: values.tags,
        sql_audit_record_id: record.sql_audit_record_id ?? '',
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setTask(record.task);
          message.success(t('sqlAudit.create.SQLInfo.successTips'));
          scrollToAuditResult();
        }
      });
  };

  const resetForm = () => {
    baseRef.current?.reset();
    sqlInfoRef.current?.reset();
    setTask(undefined);
  };

  return (
    <>
      <PageHeader title={t('sqlAudit.create.title')} ghost={false}>
        {t('sqlAudit.create.pageDesc')}
      </PageHeader>

      <section className="padding-content">
        <Space
          size={theme.common.padding}
          className="full-width-element"
          direction="vertical"
        >
          <Card title={t('sqlAudit.create.baseInfo.title')}>
            <BaseInfoForm
              ref={baseRef}
              form={baseForm}
              projectName={projectName}
            />
          </Card>
          <Card title={t('sqlAudit.create.SQLInfo.title')}>
            <SQLInfoForm
              ref={sqlInfoRef}
              form={sqlInfoForm}
              submit={auditSQL}
              projectName={projectName}
            />
          </Card>

          <EmptyBox if={typeof task?.task_id === 'number'}>
            <AuditResult
              mode="auditRecordCreate"
              projectName={projectName}
              taskId={task?.task_id}
              auditScore={task?.score}
              passRate={task?.pass_rate}
            />
          </EmptyBox>
        </Space>

        <FooterButtonWrapper>
          <Space>
            <Link to={`project/${projectName}/sqlAudit`}>
              <Button>{t('common.close')}</Button>
            </Link>
            <Button type="primary" onClick={resetForm}>
              {t('common.reset')}
            </Button>
          </Space>
        </FooterButtonWrapper>
      </section>
    </>
  );
};

export default SQLAuditCreate;
