import { Button, Col, Form, Row, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  filterFormButtonLayoutFactory,
  FilterFormLayout,
  FilterFormRowLayout,
} from '../../../data/common';
import useStaticStatus from '../../../hooks/useStaticStatus';
import { FilterFormProps, OrderAuditResultFilterFields } from './index.type';

const FilterFormColLayout = {
  xs: 24,
  sm: 12,
  xl: 12,
  xxl: 8,
};

const AuditResultFilterForm: React.FC<FilterFormProps> = (props) => {
  const { t } = useTranslation();

  const { generateExecStatusSelectOption, getAuditLevelStatusSelectOption } =
    useStaticStatus();

  return (
    <Form<OrderAuditResultFilterFields> {...FilterFormLayout} form={props.form}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout} hidden={props.mode !== 'order'}>
          <Form.Item
            name="filter_exec_status"
            label={t('audit.table.execStatus')}
            labelCol={{
              xxl: 4,
            }}
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
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_audit_level"
            label={t('audit.filterForm.highestAuditLevel')}
          >
            <Select
              showSearch
              allowClear
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('audit.filterForm.highestAuditLevel'),
              })}
            >
              {getAuditLevelStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(
            props.mode === 'order' ? 12 : 0,
            props.mode === 'order' ? 16 : 4,
            props.mode === 'order' ? 2 : 10
          )}
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

export default AuditResultFilterForm;
