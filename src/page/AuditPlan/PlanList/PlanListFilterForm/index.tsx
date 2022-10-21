import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormLayout,
  FilterFormRowLayout,
} from '../../../../data/common';
import useAuditPlanTypes from '../../../../hooks/useAuditPlanTypes';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import useInstance from '../../../../hooks/useInstance';
import {
  PlanListFilterFormFields,
  PlanListFilterFormProps,
} from './index.type';

const PlanListFilterForm: React.FC<PlanListFilterFormProps> = (props) => {
  const { submit } = props;

  const [form] = useForm<PlanListFilterFormFields>();

  const { t } = useTranslation();

  const { generateInstanceSelectOption, updateInstanceList } = useInstance();
  const { generateDriverSelectOptions, updateDriverNameList } =
    useDatabaseType();
  const { generateAuditPlanTypesOption, updateAuditPlanTypes } =
    useAuditPlanTypes();

  useEffect(() => {
    updateInstanceList();
    updateDriverNameList();
    updateAuditPlanTypes();
  }, [updateAuditPlanTypes, updateDriverNameList, updateInstanceList]);

  const reset = () => {
    form.resetFields();
    submit?.({});
  };
  const innerSubmit = () => {
    submit?.(form.getFieldsValue());
  };

  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    form.setFieldsValue({
      filter_audit_plan_type: params.get('type') ?? undefined
    })
    innerSubmit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, location.search])

  return (
    <Form<PlanListFilterFormFields> form={form} {...FilterFormLayout}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_audit_plan_name"
            label={t('auditPlan.list.table.audit_plan_name')}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_audit_plan_instance_name"
            label={t('auditPlan.list.table.audit_plan_instance_name')}
          >
            <Select allowClear showSearch>
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_audit_plan_type"
            label={t('auditPlan.list.table.audit_plan_type')}
          >
            <Select allowClear showSearch>
              {generateAuditPlanTypesOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_audit_plan_db_type"
            label={t('auditPlan.list.table.audit_plan_db_type')}
          >
            <Select allowClear showSearch>
              {generateDriverSelectOptions()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(12, 8, 18)}
          className="text-align-right"
        >
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={reset}>{t('common.reset')}</Button>
              <Button type="primary" onClick={innerSubmit}>
                {t('common.search')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PlanListFilterForm;
