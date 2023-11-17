import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
  Switch,
} from 'antd';
import {
  SQLPanelFilterFormFields,
  SQLPanelFilterFormProps,
} from './index.type';
import { useTranslation } from 'react-i18next';
import { FilterFormColLayout, FilterFormRowLayout } from '../../../data/common';
import useInstance from '../../../hooks/useInstance';
import { useEffect } from 'react';
import moment from 'moment';
import useStaticStatus from './hooks/useStaticStatus';
import { getInstanceTipListV1FunctionalModuleEnum } from '../../../api/instance/index.enum';
import { GetSqlManageListFilterStatusEnum } from '../../../api/SqlManage/index.enum';
import useRuleTips from './hooks/useRuleTips';
import { extractTextFromReactNode } from '../../../utils/Common';

const FilterForm: React.FC<SQLPanelFilterFormProps> = ({
  form,
  reset,
  submit,
  projectName,
}) => {
  const { t } = useTranslation();
  const {
    generateInstanceSelectOption,
    updateInstanceList,
    loading: getInstanceListLoading,
  } = useInstance();
  const {
    generateRuleTipsSelectOptions,
    updateRuleTips,
    loading: getRuleTipsLoading,
  } = useRuleTips();
  const {
    generateSourceSelectOptions,
    generateAuditLevelSelectOptions,
    generateStatusSelectOptions,
  } = useStaticStatus();
  const computeDisabledDate = (current: moment.Moment) => {
    return current && current > moment().endOf('day');
  };

  const ruleTipsFilterOptions: SelectProps['filterOption'] = (
    inputValue,
    option
  ) => {
    const label = extractTextFromReactNode(option?.label);
    return label.toLowerCase().includes(inputValue.toLowerCase());
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
    updateRuleTips(projectName);
  }, [form, projectName, updateInstanceList, updateRuleTips]);
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
              loading={getInstanceListLoading}
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
            name="filter_rule"
            label={t('sqlManagement.filterForm.rule')}
          >
            <Select
              filterOption={ruleTipsFilterOptions}
              optionFilterProp="children"
              loading={getRuleTipsLoading}
              showSearch
            >
              {generateRuleTipsSelectOptions()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            label={t('sqlManagement.filterForm.endpoint')}
            name="fuzzy_search_endpoint"
          >
            <Input
              placeholder={t('common.form.placeholder.input', {
                name: t('sqlManagement.filterForm.endpoint'),
              })}
            />
          </Form.Item>
        </Col>

        <Col
          {...{
            xs: 24,
            sm: {
              span: 24,
              offset: 0,
            },
            xl: {
              span: 8,
              offset: 0,
            },
            xxl: {
              span: 24,
              offset: 0,
            },
          }}
          className="flex-space-between"
        >
          <Form.Item
            label={t('sqlManagement.filterForm.relatedToMe')}
            name="filter_assignee"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className="clear-margin-right" label=" " colon={false}>
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
