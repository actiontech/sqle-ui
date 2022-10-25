import { useBoolean } from 'ahooks';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Switch,
  Tooltip,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import audit_plan from '../../../../../api/audit_plan';
import { IUpdateAuditPlanNotifyConfigV1Params } from '../../../../../api/audit_plan/index.d';
import { IAuditPlanResV1 } from '../../../../../api/common';
import { UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum } from '../../../../../api/common.enum';
import EmptyBox from '../../../../../components/EmptyBox';
import IconTipsLabel from '../../../../../components/IconTipsLabel';
import {
  ModalFormLayout,
  ModalSize,
  ResponseCode,
} from '../../../../../data/common';
import { ModalName } from '../../../../../data/ModalName';
import useChangeTheme from '../../../../../hooks/useChangeTheme';
import useStaticStatus from '../../../../../hooks/useStaticStatus';
import { IReduxState } from '../../../../../store';
import {
  updateAuditPlanModalStatus,
  updateSelectAuditPlan,
} from '../../../../../store/auditPlan';
import useStyles from '../../../../../theme';
import { webhooksTemplateDefault } from './index.data';
import { SubscribeNoticeFormFields } from './index.type';
import WebhooksTemplateHelp from './WebhooksTemplateHelp';

const SubscribeNotice = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { currentEditorTheme } = useChangeTheme();
  const [form] = useForm<SubscribeNoticeFormFields>();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.auditPlan.modalStatus[ModalName.Subscribe_Notice]
  );

  const currentAuditPlan = useSelector<IReduxState, IAuditPlanResV1 | null>(
    (state) => state.auditPlan.selectAuditPlan
  );

  const dispatch = useDispatch();

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateAuditPlanModalStatus({
        modalName: ModalName.Subscribe_Notice,
        status: false,
      })
    );
    dispatch(updateSelectAuditPlan(null));
    setTimeout(() => {
      toggleWebhooksEnable(false);
    }, 300);
  };

  const { getRuleLevelStatusSelectOption } = useStaticStatus();

  const [webhooksEnable, { toggle: toggleWebhooksEnable }] = useBoolean();

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const submit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: IUpdateAuditPlanNotifyConfigV1Params = {
      audit_plan_name: currentAuditPlan?.audit_plan_name ?? '',
      enable_email_notify: values.emailEnable,
      enable_web_hook_notify: values.webhooksEnable,
      notify_interval: values.interval,
      notify_level: values.level,
    };
    if (values.webhooksEnable) {
      params.web_hook_url = values.webhooksUrl;
      params.web_hook_template = values.template;
    }
    audit_plan
      .updateAuditPlanNotifyConfigV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          closeModal();
          message.success(
            t('auditPlan.subscribeNotice.form.subscribeNoticeSuccess')
          );
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const testLoading = useRef(false);
  const test = async () => {
    if (testLoading.current) {
      return;
    }
    const hide = message.loading(
      t('auditPlan.subscribeNotice.form.testLoading', {
        name: currentAuditPlan?.audit_plan_name ?? '',
      })
    );
    testLoading.current = true;
    try {
      const res = await audit_plan.testAuditPlanNotifyConfigV1({
        audit_plan_name: currentAuditPlan?.audit_plan_name ?? '',
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        if (res.data.data?.is_notify_send_normal) {
          message.success(t('auditPlan.subscribeNotice.form.testSuccess'));
        } else {
          message.error(
            res.data.data?.send_error_message ?? t('common.unknownError')
          );
        }
      }
    } finally {
      hide();
      testLoading.current = false;
    }
  };

  const setDefaultValue = async () => {
    const response = await audit_plan.getAuditPlanNotifyConfigV1({
      audit_plan_name: currentAuditPlan?.audit_plan_name ?? '',
    });
    if (response.data.code === ResponseCode.SUCCESS) {
      const config = response.data.data;

      form.setFieldsValue({
        interval: config?.notify_interval ?? 10,
        level:
          config?.notify_level as UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum,
        emailEnable: config?.enable_email_notify,
        /* IFTRUE_isEE */
        webhooksEnable: config?.enable_web_hook_notify,
        webhooksUrl: config?.web_hook_url,
        template: config?.web_hook_template,
        /* FITRUE_isEE */
      });
      if (config?.enable_web_hook_notify) {
        toggleWebhooksEnable(true);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      setDefaultValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const resetTemplate = () => {
    form.resetFields(['template']);
  };

  return (
    <Modal
      visible={visible}
      forceRender
      closable={false}
      width={webhooksEnable ? ModalSize.big : undefined}
      footer={
        <>
          <Button onClick={closeModal} disabled={submitLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
      title={t('auditPlan.subscribeNotice.title')}
    >
      <Form {...ModalFormLayout} form={form}>
        <Form.Item
          name="interval"
          label={
            <IconTipsLabel
              tips={t('auditPlan.subscribeNotice.form.intervalTips')}
            >
              {t('auditPlan.subscribeNotice.form.interval')}
            </IconTipsLabel>
          }
          rules={[
            {
              required: true,
            },
            {
              type: 'number',
            },
          ]}
          initialValue={10}
        >
          <InputNumber min={0} max={99999} />
        </Form.Item>
        <Form.Item
          label={
            <IconTipsLabel tips={t('auditPlan.subscribeNotice.form.levelTips')}>
              {t('auditPlan.subscribeNotice.form.level')}
            </IconTipsLabel>
          }
          name="level"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('auditPlan.subscribeNotice.form.level'),
              }),
            },
          ]}
        >
          <Select>{getRuleLevelStatusSelectOption()}</Select>
        </Form.Item>
        <Form.Item
          label={
            <IconTipsLabel
              tips={t('auditPlan.subscribeNotice.form.emailEnableTips')}
            >
              {t('auditPlan.subscribeNotice.form.emailEnable')}
            </IconTipsLabel>
          }
          name="emailEnable"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label={t('auditPlan.subscribeNotice.form.webhooksEnable')}
          name="webhooksEnable"
          valuePropName="checked"
        >
          {/* IFTRUE_isEE */}
          {<Switch onChange={toggleWebhooksEnable} />}
          {/* FITRUE_isEE */}
          {/* IFTRUE_isCE */}
          {t('auditPlan.subscribeNotice.form.webhooksEnableCe')}
          {/* FITRUE_isCE */}
        </Form.Item>
        <EmptyBox if={webhooksEnable}>
          <Form.Item
            name="webhooksUrl"
            label={t('auditPlan.subscribeNotice.form.webhooksUrl')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="template"
            rules={[
              {
                required: true,
              },
            ]}
            label={t('auditPlan.subscribeNotice.form.webhooksTemplate')}
            wrapperCol={{
              ...ModalFormLayout.wrapperCol,
              className: styles.editor,
            }}
            initialValue={webhooksTemplateDefault}
            help={<WebhooksTemplateHelp resetTemplate={resetTemplate} />}
          >
            <MonacoEditor
              theme={currentEditorTheme}
              width="100%"
              height="200"
              language="json"
            />
          </Form.Item>
        </EmptyBox>
        <Form.Item label=" " colon={false} style={{ marginTop: 10 }}>
          <Tooltip overlay={t('auditPlan.subscribeNotice.form.testTips')}>
            <Button onClick={test} data-testid="testMessage">
              {t('auditPlan.subscribeNotice.form.test')}
            </Button>
          </Tooltip>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubscribeNotice;
