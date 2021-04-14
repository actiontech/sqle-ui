import { useRequest } from 'ahooks';
import { Button, Card, message, PageHeader, Space, Table } from 'antd';
import React from 'react';
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
import { useDispatch } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { IAuditWhitelistResV1 } from '../../../api/common.d';
import { ResponseCode } from '../../../data/common';

const WhitelistList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pagination, tableChange } = useTable();

  const { data: whitelistList, loading, refresh } = useRequest(
    () =>
      auditWhitelist.getAuditWhitelistV1({
        page_index: `${pagination.pageIndex}`,
        page_size: `${pagination.pageSize}`,
      }),
    {
      formatResult(res) {
        return {
          list: res.data?.data ?? [],
          total: res.data.total_nums ?? 0,
        };
      },
    }
  );

  const clickAddWhitelist = React.useCallback(() => {
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: true,
      })
    );
  }, [dispatch]);

  const clickUpdateWhitelist = React.useCallback(
    (whitelist: IAuditWhitelistResV1) => {
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
    [dispatch]
  );

  const removeWhitelist = React.useCallback(
    (whitelistId: number) => {
      const hide = message.loading(t('whitelist.operate.deleting'));
      auditWhitelist
        .deleteAuditWhitelistByIdV1({
          audit_whitelist_id: `${whitelistId}`,
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
    [refresh, t]
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
      <section className="padding-content">
        <Card
          title={
            <Space>
              {t('whitelist.allWhitelist')}
              <Button>
                <SyncOutlined spin={loading} />
              </Button>
            </Space>
          }
          extra={[
            <Button
              key="add-whitelist"
              type="primary"
              onClick={clickAddWhitelist}
            >
              {t('whitelist.operate.addWhitelist')}
            </Button>,
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
            columns={WhitelistColumn(clickUpdateWhitelist, removeWhitelist)}
            onChange={tableChange}
          />
        </Card>
      </section>
      <WhitelistModal />
    </>
  );
};

export default WhitelistList;
