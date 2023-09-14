import { Button, Col, Form, Input, Row, Select, Space, Switch } from 'antd';
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
import useStaticStatus from '../../../hooks/useStaticStatus';

const FilterForm: React.FC<SQLPanelFilterFormProps> = ({
  form,
  reset,
  submit,
  projectName,
}) => {
  const { t } = useTranslation();
  const { generateInstanceSelectOption, updateInstanceList } = useInstance();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [projectName, updateInstanceList]);
  return (
    <Form<SQLPanelFilterFormFields> form={form}>
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item label="" colon={false}>
            <Input
              placeholder={t('sqlManagement.filterForm.fuzzySearchPlaceholder')}
            />
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item label={t('sqlManagement.filterForm.instanceName')}>
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
          <Form.Item label={t('sqlManagement.filterForm.source')}>
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.source'),
              })}
            ></Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item label={t('sqlManagement.filterForm.highAuditLevel')}>
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.highAuditLevel'),
              })}
            >
              {getRuleLevelStatusSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item label={t('sqlManagement.filterForm.status')}>
            <Select
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('sqlManagement.filterForm.status'),
              })}
            ></Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item label={t('sqlManagement.filterForm.relatedToMe')}>
            <Switch />
          </Form.Item>
        </Col>

        <Col
          {...filterFormButtonLayoutFactory(12, 0, 6)}
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
export default FilterForm;
