import { Space, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ProjectInfoBoxProps } from '../ProjectDetail/Layout';
import EmptyBox from '../../../components/EmptyBox';

const ProjectInfoBox: React.FC<ProjectInfoBoxProps> = ({ projectInfo }) => {
  const { t } = useTranslation();
  return (
    <EmptyBox if={!!projectInfo}>
      <Space size="large">
        <Typography.Text ellipsis={true}>
          {t('projectManage.projectInfoBox.name', {
            name: projectInfo?.name ?? '',
          })}
        </Typography.Text>

        <EmptyBox if={!!projectInfo?.desc}>
          <Tooltip title={projectInfo?.desc}>
            <Typography.Text ellipsis={true} style={{ maxWidth: 300 }}>
              {t('projectManage.projectInfoBox.desc', {
                desc: projectInfo?.desc ?? '',
              })}
            </Typography.Text>
          </Tooltip>
        </EmptyBox>

        <Typography.Text>
          {t('projectManage.projectInfoBox.createTime', {
            time: projectInfo?.create_time
              ? moment(projectInfo?.create_time).format('YYYY-MM-DD')
              : '',
          })}
        </Typography.Text>

        <Typography.Text>
          {t('projectManage.projectInfoBox.createUser', {
            user: projectInfo?.create_user_name ?? '',
          })}
        </Typography.Text>
      </Space>
    </EmptyBox>
  );
};

export default ProjectInfoBox;
