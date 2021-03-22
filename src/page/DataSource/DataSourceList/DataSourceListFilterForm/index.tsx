import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Button, Col, Form, Input, Row, Select, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormLayout,
  FilterFormRowLayout,
} from '../../../../data/common';
import useInstance from '../../../../hooks/useInstance';
import useRole from '../../../../hooks/userRole';
import useRuleTemplate from '../../../../hooks/userRuleTemplate';
import {
  DataSourceListFilterFields,
  DataSourceListFilterFormProps,
} from './index.type';

const DataSourceListFilterForm: React.FC<DataSourceListFilterFormProps> = (
  props
) => {
  const { t } = useTranslation();
  const [collapse, { toggle: toggleCollapse }] = useBoolean(true);

  const [form] = useForm<DataSourceListFilterFields>();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  const {
    updateRuleTemplateList,
    generateRuleTemplateSelectOption,
  } = useRuleTemplate();
  const { updateRoleList, generateRoleSelectOption } = useRole();

  const submit = React.useCallback(() => {
    props.submit(form.getFieldsValue());
  }, [form, props]);

  const collapseChange = React.useCallback(() => {
    toggleCollapse(!collapse);
    if (!collapse) {
      form.setFieldsValue({
        filter_db_user: undefined,
        filter_workflow_template_name: undefined,
        filter_rule_template_name: undefined,
        filter_role_name: undefined,
      });
      submit();
    }
  }, [collapse, form, submit, toggleCollapse]);

  const reset = React.useCallback(() => {
    props.submit({});
  }, [props]);

  React.useCallback(() => {
    updateInstanceList();
    updateRuleTemplateList();
    updateRoleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            name="filter_db_user"
            label={t('dataSource.dataSourceForm.user')}
          >
            <Input
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('dataSource.dataSourceForm.user'),
              })}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            name="filter_workflow_template_name"
            label={t('dataSource.dataSourceForm.workflow')}
          >
            <Input
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('dataSource.dataSourceForm.workflow'),
              })}
            />
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
              {generateRuleTemplateSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            name="filter_role_name"
            label={t('dataSource.dataSourceForm.role')}
          >
            <Select
              allowClear
              showSearch
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('dataSource.dataSourceForm.role'),
              })}
            >
              {generateRoleSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(0, collapse ? 16 : 8)}
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
