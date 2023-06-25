import { useRequest } from 'ahooks';
import {
  Button,
  Card,
  Image,
  message,
  PageHeader,
  Space,
  Table,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import auditWhitelist from '../../../api/audit_whitelist';
import { ModalName } from '../../../data/ModalName';
import useTable from '../../../hooks/useTable';
import { WhitelistColumn } from './column';
import WhitelistModal from './Modal';
import {
  initWhitelistModalStatus,
  updateSelectWhitelist,
  updateWhitelistModalStatus,
} from '../../../store/whitelist';
import { useDispatch, useSelector } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { IAuditWhitelistResV1 } from '../../../api/common.d';
import { ResponseCode } from '../../../data/common';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import useCurrentUser from '../../../hooks/useCurrentUser';
import EmptyBox from '../../../components/EmptyBox';
import { IReduxState } from '../../../store';
import EnterpriseFeatureDisplay from '../../../components/EnterpriseFeatureDisplay/EnterpriseFeatureDisplay';

const WhitelistList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pagination, tableChange } = useTable();
  const { projectName } = useCurrentProjectName();
  const projectIsArchive = useSelector(
    (state: IReduxState) => state.projectManage.archived
  );
  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const {
    data: whitelistList,
    loading,
    refresh,
  } = useRequest(
    () =>
      auditWhitelist
        .getAuditWhitelistV1({
          page_index: `${pagination.pageIndex}`,
          page_size: `${pagination.pageSize}`,
          project_name: projectName,
        })
        .then((res) => ({
          list: res.data?.data ?? [],
          total: res.data.total_nums ?? 0,
        })),
    {
      refreshDeps: [pagination],
    }
  );

  const clickAddWhitelist = React.useCallback(() => {
    if (!actionPermission || projectIsArchive) {
      return;
    }
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: true,
      })
    );
  }, [actionPermission, dispatch, projectIsArchive]);

  const clickUpdateWhitelist = React.useCallback(
    (whitelist: IAuditWhitelistResV1) => {
      if (!actionPermission || projectIsArchive) {
        return;
      }
      dispatch(
        updateSelectWhitelist({
          whitelist,
        })
      );
      dispatch(
        updateWhitelistModalStatus({
          modalName: ModalName.Update_Whitelist,
          status: true,
        })
      );
    },
    [actionPermission, dispatch, projectIsArchive]
  );

  const removeWhitelist = React.useCallback(
    (whitelistId: number) => {
      if (!actionPermission || projectIsArchive) {
        return;
      }
      const hide = message.loading(t('whitelist.operate.deleting'));
      auditWhitelist
        .deleteAuditWhitelistByIdV1({
          audit_whitelist_id: `${whitelistId}`,
          project_name: projectName,
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(t('whitelist.operate.deleteSuccess'));
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [actionPermission, projectIsArchive, projectName, refresh, t]
  );

  React.useEffect(() => {
    const modalStatus = {
      [ModalName.Add_Whitelist]: false,
      [ModalName.Update_Whitelist]: false,
    };
    dispatch(initWhitelistModalStatus({ modalStatus }));
  }, [dispatch]);

  React.useEffect(() => {
    const scopeRefresh = () => {
      refresh();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_Whitelist_List, scopeRefresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_Whitelist_List, scopeRefresh);
    };
  }, [refresh]);

  return (
    <>
      <PageHeader title={t('whitelist.pageTitle')} ghost={false}>
        {t('whitelist.pageDesc')}
      </PageHeader>
      <EnterpriseFeatureDisplay
        featureName={t('whitelist.pageTitle')}
        eeFeatureDescription={
          <Space direction="vertical">
            <Typography.Text>{t('whitelist.ceTips')}</Typography.Text>
            <Image
              width="50%"
              alt="reportStatisticsPreview"
              src="/static/image/white_list_preview.png"
            />
          </Space>
        }
      >
        <>
          <section className="padding-content">
            <Card
              title={
                <Space>
                  {t('whitelist.allWhitelist')}
                  <Button onClick={refresh}>
                    <SyncOutlined spin={loading} />
                  </Button>
                </Space>
              }
              extra={[
                <EmptyBox
                  if={actionPermission && !projectIsArchive}
                  key="add-whitelist"
                >
                  <Button type="primary" onClick={clickAddWhitelist}>
                    {t('whitelist.operate.addWhitelist')}
                  </Button>
                </EmptyBox>,
              ]}
            >
              <Table
                loading={loading}
                rowKey="audit_whitelist_id"
                pagination={{
                  showSizeChanger: true,
                  total: whitelistList?.total,
                }}
                dataSource={whitelistList?.list}
                columns={WhitelistColumn(
                  clickUpdateWhitelist,
                  removeWhitelist,
                  actionPermission,
                  projectIsArchive
                )}
                onChange={tableChange}
              />
            </Card>
          </section>
          <WhitelistModal />
        </>
      </EnterpriseFeatureDisplay>
    </>
  );
};

export default WhitelistList;
