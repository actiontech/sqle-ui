import { SearchOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import {
  Dropdown,
  DropDownProps,
  Input,
  Menu,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { IUserBindProjectResV1 } from '../../../../api/common';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import { useRecentlyOpenedProjects } from '../../../../page/ProjectManage/ProjectDetail';
import useStyles from '../../../../theme';
import EmptyBox from '../../../EmptyBox';

const ProjectDropdown: React.FC<
  Pick<DropDownProps, 'visible' | 'onVisibleChange'>
> = ({ children, visible, onVisibleChange }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { bindProjects } = useCurrentUser();
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showProjects, setShowProjects] = useState<IUserBindProjectResV1[]>([]);
  const { recentlyProjects, updateRecentlyProject } =
    useRecentlyOpenedProjects();
  const history = useHistory();

  const filterProject = (val: string) => {
    setSearchLoading(false);

    if (!val) {
      return;
    }

    setShowProjects(
      bindProjects.filter((v) =>
        v.project_name?.toLocaleLowerCase().includes(val.toLocaleLowerCase())
      )
    );
  };

  const { run } = useDebounceFn(filterProject, {
    wait: 400,
  });

  const jumpToProject = (name: string) => {
    updateRecentlyProject(name);
    history.push(`/project/${name}`);
    onVisibleChange?.(false);
  };

  const showAllProjects = () => {
    history.push(`/project`);
    onVisibleChange?.(false);
  };

  useEffect(() => {
    const reset = () => {
      setSearchLoading(false);
      setSearchText('');
      setShowProjects([]);
    };
    if (visible) {
      reset();
    }
  }, [visible]);

  const render = () => {
    if (searchLoading) {
      return <Spin data-testid="search-loading" />;
    }

    if (!!searchText && showProjects.length === 0) {
      return (
        <Typography.Text>
          {t('projectManage.projectList.searchProject.notSearched')}
        </Typography.Text>
      );
    }

    if (showProjects.length > 0) {
      return (
        <div className="project-dropdown-search-result-wrapper">
          {showProjects.map((v) => {
            if (v.project_name) {
              return (
                <div
                  key={v.project_name}
                  onClick={() => jumpToProject(v.project_name!)}
                  className={`project-dropdown-name-wrapper ${styles.optionsHover}`}
                >
                  {v.project_name}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    return (
      <Space
        direction="vertical"
        className="full-width-element"
        key="recentlyOpenedProjects"
      >
        <Typography.Text>
          {t('projectManage.projectList.searchProject.recentlyOpenedProjects')}
        </Typography.Text>

        <EmptyBox
          if={recentlyProjects.length > 0}
          defaultNode={
            <Typography.Text type="secondary">
              {t(
                'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
              )}
            </Typography.Text>
          }
        >
          <div>
            {recentlyProjects.map((name) => {
              if (name) {
                return (
                  <div
                    key={name}
                    onClick={() => jumpToProject(name)}
                    className={`project-dropdown-name-wrapper ${styles.optionsHover}`}
                  >
                    {name}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </EmptyBox>
      </Space>
    );
  };

  return (
    <>
      <Dropdown
        trigger={['click']}
        visible={visible}
        onVisibleChange={onVisibleChange}
        overlay={
          <Menu className="project-dropdown-wrapper">
            <Space direction="vertical" key="plane">
              <Input
                data-testid="search-project-input"
                prefix={<SearchOutlined />}
                placeholder={t(
                  'projectManage.projectList.searchProject.placeholder'
                )}
                allowClear
                value={searchText}
                onChange={(e) => {
                  if (e.target.value) {
                    setSearchLoading(true);
                  } else {
                    setShowProjects([]);
                  }
                  setSearchText(e.target.value);
                  run(e.target.value);
                }}
              />

              <>{render()}</>
            </Space>

            <Menu.Divider />
            <Menu.Item key="allProject" onClick={showAllProjects}>
              {t('projectManage.projectList.allProject')}
            </Menu.Item>
          </Menu>
        }
      >
        <>{children}</>
      </Dropdown>
    </>
  );
};

export default ProjectDropdown;
