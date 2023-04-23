import { useBoolean } from 'ahooks';
import { Button, Card, Modal, Result } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import sync_instance from '../../../api/sync_instance';
import { ICreateSyncInstanceTaskV1Params } from '../../../api/sync_instance/index.d';
import BackButton from '../../../components/BackButton';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import SyncTaskForm, { SyncTaskFormFields } from '../SyncTaskForm';
import { Link } from '../../../components/Link';

const AddSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<SyncTaskFormFields>();
  const [
    resultModalVisibility,
    { setTrue: openResultModal, setFalse: closeResultModal },
  ] = useBoolean();

  const submit = (values: SyncTaskFormFields) => {
    const params: ICreateSyncInstanceTaskV1Params = {
      db_type: values.instanceType,
      global_rule_template: values.ruleTemplateName,
      source: values.source,
      sync_instance_interval: values.syncInterval,
      url: values.url,
      version: values.version,
    };
    return sync_instance.createSyncInstanceTaskV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        openResultModal();
      }
    });
  };

  const resetAndCloseResultModal = useCallback(() => {
    closeResultModal();
    form.resetFields();
    EventEmitter.emit(EmitterKey.Refresh_Sync_Task_Rule_Template_Tips);
  }, [closeResultModal, form]);

  return (
    <Card
      title={t('syncDataSource.addSyncTask.title')}
      extra={[<BackButton key="goBack" />]}
    >
      <SyncTaskForm submit={submit} form={form} />

      <Modal
        title={t('common.operateSuccess')}
        footer={null}
        closable={false}
        open={resultModalVisibility}
      >
        <Result
          status="success"
          title={t('syncDataSource.addSyncTask.successTips')}
          subTitle={
            <Link to={`syncDataSource`}>
              {t('syncDataSource.addSyncTask.successGuide')} {'>'}
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

export default AddSyncTask;
