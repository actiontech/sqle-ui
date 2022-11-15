import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Card, message, PageHeader, Space, Table } from 'antd';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { IProjectListItem } from '../../../api/common';
import project from '../../../api/project';
import { ResponseCode } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import {
  updateProjectManageModalStatus,
  updateSelectProject,
} from '../../../store/projectManage';
import EventEmitter from '../../../utils/EventEmitter';
import ProjectManageModal from '../Modal';
import { ProjectListTableColumnFactory } from './column';

const ProjectList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    data,
    loading,
    refresh,
    pagination: { total, onChange: changePagination, changeCurrent },
  } = useRequest(
    ({ current, pageSize }) =>
      project.getProjectListV1({
        page_index: current,
        page_size: pageSize,
      }),
    {
      paginated: true,
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data?.total_nums ?? 0,
        };
      },
    }
  );

  const pageChange = useCallback(
    (current: number, pageSize?: number) => {
      if (pageSize) {
        changePagination(current, pageSize);
      } else {
        changeCurrent(current);
      }
    },
    [changeCurrent, changePagination]
  );

  const deleteAction = (name?: string) => {
    project
      .deleteProjectV1({
        project_name: name!,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(
            t('projectManage.projectList.deleteSuccessTips', {
              name,
            })
          );
          refresh();
        }
      });
  };

  const openModalAndUpdateSelectProject = (record: IProjectListItem) => {
    dispatch(
      updateProjectManageModalStatus({
        modalName: ModalName.Update_Project,
        status: true,
      })
    );
    dispatch(updateSelectProject({ project: record }));
  };

  const openCreateProjectModal = () => {
    dispatch(
      updateProjectManageModalStatus({
        modalName: ModalName.Create_Project,
        status: true,
      })
    );
  };

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.Refresh_Project_List, refresh);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_Project_List, refresh);
    };
  }, [refresh]);

  return (
    <article className="project-manage-page-namespace">
      <PageHeader title={t('projectManage.pageTitle')} ghost={false}>
        {t('projectManage.pageDescribe')}
      </PageHeader>
      <section className="padding-content">
        <Card
          title={
            <Space>
              {t('projectManage.projectList.title')}
              <Button
                key="refresh_project"
                data-testid="refresh-project"
                onClick={refresh}
              >
                <SyncOutlined spin={loading} />
              </Button>
            </Space>
          }
          extra={[
            <Button
              key="create_project"
              type="primary"
              onClick={openCreateProjectModal}
            >
              {t('projectManage.projectList.createProject')}
            </Button>,
          ]}
        >
          <Table
            rowKey="id"
            dataSource={data?.list}
            loading={loading}
            pagination={{
              total,
              defaultPageSize: 10,
              showSizeChanger: true,
              onChange: pageChange,
            }}
            columns={ProjectListTableColumnFactory(
              deleteAction,
              openModalAndUpdateSelectProject
            )}
          />
        </Card>
      </section>

      <ProjectManageModal />
    </article>
  );
};

export default ProjectList;
