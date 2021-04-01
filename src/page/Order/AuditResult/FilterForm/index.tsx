import { Button, Col, Form, Row, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterFormLayout,
  FilterFormRowLayout,
  FilterFormColLayout,
  filterFormButtonLayoutFactory,
} from '../../../../data/common';
import useStaticStatus from '../../../../hooks/useStaticStatus';
import { FilterFormProps, OrderAuditResultFilterFields } from './index.type';

const FilterForm: React.FC<FilterFormProps> = (props) => {
  const { t } = useTranslation();

  const {
    generateAuditStatusSelectOption,
    generateExecStatusSelectOption,
  } = useStaticStatus();

  return (
    <Form<OrderAuditResultFilterFields> {...FilterFormLayout} form={props.form}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_audit_status"
            label={t('audit.table.auditStatus')}
          >
            <Select
              showSearch
              allowClear
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('audit.table.auditStatus'),
              })}
            >
              {generateAuditStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_exec_status"
            label={t('audit.table.execStatus')}
          >
            <Select
              showSearch
              allowClear
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('audit.table.execStatus'),
              })}
            >
              {generateExecStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(12, 0, 6)}
          className="text-align-right"
        >
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={props.reset}>{t('common.reset')}</Button>
              <Button type="primary" onClick={props.submit}>
                {t('common.search')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterForm;
