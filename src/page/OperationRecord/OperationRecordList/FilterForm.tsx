import { Col, Row, Form, DatePicker, Select, Space, Button, Input } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OperationRecordListFilterFormFields,
  OperationRecordListFilterFormProps,
} from '.';
import { getProjectTipsV1FunctionalModuleEnum } from '../../../api/project/index.enum';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormRowLayout,
} from '../../../data/common';
import useOperationTypeName from '../../../hooks/useOperationTypeName';
import useOperationActions from '../../../hooks/useOperationActions';
import useProject from '../../../hooks/useProject';

const computeDisabledDate = (current: moment.Moment) => {
  return current && current > moment().endOf('day');
};

const FilterForm: React.FC<OperationRecordListFilterFormProps> = ({
  updateOperationRecordListFilter,
  form,
}) => {
  const { t } = useTranslation();
  const [currentOperationTypeName, setCurrentOperationTypeName] =
    useState<string>();
  const { projectList, updateProjectList } = useProject();
  const { updateOperationTypeNameList, generateOperationTypeNameSelectOption } =
    useOperationTypeName();
  const { updateOperationActions, generateOperationActionSelectOption } =
    useOperationActions();

  const resetFilter = () => {
    form.resetFields();
    setCurrentOperationTypeName('');
    updateOperationRecordListFilter({});
  };

  const generateProjectSelectOption = useCallback(() => {
    return projectList.map((project) => {
      return (
        <Select.Option
          key={project.project_name}
          value={project.project_name ?? ''}
        >
          {project.project_name ||
            t('operationRecord.list.filterForm.platformOperation')}
        </Select.Option>
      );
    });
  }, [projectList, t]);

  useEffect(() => {
    updateOperationTypeNameList();
    updateOperationActions();
    updateProjectList({
      functional_module: getProjectTipsV1FunctionalModuleEnum.operation_record,
    });
  }, [updateOperationActions, updateOperationTypeNameList, updateProjectList]);

  return (
    <Form<OperationRecordListFilterFormFields>
      form={form}
      className="table-filter-form"
      onFinish={updateOperationRecordListFilter}
    >
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filterDate"
            label={t('operationRecord.list.filterForm.operatingTime')}
          >
            <DatePicker.RangePicker
              disabledDate={computeDisabledDate}
              showTime
            />
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="projectName"
            label={t('operationRecord.list.filterForm.projectName')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('operationRecord.list.filterForm.projectName'),
              })}
            >
              {generateProjectSelectOption()}
            </Select>
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="operationType"
            label={t('operationRecord.list.filterForm.operationType')}
          >
            <Select
              onChange={(v: string) => setCurrentOperationTypeName(v)}
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('operationRecord.list.filterForm.operationType'),
              })}
            >
              {generateOperationTypeNameSelectOption()}
            </Select>
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="operationAction"
            label={t('operationRecord.list.filterForm.operationAction')}
          >
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('operationRecord.list.filterForm.operationAction'),
              })}
            >
              {generateOperationActionSelectOption(currentOperationTypeName)}
            </Select>
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="operator"
            label={t('operationRecord.list.filterForm.operator')}
          >
            <Input
              placeholder={t('common.form.placeholder.searchInput', {
                name: t('operationRecord.list.filterForm.operator'),
              })}
            />
          </Form.Item>
        </Col>

        <Col
          {...filterFormButtonLayoutFactory(0, 0, 12)}
          className="text-align-right"
        >
          <Form.Item className="clear-margin-right">
            <Space>
              <Button onClick={resetFilter}>{t('common.reset')}</Button>
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
