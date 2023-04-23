import { SearchOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import {
  Dropdown,
  DropDownProps,
  Input,
  Menu,
  MenuProps,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IUserBindProjectResV1 } from '../../../../api/common';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useNavigate from '../../../../hooks/useNavigate';
import { useRecentlyOpenedProjects } from '../../../../page/ProjectManage/ProjectDetail';
import useStyles from '../../../../theme';
import EmptyBox from '../../../EmptyBox';

const ProjectNavigation: React.FC<
  Pick<DropDownProps, 'open' | 'onOpenChange'> & {
    children: React.ReactNode;
  }
> = ({ children, open, onOpenChange }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { bindProjects } = useCurrentUser();
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showProjects, setShowProjects] = useState<IUserBindProjectResV1[]>([]);
  const { recentlyProjects, updateRecentlyProject } =
    useRecentlyOpenedProjects();
  const navigate = useNavigate();

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
    navigate(`project/${name}/overview`);
    onOpenChange?.(false);
  };

  const showAllProjects = () => {
    navigate(`project`);
    onOpenChange?.(false);
  };

  useEffect(() => {
    const reset = () => {
      setSearchLoading(false);
      setSearchText('');
      setShowProjects([]);
    };
    if (open) {
      reset();
    }
  }, [open]);

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
        <Typography.Text strong>
          {t('projectManage.projectList.searchProject.recentlyOpenedProjects')}
        </Typography.Text>

        <EmptyBox
          if={recentlyProjects?.length > 0}
          defaultNode={
            <Typography.Text type="secondary" style={{ marginLeft: 12 }}>
              {t(
                'projectManage.projectList.searchProject.notRecentlyOpenedProjects'
              )}
            </Typography.Text>
          }
        >
          <div>
            {recentlyProjects?.map((name) => {
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
        open={open}
        onOpenChange={onOpenChange}
        dropdownRender={() => {
          const menuItems: MenuProps['items'] = [
            {
              type: 'group',
              key: 'plane',
              label: (
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
              ),
            },
            {
              key: 'divider',
              type: 'divider',
            },
            {
              key: 'allProject',
              onClick: showAllProjects,
              label: (
                <Typography.Text strong>
                  {t('projectManage.projectList.allProject')}
                </Typography.Text>
              ),
            },
          ];
          return (
            <Menu className="project-dropdown-wrapper" items={menuItems} />
          );
        }}
      >
        <>{children}</>
      </Dropdown>
    </>
  );
};

export default ProjectNavigation;
