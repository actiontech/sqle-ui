import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import {
  Form,
  Row,
  Col,
  Space,
  Button,
  Select,
  Typography,
  DatePicker,
  Input,
} from 'antd';
import moment from 'moment';
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

  const [collapse, { toggle: toggleCollapse }] = useBoolean(
    props.collapse ?? true
  );

  const collapseChange = React.useCallback(() => {
    const nextCollapse =
      props.collapse === undefined ? !collapse : !props.collapse;
    if (props.collapse === undefined) {
      toggleCollapse(nextCollapse);
    } else {
      props.collapseChange?.(nextCollapse);
    }
    if (nextCollapse) {
      props.form.setFieldsValue({
        filter_current_step_assignee_user_name: undefined,
        filter_task_instance_name: undefined,
        filter_order_createTime: undefined,
        filter_subject: undefined,
      });
      props.submit();
    }
  }, [collapse, props, toggleCollapse]);

  React.useEffect(() => {
    updateUsernameList();
    updateInstanceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computeDisabledDate = (current: moment.Moment) => {
    return current && current > moment().endOf('day');
  };

  const {
    generateWorkflowStepTypeSelectOption,
    generateOrderStatusSelectOption,
  } = useStaticStatus();

  const currentCollapse =
    props.collapse === undefined ? collapse : props.collapse;
  return (
    <Form className="table-filter-form" form={props.form} {...FilterFormLayout}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_create_user_name"
            label={t('order.order.createUser')}
          >
            <Select
              showSearch
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
        <Col {...FilterFormColLayout} hidden={currentCollapse}>
          <Form.Item
            name="filter_current_step_assignee_user_name"
            label={t('order.order.assignee')}
          >
            <Select
              showSearch
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.assignee'),
              })}
            >
              {generateUsernameSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={currentCollapse}>
          <Form.Item
            name="filter_task_instance_name"
            label={t('order.order.instanceName')}
          >
            <Select
              showSearch
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('order.order.instanceName'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout} hidden={currentCollapse}>
          <Form.Item name="filter_subject" label={t('order.order.name')}>
            <Input
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('order.order.name'),
              })}
            />
          </Form.Item>
        </Col>
        <Col xs={24} xl={16} xxl={12} hidden={currentCollapse}>
          <Form.Item
            name="filter_order_createTime"
            label={t('order.order.createTime')}
            labelCol={{ style: { flex: '0 0 14%' } }}
          >
            <DatePicker.RangePicker
              disabledDate={computeDisabledDate}
              showTime
            />
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(12, 16, currentCollapse ? 0 : 18)}
          className="text-align-right"
        >
          <Form.Item className="clear-margin-right" wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={props.reset}>{t('common.reset')}</Button>
              <Button type="primary" onClick={props.submit} htmlType="submit">
                {t('common.search')}
              </Button>
              <Typography.Link onClick={collapseChange}>
                {currentCollapse && (
                  <>
                    {t('common.expansion')}
                    <DownOutlined />
                  </>
                )}
                {!currentCollapse && (
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
