import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import {
  SQLAuditListFilterFormProps,
  SQLAuditListFilterFormFields,
} from './index.type';
import {
  FilterFormLayout,
  FilterFormRowLayout,
  filterFormButtonLayoutFactory,
} from '../../../data/common';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import useStaticStatus from '../../../hooks/useStaticStatus';
import useInstance from '../../../hooks/useInstance';
import { useEffect } from 'react';

const computeDisabledDate = (current: moment.Moment) => {
  return current && current > moment().endOf('day');
};

const FilterFormColLayout = {
  xs: 24,
  sm: 12,
  xl: 8,
  xxl: 6,
};

const SQLAuditListFilterForm: React.FC<SQLAuditListFilterFormProps> = ({
  form,
  reset,
  submit,
  projectName,
}) => {
  const { t } = useTranslation();
  const { getSQLAuditRecordStatusSelectOption } = useStaticStatus();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [projectName, updateInstanceList]);
  return (
    <Form<SQLAuditListFilterFormFields> form={form} {...FilterFormLayout}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_instance_name"
            label={t('sqlAudit.list.table.filterForm.instanceName')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlAudit.list.table.filterForm.instanceName'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_sql_audit_status"
            label={t('sqlAudit.list.table.filterForm.auditStatus')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlAudit.list.table.filterForm.auditStatus'),
              })}
            >
              {getSQLAuditRecordStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="fuzzy_search_tags"
            label={t('sqlAudit.list.table.filterForm.businessTag')}
          >
            <Input
              placeholder={t('common.form.placeholder.input', {
                name: t('sqlAudit.list.table.filterForm.businessTag'),
              })}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_create_time"
            label={t('sqlAudit.list.table.filterForm.auditTime')}
          >
            <DatePicker.RangePicker
              disabledDate={computeDisabledDate}
              showTime
            />
          </Form.Item>
        </Col>

        <Col
          {...filterFormButtonLayoutFactory(12, 8, 18)}
          className="text-align-right"
        >
          <Form.Item className="clear-margin-right" wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={reset}>{t('common.reset')}</Button>
              <Button type="primary" onClick={submit} htmlType="submit">
                {t('common.search')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SQLAuditListFilterForm;
