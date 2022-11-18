import { Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ProjectInfoBoxProps } from '.';
import EmptyBox from '../../../../components/EmptyBox';

const ProjectInfoBox: React.FC<ProjectInfoBoxProps> = ({ projectInfo }) => {
  const { t } = useTranslation();

  return (
    <EmptyBox if={!!projectInfo}>
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
  );
};

export default ProjectInfoBox;
