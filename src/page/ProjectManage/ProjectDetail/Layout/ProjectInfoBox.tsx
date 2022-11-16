import { useRequest } from 'ahooks';
import { Spin, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useCurrentProjectName } from '..';
import project from '../../../../api/project';
import EmptyBox from '../../../../components/EmptyBox';

const ProjectInfoBox: React.FC = () => {
  const { projectName } = useCurrentProjectName();
  const { t } = useTranslation();
  const {
    data: projectInfo,
    error,
    loading,
  } = useRequest(
    () => project.getProjectDetailV1({ project_name: projectName }),
    {
      formatResult: (data) => data.data.data,
    }
  );

  return (
    <>
      <EmptyBox if={loading}>
        <Spin />
      </EmptyBox>

      <EmptyBox if={!error && !loading}>
        <div className="project-info-wrapper">
          <Typography.Text ellipsis={true} className="text-white title" strong>
            {projectInfo?.name}
          </Typography.Text>
          <Tooltip title={projectInfo?.desc}>
            <Typography.Text ellipsis={true} className="text-white detail">
              {t('projectManage.projectInfoBox.desc', {
                desc: projectInfo?.desc ?? '',
              })}
            </Typography.Text>
          </Tooltip>

          <Typography.Text ellipsis={true} className="text-white detail">
            {t('projectManage.projectInfoBox.createTime', {
              time: projectInfo?.create_time
                ? moment(projectInfo?.create_time).format('YYYY-MM-DD')
                : '',
            })}
          </Typography.Text>
          <Typography.Text ellipsis={true} className="text-white detail">
            {t('projectManage.projectInfoBox.createUser', {
              user: projectInfo?.create_user_name ?? '',
            })}
          </Typography.Text>
        </div>
      </EmptyBox>
    </>
  );
};

export default ProjectInfoBox;
