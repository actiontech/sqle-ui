import { useBoolean } from 'ahooks';
import { Button, Card, Col, Form, InputNumber, Row, Select, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import instance from '../../../api/instance';
import sql_query from '../../../api/sql_query';
import {
  IGetSQLResultParams,
  IPrepareSQLQueryParams,
} from '../../../api/sql_query/index.d';
import {
  FilterFormColLayout,
  FilterFormRowLayout,
  ResponseCode,
} from '../../../data/common';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useInstance from '../../../hooks/useInstance';
import useInstanceSchema from '../../../hooks/useInstanceSchema';
import useMonacoEditor from '../../../hooks/useMonacoEditor';
import useStyles from '../../../theme';
import { ISqlInputForm, SqlQueryResultType } from '../index.type';
import { SqlInputProps } from './index.type';
import SqlQueryHistory from './Modal/SqlQueryHistory';

const defaultMaxQueryRows = 100;

const SqlInput: React.FC<SqlInputProps> = ({
  form,
  setQueryRes,
  setResultErrorMessage,
}) => {
  const { t } = useTranslation();
  const theme = useStyles();
  const { currentEditorTheme } = useChangeTheme();
  const { editorDidMount } = useMonacoEditor(form, { formName: 'sql' });

  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const [instanceName, setInstanceName] = useState<string | undefined>(
    undefined
  );
  const { generateInstanceSchemaSelectOption } =
    useInstanceSchema(instanceName);
  const [maxQueryRows, setMaxQueryRows] = useState(defaultMaxQueryRows);
  const [
    showHistoryModal,
    { setFalse: closeHistoryModal, setTrue: openHistoryModal },
  ] = useBoolean(false);
  const [getSqlQueryLoading, { setFalse: finishQuery, setTrue: startQuery }] =
    useBoolean(false);

  const getSqlQueryResultList = async () => {
    const formValues = await form.validateFields();
    const prepareSqlQueryParams: IPrepareSQLQueryParams = {
      instance_name: formValues.instanceName,
      instance_schema: formValues.instanceSchema,
      sql: formValues.sql,
    };
    const prepareSqlQueryRes = await sql_query.prepareSQLQuery(
      prepareSqlQueryParams
    );
    if (prepareSqlQueryRes.data.code !== ResponseCode.SUCCESS) {
      setResultErrorMessage(
        prepareSqlQueryRes.data.message ?? t('common.unknownError')
      );
      return;
    }
    const actionArray = prepareSqlQueryRes.data.data?.query_ids?.map(
      ({ query_id }) => {
        const getSqlResultParams: IGetSQLResultParams = {
          query_id: query_id ?? '',
          page_size: formValues.maxPreQueryRows,
          page_index: 1,
        };
        return sql_query.getSQLResult(getSqlResultParams);
      }
    );
    const sqlQueryResultList = await Promise.all(actionArray ?? []);
    const failQuery = sqlQueryResultList.find(
      (v) => v.data.code !== ResponseCode.SUCCESS
    );
    if (failQuery) {
      setResultErrorMessage(failQuery.data.message ?? t('common.unknownError'));
      return;
    }

    const realQueryRes: SqlQueryResultType[] =
      prepareSqlQueryRes.data.data?.query_ids?.map((v, index) => {
        return {
          sqlQueryId: v.query_id ?? '',
          resultItem: sqlQueryResultList[index].data.data ?? {},
          hide: false,
        };
      }) ?? [];
    setQueryRes(realQueryRes);
  };

  const submit = () => {
    startQuery();
    getSqlQueryResultList().finally(() => {
      finishQuery();
    });
  };

  const applyHistorySql = useCallback(
    (sql: string) => {
      form.setFieldsValue({
        sql,
      });
      closeHistoryModal();
    },
    [closeHistoryModal, form]
  );

  useEffect(() => {
    updateInstanceList();
  }, [updateInstanceList]);

  useEffect(() => {
    if (instanceName) {
      instance.getInstanceV1({ instance_name: instanceName }).then((res) => {
        if (res) {
          const rowsLength =
            res.data.data?.sql_query_config?.max_pre_query_rows ??
            defaultMaxQueryRows;
          form.setFieldsValue({
            maxPreQueryRows:
              rowsLength > defaultMaxQueryRows
                ? defaultMaxQueryRows
                : rowsLength,
          });
          setMaxQueryRows(rowsLength);
        }
      });
    }
  }, [form, instanceName]);

  return (
    <>
      <Card title={t('sqlQuery.sqlInput.title')}>
        <Form<ISqlInputForm> onFinish={submit} form={form}>
          <Row {...FilterFormRowLayout}>
            <Col {...FilterFormColLayout}>
              <Form.Item
                name="instanceName"
                label={t('sqlQuery.sqlInput.instance')}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  data-testid="instance-name"
                  value={instanceName}
                  onChange={setInstanceName}
                  placeholder={t('common.form.placeholder.select')}
                  className="middle-select"
                  allowClear
                  showSearch
                >
                  {generateInstanceSelectOption()}
                </Select>
              </Form.Item>
            </Col>
            <Col {...FilterFormColLayout}>
              <Form.Item
                name="instanceSchema"
                label={t('sqlQuery.sqlInput.database')}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder={t('common.form.placeholder.select')}
                  showSearch
                  allowClear
                >
                  {generateInstanceSchemaSelectOption()}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="sql"
            label=""
            initialValue="/* input your sql */"
            wrapperCol={{
              className: theme.editor,
            }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <MonacoEditor
              theme={currentEditorTheme}
              width="100%"
              height="200"
              language="sql"
              editorDidMount={editorDidMount}
            />
          </Form.Item>
          <Space size="large">
            <Form.Item
              label={t('sqlQuery.sqlInput.returnLength')}
              name="maxPreQueryRows"
              style={{ marginBottom: 0 }}
              initialValue={defaultMaxQueryRows}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber max={maxQueryRows} />
            </Form.Item>

            <Form.Item label="" colon={false} style={{ marginBottom: 0 }}>
              <Button
                htmlType="submit"
                type="primary"
                loading={getSqlQueryLoading}
              >
                {t('sqlQuery.sqlInput.searchSqlResult')}
              </Button>
            </Form.Item>

            <Button
              disabled={!instanceName}
              type="primary"
              onClick={openHistoryModal}
            >
              {t('sqlQuery.sqlInput.sqlHistory')}
            </Button>
          </Space>
        </Form>
      </Card>
      <SqlQueryHistory
        visible={showHistoryModal}
        close={closeHistoryModal}
        applyHistorySql={applyHistorySql}
        instanceName={instanceName ?? ''}
      />
    </>
  );
};

export default SqlInput;
