import { PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import ProjectManageModal from './Modal';
import ProjectList from './ProjectList';

const ProjectManage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <article className="project-manage-page-namespace">
      <PageHeader title={t('projectManage.pageTitle')} ghost={false}>
        {t('projectManage.pageDescribe')}
      </PageHeader>

      <ProjectList />
      <ProjectManageModal />
    </article>
  );
};

export default ProjectManage;
