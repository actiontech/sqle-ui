import { useBoolean } from 'ahooks';
import { Alert, Button, Modal, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AuditTaskResV1SqlSourceEnum } from '../../../../../api/common.enum';
import task from '../../../../../api/task';
import { ICreateAndAuditTaskV1Params } from '../../../../../api/task/index.d';
import { ModalSize, ResponseCode } from '../../../../../data/common';
import { SQLInputType } from '../../../Create/SqlInfoForm';
import { ModifySqlModalProps } from './index.type';
import ModifySqlForm from './ModifySqlForm';
import { ModifySqlFormFields } from './ModifySqlForm/index.type';

const ModifySqlModal: React.FC<ModifySqlModalProps> = (props) => {
  const { t } = useTranslation();
  const [form] = useForm<ModifySqlFormFields>();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const submit = React.useCallback(async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: ICreateAndAuditTaskV1Params = {
      instance_name: props.currentOrderTask?.instance_name ?? '',
    };
    if (props.currentOrderTask?.instance_schema) {
      params.instance_schema = props.currentOrderTask?.instance_schema;
    }
    if (values.sqlInputType === SQLInputType.manualInput) {
      params.sql = values.sql;
    } else if (values.sqlInputType === SQLInputType.uploadFile) {
      params.input_sql_file = values.sqlFile?.[0];
    }
    task
      .createAndAuditTaskV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS && res.data.data) {
          props.submit(res.data.data);
        }
      })
      .finally(() => {
        submitFinish();
      });
  }, [form, props, startSubmit, submitFinish]);

  React.useEffect(() => {
    if (
      props.visible &&
      props.currentOrderTask?.sql_source ===
        AuditTaskResV1SqlSourceEnum.form_data
    ) {
      task
        .getAuditTaskSQLContentV1({
          task_id: `${props.currentOrderTask.task_id}`,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            form.setFieldsValue({
              sql: res.data.data?.sql,
            });
          }
        });
    }
  }, [form, props.currentOrderTask, props.visible]);

  return (
    <Modal
      title={t('order.modifySql.title')}
      width={ModalSize.big}
      visible={props.visible}
      closable={false}
      footer={
        <Space>
          <Alert message={t('order.modifySql.submitTips')} type="warning" />
          <Button onClick={props.cancel} disabled={submitLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </Button>
        </Space>
      }
    >
      <ModifySqlForm form={form} />
    </Modal>
  );
};

export default ModifySqlModal;
