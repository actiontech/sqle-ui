import { useBoolean } from 'ahooks';
import { Button, Card, Col, Modal, Result, Row, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import instance from '../../../api/instance';
import BackButton from '../../../components/BackButton';
import { PageFormLayout, ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import DataSourceForm from '../DataSourceForm';

const AddDataSource = () => {
  const { t } = useTranslation();
  const [form] = useForm();

  const [loading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] =
    useBoolean();
  const [visible, { setTrue: openResultModal, setFalse: closeResultModal }] =
    useBoolean();

  const addDatabase = React.useCallback(async () => {
    const values = await form.validateFields();
    setLoadingTrue();
    instance
      .createInstanceV1({
        db_host: values.ip,
        db_password: values.password,
        db_port: `${values.port}`,
        db_user: values.user,
        db_type: values.type,
        desc: values.describe,
        instance_name: values.name,
        role_name_list: values.role,
        rule_template_name_list: Array.isArray(values.ruleTemplate)
          ? values.ruleTemplate
          : [values.ruleTemplate],
        workflow_template_name: values.workflow,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          openResultModal();
        }
      })
      .finally(() => {
        setLoadingFalse();
      });
  }, [form, openResultModal, setLoadingFalse, setLoadingTrue]);

  const resetAndCloseResultModal = React.useCallback(() => {
    form.resetFields();
    closeResultModal();
    EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
  }, [closeResultModal, form]);

  const reset = React.useCallback(() => {
    EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
    form.resetFields();
  }, [form]);

  return (
    <Card
      title={t('dataSource.addDatabase')}
      extra={[<BackButton key="goBack" />]}
    >
      <DataSourceForm form={form} />
      <Row>
        <Col
          xs={{ offset: 24 - PageFormLayout.labelCol.xs.span }}
          sm={{ offset: PageFormLayout.labelCol.sm.span }}
        >
          <Space>
            <Button onClick={reset}>{t('common.reset')}</Button>
            <Button type="primary" onClick={addDatabase} loading={loading}>
              {t('common.submit')}
            </Button>
          </Space>
        </Col>
      </Row>
      <Modal
        title={t('common.operateSuccess')}
        footer={null}
        closable={false}
        visible={visible}
      >
        <Result
          status="success"
          title={t('dataSource.addDatabaseSuccess')}
          subTitle={
            <Link to="/data">
              {t('dataSource.addDatabaseSuccessGuide')} {'>'}
            </Link>
          }
          extra={[
            <Button key="close" onClick={closeResultModal}>
              {t('common.close')}
            </Button>,
            <Button
              type="primary"
              key="resetAndClose"
              onClick={resetAndCloseResultModal}
            >
              {t('common.resetAndClose')}
            </Button>,
          ]}
        />
      </Modal>
    </Card>
  );
};

export default AddDataSource;
