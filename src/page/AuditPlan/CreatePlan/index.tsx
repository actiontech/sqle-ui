import { useBoolean } from 'ahooks';
import { Button, Card, Modal, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import audit_plan from '../../../api/audit_plan';
import BackButton from '../../../components/BackButton';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import PlanForm from '../PlanForm';
import { PlanFormField } from '../PlanForm/index.type';
import { Link } from '../../../components/Link';
import { useForm } from 'antd/lib/form/Form';

const CreateAuditPlan = () => {
  const { t } = useTranslation();
  const [visible, { setTrue: openResultModal, setFalse: closeResultModal }] =
    useBoolean();
  const { projectName } = useCurrentProjectName();
  const [form] = useForm<PlanFormField>();

  const createAuditPlan = (values: PlanFormField) => {
    return audit_plan
      .createAuditPlanV1({
        project_name: projectName,
        audit_plan_cron: values.cron,
        audit_plan_instance_database: values.schema,
        audit_plan_instance_name: values.databaseName,
        audit_plan_instance_type: values.dbType,
        audit_plan_name: values.name,
        audit_plan_type: values.auditTaskType,
        audit_plan_params: values.asyncParams,
        rule_template_name: values.ruleTemplateName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          openResultModal();
        }
      });
  };

  const resetAndCloseResultModal = () => {
    EventEmitter.emit(EmitterKey.Rest_Audit_Plan_Form);
    closeResultModal();
  };

  const clonePlan = () => {
    closeResultModal();
    form.setFieldsValue({
      name: '',
    });
  };

  return (
    <Card
      title={t('auditPlan.create.title')}
      extra={[<BackButton key="goBack" />]}
    >
      <PlanForm
        form={form}
        submit={createAuditPlan}
        projectName={projectName}
      />
      <Modal
        title={t('common.operateSuccess')}
        footer={null}
        closable={false}
        open={visible}
      >
        <Result
          status="success"
          title={t('auditPlan.create.successTitle')}
          subTitle={
            <Link
              to={`project/${projectName}/auditPlan/detail/${form.getFieldValue(
                'name'
              )}`}
            >
              {t('auditPlan.create.successGuide')} {'>'}
            </Link>
          }
          extra={[
            <Button key="close" onClick={clonePlan}>
              {t('auditPlan.create.clonePlan')}
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

export default CreateAuditPlan;
