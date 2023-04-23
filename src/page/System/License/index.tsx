import { useRequest } from 'ahooks';
import { Button, Card, Space, Table, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ILicenseItem } from '../../../api/common';
import configuration from '../../../api/configuration';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import { t } from '../../../locale';
import { updateSystemModalStatus } from '../../../store/system';
import { TableColumn } from '../../../types/common.type';
import EventEmitter from '../../../utils/EventEmitter';
import ImportLicense from './Modal/ImportLicense';

export const licenseColumn: TableColumn<ILicenseItem, 'operator'> = [
  {
    dataIndex: 'description',
    title: t('system.license.table.name'),
  },
  {
    dataIndex: 'limit',
    title: t('system.license.table.limit'),
    render: (text) => {
      return (
        <span
          style={{
            wordBreak: 'break-all',
          }}
        >
          {text}
        </span>
      );
    },
  },
];

const License = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data, loading, refresh } = useRequest(() => {
    return configuration
      .getSQLELicenseV1()
      .then((res) => ({ list: res?.data?.license ?? [] }));
  });

  const collectLicense = () => {
    configuration.GetSQLELicenseInfoV1({ responseType: 'blob' });
  };

  const importLicense = () => {
    dispatch(
      updateSystemModalStatus({
        modalName: ModalName.Import_License,
        status: true,
      })
    );
  };

  useEffect(() => {
    const scopeRefresh = () => {
      refresh();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_License, scopeRefresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_License, scopeRefresh);
    };
  }, [refresh]);

  return (
    <>
      <Card
        title={
          <Space>
            {t('system.title.license')}
            <Typography.Text type="secondary" className="font-size-small">
              {t('system.license.productName')}
            </Typography.Text>
          </Space>
        }
        extra={[
          <Space key="button-wrapper">
            <Button type="primary" onClick={collectLicense}>
              {t('system.license.collect')}
            </Button>
            <Button type="primary" onClick={importLicense}>
              {t('system.license.import')}
            </Button>
          </Space>,
        ]}
      >
        <Table
          rowKey="name"
          columns={licenseColumn}
          dataSource={data?.list}
          loading={loading}
        />
      </Card>
      <ImportLicense />
    </>
  );
};

export default License;
