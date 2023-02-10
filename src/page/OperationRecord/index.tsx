import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import OperationRecordList from './OperationRecordList';

const OperationRecord: React.FC = () => {
  const { t } = useTranslation();
  return (
    <article>
      <PageHeader title={t('menu.operationRecord')} ghost={false}></PageHeader>

      <section className="padding-content">
        <OperationRecordList />
      </section>
    </article>
  );
};

export default OperationRecord;
