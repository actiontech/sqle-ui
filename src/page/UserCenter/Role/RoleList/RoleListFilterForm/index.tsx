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
import useInstance from '../../../../../hooks/useInstance';
import useRole from '../../../../../hooks/useRole';
import useUsername from '../../../../../hooks/useUsername';
import EventEmitter from '../../../../../utils/EventEmitter';
import { RoleListFilter } from '../index.type';

const RoleListFilterForm: React.FC<{
  updateRoleListFilter: (filter: RoleListFilter) => void;
}> = (props) => {
  const { roleList, updateRoleList } = useRole();
  const { instanceList, updateInstanceList } = useInstance();
  const { usernameList, updateUsernameList } = useUsername();
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
    const refresh = () => {
      updateUsernameList();
    };
    EventEmitter.subscribe(EmitterKey.Refresh_User_list, refresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_User_list, refresh);
    };
  }, [updateUsernameList]);

  React.useEffect(() => {
    updateInstanceList();
    updateUsernameList();
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
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_user_name"
            label={t('role.roleForm.usernames')}
          >
            <Select
              showSearch
              placeholder={t('role.roleListFilter.usernamePlaceholder')}
            >
              {usernameList.map((user) => (
                <Select.Option
                  key={user.user_name}
                  value={user.user_name ?? ''}
                >
                  {user.user_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_instance_name"
            label={t('role.roleForm.databases')}
          >
            <Select
              showSearch
              placeholder={t('role.roleListFilter.databasePlaceholder')}
            >
              {instanceList.map((instance) => (
                <Select.Option
                  key={instance.instance_name}
                  value={instance.instance_name ?? ''}
                >
                  {instance.instance_name}
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
