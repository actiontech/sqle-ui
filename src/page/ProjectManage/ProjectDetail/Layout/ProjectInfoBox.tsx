import { useRequest } from 'ahooks';
import { Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ProjectDetailLocationStateType } from '..';
import project from '../../../../api/project';
import EmptyBox from '../../../../components/EmptyBox';

const ProjectInfoBox: React.FC = () => {
  const location = useLocation<ProjectDetailLocationStateType>();
  const { t } = useTranslation();
  const { data: projectInfo, error } = useRequest(
    () =>
      project.getProjectDetailV1({ project_name: location.state.projectName }),
    {
      formatResult: (data) => data.data.data,
    }
  );

  return (
    <EmptyBox if={!error}>
      <div className="project-info-wrapper">
        <Typography.Text ellipsis={true} className="text-white title" strong>
          {projectInfo?.name}
        </Typography.Text>
        <Tooltip title={projectInfo?.desc}>
          <Typography.Text ellipsis={true} className="text-white pb-10">
            {t('projectManage.projectInfoBox.desc', {
              desc: projectInfo?.desc ?? '',
            })}
          </Typography.Text>
        </Tooltip>

        <Typography.Text ellipsis={true} className="text-white pb-10">
          {t('projectManage.projectInfoBox.createTime', {
            time: projectInfo?.create_time ?? '',
          })}
        </Typography.Text>
        <Typography.Text ellipsis={true} className="text-white pb-10">
          {t('projectManage.projectInfoBox.createUser', {
            user: projectInfo?.create_user_name ?? '',
          })}
        </Typography.Text>
      </div>
    </EmptyBox>
  );
};

export default ProjectInfoBox;
