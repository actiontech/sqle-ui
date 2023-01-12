import { useBoolean } from 'ahooks';
import moment from 'moment';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Timeline,
  Tag,
  Popconfirm,
  Alert,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../../components/EmptyBox';
import { ModalFormLayout } from '../../../../data/common';
import { timeAddZero } from '../../../../utils/Common';
import { OrderStepsProps } from './index.type';
import { checkTimeInWithMaintenanceTime } from './utils';
import { useGenerateOrderStepInfo } from './useGenerateOrderStepInfo';

const OrderSteps: React.FC<OrderStepsProps> = (props) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [rejectStepId, setRejectStepId] = useState(0);

  const [
    rejectModalVisible,
    { setTrue: openRejectModal, setFalse: closeRejectModal },
  ] = useBoolean();

  const [passLoading, { setTrue: passStart, setFalse: passFinish }] =
    useBoolean();
  const [rejectLoading, { setTrue: rejectStart, setFalse: rejectFinish }] =
    useBoolean();

  const [
    executingLoading,
    { setTrue: executingStart, setFalse: executingFinish },
  ] = useBoolean();

  const [
    completeLoading,
    { setTrue: completeStart, setFalse: completeFinish },
  ] = useBoolean();

  const {
    generateStepTypeString,
    generateActionNode,
    generateTimeLineIcon,
    generateOperateInfo,
  } = useGenerateOrderStepInfo(props);

  const pass = (stepId: number) => {
    passStart();
    props.pass(stepId).finally(passFinish);
  };

  const handleClickRejectButton = (stepId: number) => {
    openRejectModal();
    setRejectStepId(stepId);
  };

  const reject = (values: { reason: string }) => {
    rejectStart();
    props.reject(values.reason, rejectStepId).finally(() => {
      rejectFinish();
      resetAndCloseRejectModal();
      setRejectStepId(0);
    });
  };

  const resetAndCloseRejectModal = () => {
    form.resetFields();
    closeRejectModal();
  };

  const executing = () => {
    executingStart();
    props.executing().finally(() => {
      executingFinish();
    });
  };

  const complete = () => {
    completeStart();
    props.complete().finally(() => {
      completeFinish();
    });
  };

  const checkInTimeWithMaintenanceTimeInfo = (time: moment.Moment) => {
    return props.maintenanceTimeInfo?.every((v) =>
      checkTimeInWithMaintenanceTime(time, v.maintenanceTime)
    );
  };

  const batchSqlExecuteNode = (
    <Popconfirm
      title={t('order.operator.batchSqlExecuteConfirmTips')}
      onConfirm={executing}
      disabled={
        executingLoading || !checkInTimeWithMaintenanceTimeInfo(moment())
      }
      overlayClassName="popconfirm-small"
      placement="topRight"
      okText={t('common.ok')}
    >
      <Button
        type="primary"
        loading={executingLoading}
        disabled={!checkInTimeWithMaintenanceTimeInfo(moment())}
      >
        {t('order.operator.batchSqlExecute')}
      </Button>
    </Popconfirm>
  );

  const finishNode = (
    <Popconfirm
      title={t('order.operator.markManuallyConfirmTips')}
      onConfirm={complete}
      disabled={
        completeLoading || !checkInTimeWithMaintenanceTimeInfo(moment())
      }
      overlayClassName="popconfirm-small"
      placement="topRight"
      okText={t('common.ok')}
    >
      <Button
        loading={completeLoading}
        type="primary"
        disabled={!checkInTimeWithMaintenanceTimeInfo(moment())}
      >
        {t('order.operator.markManually')}
      </Button>
    </Popconfirm>
  );

  const maintenanceTimeInfoNode = (
    <EmptyBox if={!checkInTimeWithMaintenanceTimeInfo(moment())}>
      <div>
        {t('order.operator.sqlExecuteDisableTips')}
        {': '}
        <EmptyBox
          if={props.maintenanceTimeInfo?.some(
            (v) => v.maintenanceTime.length > 0
          )}
          defaultNode={t('order.operator.emptyMaintenanceTime')}
        >
          {props.maintenanceTimeInfo?.map((item, i) => (
            <Space key={i}>
              <EmptyBox if={item.maintenanceTime.length > 0}>
                <div>
                  {item.instanceName}
                  {': '}
                  {item.maintenanceTime.map((time) => (
                    <Tag key={i}>
                      {timeAddZero(time.maintenance_start_time?.hour ?? 0)}:
                      {timeAddZero(time.maintenance_start_time?.minute ?? 0)}-
                      {timeAddZero(time.maintenance_stop_time?.hour ?? 0)}:
                      {timeAddZero(time.maintenance_stop_time?.minute ?? 0)}
                    </Tag>
                  ))}
                </div>
              </EmptyBox>
            </Space>
          ))}
        </EmptyBox>
      </div>
    </EmptyBox>
  );

  const modifySqlNode = (
    <Button type="primary" onClick={props.modifySql}>
      {t('order.operator.modifySql')}
    </Button>
  );

  return (
    <>
      <Timeline>
        {props.stepList.map((step) => {
          const sqlReviewNode = (
            <Button
              type="primary"
              onClick={pass.bind(null, step.workflow_step_id ?? 0)}
              loading={passLoading}
            >
              {t('order.operator.sqlReview')}
            </Button>
          );

          const rejectFullNode = (
            <Button
              onClick={handleClickRejectButton.bind(
                null,
                step.workflow_step_id ?? 0
              )}
              danger
            >
              {t('order.operator.rejectFull')}
            </Button>
          );

          const actionNode = generateActionNode(step, {
            modifySqlNode,
            sqlReviewNode,
            batchSqlExecuteNode,
            rejectFullNode,
            maintenanceTimeInfoNode,
            finishNode,
          });

          const operateInfoNode = generateOperateInfo(step);

          const { color, icon } = generateTimeLineIcon(step);

          return (
            <Timeline.Item
              key={step.workflow_step_id || step.operation_time}
              dot={icon}
              color={color}
            >
              <Row>
                <Col span={3}>{generateStepTypeString(step.type)}</Col>
                <Col span={8}>{actionNode}</Col>
                <Col span={13}>{operateInfoNode}</Col>
              </Row>
            </Timeline.Item>
          );
        })}
      </Timeline>
      <Modal
        title={t('order.operator.reject')}
        visible={rejectModalVisible}
        closable={false}
        footer={null}
      >
        <>
          <Alert
            style={{ marginBottom: 24 }}
            message={t('order.operator.rejectAllTips')}
            type="warning"
          />

          <Form {...ModalFormLayout} form={form} onFinish={reject}>
            <Form.Item
              label={t('order.operator.rejectReason')}
              name="reason"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea
                placeholder={t('common.form.placeholder.input')}
              />
            </Form.Item>
            <Form.Item label=" " colon={false}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={rejectLoading}
                >
                  {t('order.operator.reject')}
                </Button>
                <Button onClick={resetAndCloseRejectModal}>
                  {t('common.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default OrderSteps;
