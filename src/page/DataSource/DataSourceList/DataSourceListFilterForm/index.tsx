import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormLayout,
  FilterFormRowLayout,
} from '../../../../data/common';
import useInstance from '../../../../hooks/useInstance';
import useRuleTemplate from '../../../../hooks/useRuleTemplate';
import {
  DataSourceListFilterFields,
  DataSourceListFilterFormProps,
} from './index.type';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import useGlobalRuleTemplate from '../../../../hooks/useGlobalRuleTemplate';

const DataSourceListFilterForm: React.FC<DataSourceListFilterFormProps> = (
  props
) => {
  const { projectName } = props;
  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();
  const { t } = useTranslation();
  const [collapse, toggleCollapse] = useState(true);
  const [form] = useForm<DataSourceListFilterFields>();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const { updateRuleTemplateList, ruleTemplateList } = useRuleTemplate();
  const { updateGlobalRuleTemplateList, globalRuleTemplateList } =
    useGlobalRuleTemplate();
  const submit = React.useCallback(() => {
    props.submit(form.getFieldsValue());
  }, [form, props]);

  const collapseChange = React.useCallback(() => {
    toggleCollapse(!collapse);
    if (!collapse) {
      form.setFieldsValue({
        filter_rule_template_name: undefined,
        filter_db_type: undefined,
      });
      submit();
    }
  }, [collapse, form, submit, toggleCollapse]);

  const reset = React.useCallback(() => {
    form.resetFields();
    props.submit({});
  }, [form, props]);

  React.useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateGlobalRuleTemplateList();
    updateRuleTemplateList(projectName);
    updateDriverNameList();
  }, [
    projectName,
    updateDriverNameList,
    updateGlobalRuleTemplateList,
    updateInstanceList,
    updateRuleTemplateList,
  ]);

  return (
    <Form<DataSourceListFilterFields> form={form} {...FilterFormLayout}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_instance_name"
            label={t('dataSource.dataSourceForm.name')}
          >
            <Select
              showSearch
              allowClear
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('dataSource.dataSourceForm.name'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_db_host"
            label={t('dataSource.dataSourceForm.ip')}
          >
            <Input
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('dataSource.dataSourceForm.ip'),
              })}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_db_port"
            label={t('dataSource.dataSourceForm.port')}
          >
            <Input
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('dataSource.dataSourceForm.port'),
              })}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            label={t('dataSource.dataSourceForm.type')}
            name="filter_db_type"
          >
            <Select
              placeholder={t('common.form.placeholder.select', {
                name: t('dataSource.dataSourceForm.type'),
              })}
              allowClear
            >
              {generateDriverSelectOptions()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            name="filter_rule_template_name"
            label={t('dataSource.dataSourceForm.ruleTemplate')}
          >
            <Select
              allowClear
              showSearch
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('dataSource.dataSourceForm.ruleTemplate'),
              })}
            >
              {[...ruleTemplateList, ...globalRuleTemplateList].map(
                (template) => {
                  return (
                    <Select.Option
                      key={template.rule_template_name}
                      value={template.rule_template_name ?? ''}
                    >
                      {template.rule_template_name}
                    </Select.Option>
                  );
                }
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(
            collapse ? 0 : 12,
            16,
            collapse ? 0 : 6
          )}
          className="text-align-right"
        >
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={reset}>{t('common.reset')}</Button>
              <Button type="primary" onClick={submit}>
                {t('common.search')}
              </Button>
              <Typography.Link onClick={collapseChange}>
                {collapse && (
                  <>
                    {t('common.expansion')}
                    <DownOutlined />
                  </>
                )}
                {!collapse && (
                  <>
                    {t('common.collapse')}
                    <UpOutlined />
                  </>
                )}
              </Typography.Link>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default DataSourceListFilterForm;
