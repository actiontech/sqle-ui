import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import PlanForm from '../PlanForm';

const CreateAuditPlan = () => {
  const { t } = useTranslation();

  return (
    <Card title={t('auditPlan.create.title')}>
      <PlanForm />
    </Card>
  );
};

export default CreateAuditPlan;
