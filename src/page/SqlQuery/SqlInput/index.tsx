import { useBoolean } from 'ahooks';
import { Button, Card, Col, Form, InputNumber, Row, Select, Space } from 'antd';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MonacoEditor from 'react-monaco-editor';
import { DefaultMaxQueryRows } from '..';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../api/instance/index.enum';
import IconTipsLabel from '../../../components/IconTipsLabel';
import { FilterFormColLayout, FilterFormRowLayout } from '../../../data/common';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useInstance from '../../../hooks/useInstance';
import useInstanceSchema from '../../../hooks/useInstanceSchema';
import useMonacoEditor from '../../../hooks/useMonacoEditor';
import useStyles from '../../../theme';
import { ISqlInputForm } from '../index.type';
import { SqlInputProps } from './index.type';
import SqlQueryHistory from './Modal/SqlQueryHistory';

const SqlInput: React.FC<SqlInputProps> = ({
  form,
  dataSourceName,
  updateDataSourceName,
  updateSchemaName,
  submitForm,
  maxQueryRows = DefaultMaxQueryRows,
  getSQLExecPlan,
}) => {
  const { t } = useTranslation();
  const theme = useStyles();
  const { currentEditorTheme } = useChangeTheme();
  const { editorDidMount } = useMonacoEditor(form, { formName: 'sql' });

  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { generateInstanceSchemaSelectOption } =
    useInstanceSchema(dataSourceName);

  const [
    showHistoryModal,
    { setFalse: closeHistoryModal, setTrue: openHistoryModal },
  ] = useBoolean(false);

  const [getSqlQueryLoading, { setFalse: finishQuery, setTrue: startQuery }] =
    useBoolean(false);

  const submit = async () => {
    startQuery();
    const values = await form.validateFields();
    submitForm(values).finally(() => {
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
    updateInstanceList({
      functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_query,
    });
  }, [updateInstanceList]);

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
                  value={dataSourceName}
                  onChange={(val) => updateDataSourceName(val)}
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
                <Select<string>
                  placeholder={t('common.form.placeholder.select')}
                  showSearch
                  allowClear
                  onChange={(val) => updateSchemaName(val)}
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
              data-testid="sql-input-editor"
              theme={currentEditorTheme}
              width="100%"
              height="200"
              language="sql"
              editorDidMount={editorDidMount}
            />
          </Form.Item>
          <Space size="large">
            <Form.Item
              label={
                <IconTipsLabel tips={t('sqlQuery.sqlInput.returnLengthTips')}>
                  {t('sqlQuery.sqlInput.returnLength')}
                </IconTipsLabel>
              }
              name="maxPreQueryRows"
              style={{ marginBottom: 0 }}
              initialValue={DefaultMaxQueryRows}
              rules={[
                {
                  required: true,
                  message: t('sqlQuery.sqlInput.returnLengthCheck'),
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
              disabled={!dataSourceName}
              type="primary"
              onClick={openHistoryModal}
            >
              {t('sqlQuery.sqlInput.sqlHistory')}
            </Button>

            <Button
              disabled={!dataSourceName}
              type="primary"
              onClick={getSQLExecPlan}
            >
              {t('sqlQuery.sqlInput.sqlExecPlan')}
            </Button>
          </Space>
        </Form>
      </Card>

      <SqlQueryHistory
        visible={showHistoryModal}
        close={closeHistoryModal}
        applyHistorySql={applyHistorySql}
        instanceName={dataSourceName ?? ''}
      />
    </>
  );
};

export default SqlInput;
