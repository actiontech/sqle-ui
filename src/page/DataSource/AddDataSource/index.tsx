import { useBoolean } from 'ahooks';
import { Button, Card, Modal, Result } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import instance from '../../../api/instance';
import BackButton from '../../../components/BackButton';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import DataSourceForm from '../DataSourceForm';
import { DataSourceFormField } from '../DataSourceForm/index.type';
import { turnCommonToDataSourceParams } from '../tool';

const AddDataSource = () => {
  const { t } = useTranslation();
  const [form] = useForm<DataSourceFormField>();

  const [visible, { setTrue: openResultModal, setFalse: closeResultModal }] =
    useBoolean();

  const addDatabase = async (values: DataSourceFormField) => {
    return instance
      .createInstanceV1({
        db_host: values.ip,
        db_password: values.password,
        db_port: `${values.port}`,
        db_user: values.user,
        db_type: values.type,
        desc: values.describe,
        instance_name: values.name,
        role_name_list: values.role,
        rule_template_name_list: values.ruleTemplate
          ? [values.ruleTemplate]
          : [],
        workflow_template_name: values.workflow,
        additional_params: turnCommonToDataSourceParams(
          values.asyncParams ?? []
        ),
        maintenance_times:
          values.maintenanceTime?.map((t) => ({
            maintenance_start_time: t.startTime,
            maintenance_stop_time: t.endTime,
          })) ?? [],
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          openResultModal();
        }
      });
  };

  const resetAndCloseResultModal = React.useCallback(() => {
    form.resetFields();
    closeResultModal();
    EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
  }, [closeResultModal, form]);

  return (
    <Card
      title={t('dataSource.addDatabase')}
      extra={[<BackButton key="goBack" />]}
    >
      <DataSourceForm form={form} submit={addDatabase} />
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
