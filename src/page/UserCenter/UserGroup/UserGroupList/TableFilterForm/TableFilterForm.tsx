import { Row, Col, Select, Space, Button, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TableFilterFormProps, UserGroupListFilter } from '.';
import {
  FilterFormRowLayout,
  FilterFormColLayout,
  filterFormButtonLayoutFactory,
} from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import useUserGroup from '../../../../../hooks/useUserGroup';
import EventEmitter from '../../../../../utils/EventEmitter';

const TableFilterForm: React.FC<TableFilterFormProps> = (props) => {
  const [form] = useForm();

  const resetFilter = () => {
    form.resetFields();
  };

  const { t } = useTranslation();

  const { generateUserGroupSelectOption, updateUserGroupList } = useUserGroup();

  useEffect(() => {
    const refresh = () => {
      updateUserGroupList();
    };

    EventEmitter.subscribe(EmitterKey.Refresh_User_Group_List, refresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_User_Group_List, refresh);
    };
  }, [updateUserGroupList]);

  useEffect(() => {
    updateUserGroupList();
  }, [updateUserGroupList]);

  return (
    <Form<UserGroupListFilter>
      form={form}
      className="table-filter-form"
      onFinish={props.updateTableFilter}
    >
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filter_user_group_name"
            label={t('userGroup.userGroupField.userGroupName')}
          >
            <Select
              allowClear
              showSearch
              placeholder={t('common.form.placeholder.searchSelect', {
                name: t('userGroup.userGroupField.userGroupName'),
              })}
            >
              {generateUserGroupSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(0, 8, 12)}
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

export default TableFilterForm;
