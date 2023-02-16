import { useBoolean } from 'ahooks';
import { Card, Button, message, Empty, Typography, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { IInstanceResV1 } from '../../../api/common';
import instance from '../../../api/instance';
import { IUpdateInstanceV1Params } from '../../../api/instance/index.d';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode, SQLE_INSTANCE_SOURCE_NAME } from '../../../data/common';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import DataSourceForm from '../DataSourceForm';
import { DataSourceFormField } from '../DataSourceForm/index.type';
import { turnCommonToDataSourceParams } from '../tool';
import { UpdateDataSourceUrlParams } from './index.type';

const UpdateDataSource = () => {
  const { t } = useTranslation();
  const [form] = useForm<DataSourceFormField>();
  const history = useHistory();
  const urlParams = useParams<UpdateDataSourceUrlParams>();
  const { projectName } = useCurrentProjectName();
  const [initError, setInitError] = React.useState('');
  const [retryLoading, { toggle: setRetryLoading }] = useBoolean(false);
  const [instanceInfo, setInstanceInfo] = useState<IInstanceResV1>();

  const updateDatabase = async (values: DataSourceFormField) => {
    const params: IUpdateInstanceV1Params = {
      project_name: projectName,
      instance_name: values.name,
      rule_template_name: values.ruleTemplate ?? '',
      additional_params: turnCommonToDataSourceParams(values.asyncParams ?? []),
      maintenance_times:
        values.maintenanceTime?.map((t) => ({
          maintenance_start_time: t.startTime,
          maintenance_stop_time: t.endTime,
        })) ?? [],
      sql_query_config: {
        audit_enabled: values.needAuditForSqlQuery,
        allow_query_when_less_than_audit_level:
          values.allowQueryWhenLessThanAuditLevel,
      },
    };

    if (!!values.password) {
      params.db_password = values.password;
    }
    if (instanceInfo?.source === SQLE_INSTANCE_SOURCE_NAME) {
      params.db_type = values.type;
      params.db_host = values.ip;
      params.db_port = `${values.port}`;
      params.db_user = values.user;
      params.desc = values.describe;
    }
    return instance.updateInstanceV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(
          t('dataSource.updateDatabase.updateDatabaseSuccess', {
            name: values.name,
          })
        );
        history.replace(`/project/${projectName}/data`);
      }
    });
  };

  const getInstanceInfo = React.useCallback(() => {
    setRetryLoading(true);
    instance
      .getInstanceV1({
        instance_name: urlParams.instanceName,
        project_name: projectName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const instance = res.data.data;
          setInstanceInfo(instance);
          setInitError('');
        } else {
          setInitError(res.data.message ?? t('common.unknownError'));
        }
      })
      .finally(() => {
        setRetryLoading(false);
      });
  }, [projectName, setRetryLoading, t, urlParams.instanceName]);

  React.useEffect(() => {
    getInstanceInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      title={t('dataSource.updateDatabase.updateDatabaseTitle')}
      extra={[<BackButton key="goBack" />]}
    >
      <EmptyBox
        if={!initError}
        defaultNode={
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <Typography.Text type="danger">
                {t('dataSource.updateDatabase.getDatabaseInfoError')}:{' '}
                {initError}
              </Typography.Text>
            }
          >
            <Button
              type="primary"
              onClick={getInstanceInfo}
              loading={retryLoading}
            >
              {t('common.retry')}
            </Button>
          </Empty>
        }
      >
        <Spin spinning={retryLoading}>
          <DataSourceForm
            form={form}
            defaultData={instanceInfo}
            submit={updateDatabase}
            projectName={projectName}
          />
        </Spin>
      </EmptyBox>
    </Card>
  );
};

export default UpdateDataSource;
