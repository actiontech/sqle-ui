import { useBoolean } from 'ahooks';
import { Card, Modal, Result, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import audit_plan from '../../../api/audit_plan';
import { IAuditPlanResV1 } from '../../../api/common';
import BackButton from '../../../components/BackButton';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import PlanForm from '../PlanForm';
import { PlanFormField } from '../PlanForm/index.type';
import { UpdateAuditPlanUrlParams } from './index.type';

const UpdateAuditPlan = () => {
  const { t } = useTranslation();
  const urlParams = useParams<UpdateAuditPlanUrlParams>();
  const [visible, { setTrue: openResultModal, setFalse: closeResultModal }] =
    useBoolean();
  const [defaultValue, setDefaultValue] = useState<IAuditPlanResV1>();

  const updateAuditPlan = (values: PlanFormField) => {
    return audit_plan
      .updateAuditPlanV1({
        audit_plan_cron: values.cron,
        audit_plan_instance_database: values.schema,
        audit_plan_instance_name: values.databaseName,
        audit_plan_name: urlParams.auditPlanName,
        audit_plan_params: values.asyncParams,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          openResultModal();
        }
      });
  };

  const updateAndCloseResultModal = () => {
    EventEmitter.emit(EmitterKey.Rest_Audit_Plan_Form);
    closeResultModal();
    getCurrentAuditPlan();
  };

  const getCurrentAuditPlan = () => {
    audit_plan
      .getAuditPlanV1({
        audit_plan_name: urlParams.auditPlanName,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setDefaultValue(res.data.data);
        }
      });
  };

  useEffect(() => {
    getCurrentAuditPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      title={t('auditPlan.update.title')}
      extra={[<BackButton key="goBack" />]}
    >
      <PlanForm submit={updateAuditPlan} defaultValue={defaultValue} />
      <Modal
        title={t('common.operateSuccess')}
        footer={null}
        closable={false}
        visible={visible}
      >
        <Result
          status="success"
          title={t('auditPlan.update.successTitle')}
          subTitle={
            <Link to="/auditPlan">
              {t('auditPlan.update.successGuide')} {'>'}
            </Link>
          }
          extra={[
            <Button key="close" onClick={updateAndCloseResultModal}>
              {t('common.close')}
            </Button>,
          ]}
        />
      </Modal>
    </Card>
  );
};

export default UpdateAuditPlan;
