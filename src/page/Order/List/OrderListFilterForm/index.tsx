import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import { Form, Row, Col, Space, Button, Select, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FilterFormRowLayout,
  FilterFormColLayout,
  filterFormButtonLayoutFactory,
  FilterFormLayout,
} from '../../../../data/common';
import useInstance from '../../../../hooks/useInstance';
import useStaticStatus from '../../../../hooks/useStaticStatus';
import useUsername from '../../../../hooks/useUsername';
import { OrderListFilterFormProps } from './index.type';

const OrderListFilterForm: React.FC<OrderListFilterFormProps> = (props) => {
  const { t } = useTranslation();
  const { updateUsernameList, generateUsernameSelectOption } = useUsername();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();

  const [collapse, { toggle: toggleCollapse }] = useBoolean(true);

  const collapseChange = React.useCallback(() => {
    toggleCollapse(!collapse);
    if (!collapse) {
      props.form.setFieldsValue({
        filter_current_step_assignee_user_name: undefined,
        filter_task_status: undefined,
        filter_task_instance_name: undefined,
      });
      props.submit();
    }
  }, [collapse, props, toggleCollapse]);

  React.useEffect(() => {
    updateUsernameList();
    updateInstanceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    generateWorkflowStepTypeSelectOption,
    generateOrderStatusSelectOption,
    generateSqlTaskStatusSelectOption,
  } = useStaticStatus();

  return (
    <Form className="table-filter-form" form={props.form} {...FilterFormLayout}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_user_name"
            label={t('order.order.createUser')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.createUser'),
              })}
            >
              {generateUsernameSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_current_step_type"
            label={t('order.order.stepType')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.stepType'),
              })}
            >
              {generateWorkflowStepTypeSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item name="filter_status" label={t('order.order.status')}>
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.status'),
              })}
            >
              {generateOrderStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            name="filter_current_step_assignee_user_name"
            label={t('order.order.assignee')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.assignee'),
              })}
            >
              {generateUsernameSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            name="filter_task_status"
            label={t('order.order.sqlTaskStatus')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.sqlTaskStatus'),
              })}
            >
              {generateSqlTaskStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={collapse}>
          <Form.Item
            name="filter_task_instance_name"
            label={t('order.order.instanceName')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.instanceName'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(12, 16, collapse ? 0 : 6)}
          className="text-align-right"
        >
          <Form.Item className="clear-margin-right" wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={props.reset}>{t('common.reset')}</Button>
              <Button type="primary" onClick={props.submit} htmlType="submit">
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

export default OrderListFilterForm;
