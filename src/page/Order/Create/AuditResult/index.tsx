import useRequest from '@ahooksjs/use-request';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space, Table } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import task from '../../../../api/task';
import { getAuditTaskSQLsV1FilterAuditStatusEnum } from '../../../../api/task/index.enum';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormRowLayout,
} from '../../../../data/common';
import useTable from '../../../../hooks/useTable';
import { auditResultColumn } from './column';
import { AuditResultProps } from './index.type';

const AuditResult: React.FC<AuditResultProps> = (props) => {
  const { t } = useTranslation();
  const {
    filterInfo,
    pagination,
    tableChange,
    filterForm,
    submitFilter,
    resetFilter,
  } = useTable<{
    filter_audit_status: getAuditTaskSQLsV1FilterAuditStatusEnum;
  }>();

  const { data, loading, refresh } = useRequest(
    () =>
      task.getAuditTaskSQLsV1({
        task_id: `${props.task?.task_id}`,
        page_index: `${pagination.pageIndex}`,
        page_size: `${pagination.pageSize}`,
        filter_audit_status: filterInfo.filter_audit_status,
      }),
    {
      ready: !!props.task,
      refreshDeps: [
        props.task?.task_id,
        pagination,
        filterInfo.filter_audit_status,
      ],
      formatResult(res) {
        return {
          list: res.data.data ?? [],
          total: res.data.total_nums ?? 1,
        };
      },
    }
  );

  return (
    <Card
      hidden={!props.task}
      title={
        <Space>
          {t('audit.result')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
    >
      <Form className="table-filter-form" form={filterForm}>
        <Row {...FilterFormRowLayout}>
          <Col {...FilterFormColLayout}>
            <Form.Item
              name="filter_audit_status"
              label={t('audit.table.auditStatus')}
            >
              {/* TODO: audit status should have enum */}
              <Input />
            </Form.Item>
          </Col>
          <Col
            {...filterFormButtonLayoutFactory(0, 8, 12)}
            className="text-align-right"
          >
            <Form.Item className="clear-margin-right">
              <Space>
                <Button onClick={resetFilter}>{t('common.reset')}</Button>
                <Button onClick={submitFilter} type="primary" htmlType="submit">
                  {t('common.search')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        loading={loading}
        pagination={{
          total: data?.total,
          showSizeChanger: true,
        }}
        dataSource={data?.list}
        columns={auditResultColumn()}
        onChange={tableChange}
      />
    </Card>
  );
};

export default AuditResult;
