import { PageHeader, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import MemberGroupList from './MemberGroupList';
import MemberList from './MemberList';
import MemberModal from './Modal';

const Member: React.FC = () => {
  const { t } = useTranslation();
  return (
    <article>
      <PageHeader title={t('member.pageTitle')} ghost={false}></PageHeader>
      <section className="padding-content">
        <Space direction="vertical" className="full-width-element" size="large">
          <MemberList />
          <MemberGroupList />
        </Space>
      </section>

      <MemberModal />
    </article>
  );
};
export default Member;
