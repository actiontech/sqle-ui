import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from 'antd';
import {
  SQLPanelFilterFormFields,
  SQLPanelFilterFormProps,
} from './index.type';
import { useTranslation } from 'react-i18next';
import {
  FilterFormColLayout,
  FilterFormRowLayout,
  filterFormButtonLayoutFactory,
} from '../../../data/common';
import useInstance from '../../../hooks/useInstance';
import { useEffect } from 'react';
import moment from 'moment';
import useStaticStatus from './hooks/useStaticStatus';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../api/instance/index.enum';
import { GetSqlManageListFilterStatusEnum } from '../../../api/SqlManage/index.enum';

const FilterForm: React.FC<SQLPanelFilterFormProps> = ({
  form,
  reset,
  submit,
  projectName,
}) => {
  const { t } = useTranslation();
  const { generateInstanceSelectOption, updateInstanceList } = useInstance();
  const {
    generateSourceSelectOptions,
    generateAuditLevelSelectOptions,
    generateStatusSelectOptions,
  } = useStaticStatus();
  const computeDisabledDate = (current: moment.Moment) => {
    return current && current > moment().endOf('day');
  };
  useEffect(() => {
    form.setFieldValue(
      'filter_status',
      GetSqlManageListFilterStatusEnum.unhandled
    );
    updateInstanceList({
      project_name: projectName,
      functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_manage,
    });
  }, [form, projectName, updateInstanceList]);
  return (
    <Form<SQLPanelFilterFormFields> form={form} onFinish={submit}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.source')}
            name="filter_source"
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.source'),
              })}
              options={generateSourceSelectOptions}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.SQLFingerprint')}
            name="fuzzy_search_sql_fingerprint"
          >
            <Input
              placeholder={t('common.form.placeholder.input', {
                name: t('sqlManagement.filterForm.SQLFingerprint'),
              })}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.instanceName')}
            name="filter_instance_name"
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.instanceName'),
              })}
            >
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.auditLevel')}
            name="filter_audit_level"
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.auditLevel'),
              })}
              options={generateAuditLevelSelectOptions}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.status')}
            name="filter_status"
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.status'),
              })}
              options={generateStatusSelectOptions}
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_last_audit_time"
            label={t('sqlManagement.filterForm.time')}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              disabledDate={computeDisabledDate}
              showTime
            />
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.relatedToMe')}
            name="filter_assignee"
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col
          {...filterFormButtonLayoutFactory(0, 8, 0)}
          className="text-align-right"
        >
          <Form.Item className="clear-margin-right" wrapperCol={{ span: 24 }}>
            <Space>
              <Button onClick={reset}>{t('common.reset')}</Button>
              <Button type="primary" htmlType="submit">
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
