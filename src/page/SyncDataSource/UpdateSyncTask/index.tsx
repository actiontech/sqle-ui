import { Button, Card, Empty, message, Spin, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { IInstanceTaskDetailResV1 } from '../../../api/common';
import sync_instance from '../../../api/sync_instance';
import { IUpdateSyncInstanceTaskV1Params } from '../../../api/sync_instance/index.d';
import BackButton from '../../../components/BackButton';
import EmptyBox from '../../../components/EmptyBox';
import { ResponseCode } from '../../../data/common';
import useNavigate from '../../../hooks/useNavigate';
import SyncTaskForm, { SyncTaskFormFields } from '../SyncTaskForm';

const UpdateSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<SyncTaskFormFields>();
  const { taskId } = useParams<{ taskId: string }>();
  const [initError, setInitError] = useState('');
  const navigate = useNavigate();
  const [retryLoading, setRetryLoading] = useState(false);
  const [finishGetSyncInstanceTask, setFinishGetSyncInstanceTask] =
    useState(false);
  const [syncInstanceTask, setSyncInstanceTask] = useState<
    IInstanceTaskDetailResV1 | undefined
  >();

  const submit = (values: SyncTaskFormFields) => {
    const params: IUpdateSyncInstanceTaskV1Params = {
      task_id: taskId ?? '',
      global_rule_template: values.ruleTemplateName,
      sync_instance_interval: values.syncInterval,
      url: values.url,
      version: values.version,
    };
    return sync_instance.updateSyncInstanceTaskV1(params).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        message.success(t('syncDataSource.updateSyncTask.successTips'));
        navigate(`syncDataSource`, { replace: true });
      }
    });
  };
  const getSyncInstanceTask = useCallback(() => {
    setRetryLoading(true);
    sync_instance
      .GetSyncInstanceTask({ task_id: taskId ?? '' })
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
        setFinishGetSyncInstanceTask(true);
      });
  }, [setFinishGetSyncInstanceTask, setRetryLoading, t, taskId]);

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
        <EmptyBox
          if={finishGetSyncInstanceTask}
          defaultNode={<Spin delay={400} />}
        >
          <SyncTaskForm
            defaultValue={syncInstanceTask}
            submit={submit}
            form={form}
          />
        </EmptyBox>
      </EmptyBox>
    </Card>
  );
};

export default UpdateSyncTask;
