import { useBoolean } from 'ahooks';
import {
  Card,
  Row,
  Col,
  Space,
  Button,
  message,
  Empty,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import instance from '../../../api/instance';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import DataSourceForm from '../DataSourceForm';
import { DataSourceFormField } from '../DataSourceForm/index.type';
import { UpdateDataSourceUrlParams } from './index.type';

const UpdateDataSource = () => {
  const { t } = useTranslation();
  const [form] = useForm<DataSourceFormField>();
  const history = useHistory();
  const urlParams = useParams<UpdateDataSourceUrlParams>();

  const [initError, setInitError] = React.useState('');
  const [retryLoading, { toggle: setRetryLoading }] = useBoolean(false);

  const [
    loading,
    { setTrue: setLoadingTrue, setFalse: setLoadingFalse },
  ] = useBoolean();

  const updateDatabase = React.useCallback(async () => {
    const values = await form.validateFields();
    setLoadingTrue();
    instance
      .updateInstanceV1({
        db_host: values.ip,
        db_password: values.password,
        db_port: `${values.port}`,
        db_user: values.user,
        desc: values.describe,
        instance_name: values.name,
        role_name_list: values.role,
        rule_template_name_list: values.ruleTemplate,
        workflow_template_name: values.workflow,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('dataSource.updateDatabase.updateDatabaseSuccess', {
              name: values.name,
            })
          );
          history.replace('/data');
        }
      })
      .finally(() => {
        setLoadingFalse();
      });
  }, [form, history, setLoadingFalse, setLoadingTrue, t]);

  const getInstanceInfo = React.useCallback(() => {
    setRetryLoading(true);
    instance
      .getInstanceV1({ instance_name: urlParams.instanceName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const instance = res.data.data;
          form.setFieldsValue({
            name: instance?.instance_name,
            describe: instance?.desc,
            ip: instance?.db_host,
            port: Number.parseInt(instance?.db_port ?? '3306'),
            user: instance?.db_user,
            role: instance?.role_name_list,
            ruleTemplate: instance?.rule_template_name_list,
            workflow: instance?.workflow_template_name,
          });
          setInitError('');
        } else {
          setInitError(res.data.message ?? t('common.unknownError'));
        }
      })
      .finally(() => {
        setRetryLoading(false);
      });
  }, [form, setRetryLoading, t, urlParams.instanceName]);

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
        <DataSourceForm form={form} isUpdate={true} />
        <Row>
          <Col xs={{ offset: 0 }} sm={{ offset: 7 }}>
            <Space>
              <Button type="primary" onClick={updateDatabase} loading={loading}>
                {t('common.submit')}
              </Button>
            </Space>
          </Col>
        </Row>
      </EmptyBox>
    </Card>
  );
};

export default UpdateDataSource;
