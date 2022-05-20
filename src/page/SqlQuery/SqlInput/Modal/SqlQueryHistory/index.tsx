import { useBoolean } from 'ahooks';
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ISQLHistoryItemResV1 } from '../../../../../api/common';
import sql_query from '../../../../../api/sql_query';
import { IGetSQLQueryHistoryParams } from '../../../../../api/sql_query/index.d';
import {
  FilterFormColLayout,
  FilterFormRowLayout,
  ModalSize,
} from '../../../../../data/common';
import {
  FilterSqlHistoryFormFields,
  SqlSearchHistoryProps,
} from './index.type';

const defaultPageSize = 20;
const defaultCurrent = 1;

const SqlQueryHistory: React.FC<SqlSearchHistoryProps> = ({
  visible,
  applyHistorySql,
  close,
  instanceName,
}) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [sqlHistoryRecord, setSqlHistoryRecord] = useState<
    ISQLHistoryItemResV1[]
  >([]);
  const [
    filterSqlHistoryLoading,
    { setFalse: finishFilter, setTrue: startFilter },
  ] = useBoolean(false);
  const [currentPage, setCurrentPage] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const getSQLQueryHistory = useCallback(
    (page_index: number, page_size: number, sqlHistoryFilter?: string) => {
      startFilter();
      const params: IGetSQLQueryHistoryParams = {
        instance_name: instanceName,
        filter_fuzzy_search:
          sqlHistoryFilter === '' ? undefined : sqlHistoryFilter,
        page_index,
        page_size,
      };
      sql_query
        .getSQLQueryHistory(params)
        .then((res) => {
          setSqlHistoryRecord(res.data.data?.sql_histories ?? []);
        })
        .finally(() => {
          finishFilter();
        });
    },
    [finishFilter, instanceName, startFilter]
  );

  const filterSqlHistory = (values: FilterSqlHistoryFormFields) => {
    getSQLQueryHistory(currentPage, pageSize, values.sql_history_filter);
  };

  const handlePaginationChange = (page_index: number, page_size?: number) => {
    const values = form.getFieldsValue();
    setCurrentPage(page_index);
    setPageSize(page_size!);
    getSQLQueryHistory(page_index, page_size!, values.sql_history_filter);
  };

  const closeModal = () => {
    form.resetFields();
    setSqlHistoryRecord([]);
    finishFilter();
    setCurrentPage(defaultCurrent);
    setPageSize(defaultPageSize);
    close();
  };

  useEffect(() => {
    if (visible) {
      getSQLQueryHistory(defaultCurrent, defaultPageSize);
    }
  }, [visible, getSQLQueryHistory]);
  return (
    <Modal
      visible={visible}
      width={ModalSize.mid}
      title={t('sqlQuery.sqlQueryHistory.title')}
      footer={
        <Button type="primary" onClick={closeModal}>
          {t('common.close')}
        </Button>
      }
      onCancel={closeModal}
    >
      <>
        <Form form={form} onFinish={filterSqlHistory}>
          <Row {...FilterFormRowLayout}>
            <Col {...FilterFormColLayout}>
              <Form.Item style={{ marginBottom: 0 }} name="sql_history_filter">
                <Input />
              </Form.Item>
            </Col>
            <Col {...FilterFormColLayout}>
              <Form.Item style={{ marginBottom: 0 }} label="" colon={false}>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={filterSqlHistoryLoading}
                >
                  {t('sqlQuery.sqlQueryHistory.filterSqlHistory')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <List
          dataSource={sqlHistoryRecord}
          pagination={
            sqlHistoryRecord.length > 0
              ? {
                  size: 'small',
                  onChange: handlePaginationChange,
                  defaultPageSize,
                  defaultCurrent,
                  current: currentPage,
                  pageSize: pageSize,
                  showSizeChanger: true,
                }
              : false
          }
          renderItem={(item, index) => {
            return item.sql ? (
              <List.Item>
                <Space className="flex-space-between full-width-element">
                  <span>
                    <Typography.Text>{index + 1}. </Typography.Text>
                    {item.sql}
                  </span>
                  <Button
                    type="link"
                    onClick={() => {
                      applyHistorySql(item.sql!);
                    }}
                    id={`apply-btn-${index}`}
                  >
                    {t('sqlQuery.sqlQueryHistory.applySql')}
                  </Button>
                </Space>
              </List.Item>
            ) : null;
          }}
        />
      </>
    </Modal>
  );
};

export default SqlQueryHistory;
