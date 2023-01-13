import { useBoolean } from 'ahooks';
import { Button, Card, Empty, message, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { IInstanceTaskDetailResV1 } from '../../../api/common';
import sync_instance from '../../../api/sync_instance';
import { IUpdateSyncInstanceTaskV1Params } from '../../../api/sync_instance/index.d';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import SyncTaskForm, { SyncTaskFormFields } from '../SyncTaskForm';

const UpdateSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<SyncTaskFormFields>();
  const { taskId } = useParams<{ taskId: string }>();
  const [initError, setInitError] = useState('');
  const history = useHistory();
  const [retryLoading, { toggle: setRetryLoading }] = useBoolean(false);
  const [syncInstanceTask, setSyncInstanceTask] = useState<
    IInstanceTaskDetailResV1 | undefined
  >();

  const submit = (values: SyncTaskFormFields) => {
    const params: IUpdateSyncInstanceTaskV1Params = {
      task_id: taskId,
      global_rule_template: values.ruleTemplateName,
      sync_instance_interval: values.syncInterval,
      url: values.url,
      version: values.version,
    };
    return sync_instance.updateSyncInstanceTaskV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('syncDataSource.updateSyncTask.successTips'));
        history.replace(`/syncDataSource`);
      }
    });
  };
  const getSyncInstanceTask = useCallback(() => {
    setRetryLoading(true);
    sync_instance
      .GetSyncInstanceTask({ task_id: taskId })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSyncInstanceTask(res.data.data);
          setInitError('');
        } else {
          setInitError(res.data.message ?? t('common.unknownError'));
        }
      })
      .finally(() => {
        setRetryLoading(false);
      });
  }, [setRetryLoading, t, taskId]);

  useEffect(() => {
    getSyncInstanceTask();
  }, [getSyncInstanceTask]);

  return (
    <Card
      title={t('syncDataSource.updateSyncTask.title')}
      extra={[<BackButton key="goBack" />]}
    >
      <EmptyBox
        if={!initError}
        defaultNode={
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <Typography.Text type="danger">
                {t('syncDataSource.updateSyncTask.getSyncInstanceTaskError')}:{' '}
                {initError}
              </Typography.Text>
            }
          >
            <Button
              type="primary"
              onClick={getSyncInstanceTask}
              loading={retryLoading}
            >
              {t('common.retry')}
            </Button>
          </Empty>
        }
      >
        <SyncTaskForm
          defaultValue={syncInstanceTask}
          submit={submit}
          form={form}
        />
      </EmptyBox>
    </Card>
  );
};

export default UpdateSyncTask;
