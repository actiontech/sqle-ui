import { useBoolean } from 'ahooks';
import { Card, Button, message, Empty, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { IInstanceResV1 } from '../../../api/common';
import instance from '../../../api/instance';
import { IUpdateInstanceV1Params } from '../../../api/instance/index.d';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import DataSourceForm from '../DataSourceForm';
import { DataSourceFormField } from '../DataSourceForm/index.type';
import { turnCommonToDataSourceParams } from '../tool';
import { UpdateDataSourceUrlParams } from './index.type';

const UpdateDataSource = () => {
  const { t } = useTranslation();
  const [form] = useForm<DataSourceFormField>();
  const history = useHistory();
  const urlParams = useParams<UpdateDataSourceUrlParams>();

  const [initError, setInitError] = React.useState('');
  const [retryLoading, { toggle: setRetryLoading }] = useBoolean(false);
  const [instanceInfo, setInstanceInfo] = useState<IInstanceResV1>();

  const updateDatabase = async (values: DataSourceFormField) => {
    const params: IUpdateInstanceV1Params = {
      db_type: values.type,
      db_host: values.ip,
      db_port: `${values.port}`,
      db_user: values.user,
      desc: values.describe,
      instance_name: values.name,
      role_name_list: values.role,
      rule_template_name_list: values.ruleTemplate ? [values.ruleTemplate] : [],
      workflow_template_name: values.workflow,
      additional_params: turnCommonToDataSourceParams(values.asyncParams ?? []),
    };
    if (!!values.password) {
      params.db_password = values.password;
    }
    return instance.updateInstanceV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(
          t('dataSource.updateDatabase.updateDatabaseSuccess', {
            name: values.name,
          })
        );
        history.replace('/data');
      }
    });
  };

  const getInstanceInfo = React.useCallback(() => {
    setRetryLoading(true);
    instance
      .getInstanceV1({ instance_name: urlParams.instanceName })
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
  }, [setRetryLoading, t, urlParams.instanceName]);

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
        <DataSourceForm
          form={form}
          defaultData={instanceInfo}
          submit={updateDatabase}
        />
      </EmptyBox>
    </Card>
  );
};

export default UpdateDataSource;
