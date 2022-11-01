import { Button, Col, Form, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormRowLayout,
} from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import useRole from '../../../../../hooks/useRole';
import EventEmitter from '../../../../../utils/EventEmitter';
import { RoleListFilter } from '../index.type';

const RoleListFilterForm: React.FC<{
  updateRoleListFilter: (filter: RoleListFilter) => void;
}> = (props) => {
  const { roleList, updateRoleList } = useRole();
  const { t } = useTranslation();
  const [form] = useForm();

  const resetForm = React.useCallback(() => {
    form.resetFields();
    props.updateRoleListFilter({});
  }, [form, props]);

  React.useEffect(() => {
    const refresh = () => {
      updateRoleList();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_Role_list, refresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_Role_list, refresh);
    };
  }, [updateRoleList]);

  React.useEffect(() => {
    updateRoleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form<RoleListFilter>
      form={form}
      onFinish={props.updateRoleListFilter}
      className="table-filter-form"
    >
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_role_name"
            label={t('role.roleForm.roleName')}
          >
            <Select
              showSearch
              placeholder={t('role.roleListFilter.rolePlaceholder')}
            >
              {roleList.map((role) => (
                <Select.Option
                  key={role.role_name}
                  value={role.role_name ?? ''}
                >
                  {role.role_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(0, 16)}
          className="text-align-right"
        >
          <Form.Item>
            <Space>
              <Button onClick={resetForm}>{t('common.reset')}</Button>
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

export default RoleListFilterForm;
