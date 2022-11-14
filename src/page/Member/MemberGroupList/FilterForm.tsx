import { Button, Col, Form, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormLayout,
  FilterFormRowLayout,
} from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import useInstance from '../../../hooks/useInstance';
import useUserGroup from '../../../hooks/useUserGroup';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import {
  MemberGroupListFilterFormProps,
  MemberGroupListFilterFormFields,
} from './index.type';

const MemberGroupListFilterForm: React.FC<MemberGroupListFilterFormProps> = ({
  submit,
}) => {
  const { t } = useTranslation();
  const [form] = useForm<MemberGroupListFilterFormFields>();
  const { projectName } = useCurrentProjectName();
  const { generateInstanceSelectOption, updateInstanceList } = useInstance();
  const { generateUserGroupSelectOption, updateUserGroupList } = useUserGroup();

  const reset = () => {
    form.resetFields();
    submit?.({});
  };

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateUserGroupList(projectName);
  }, [projectName, updateInstanceList, updateUserGroupList]);

  useEffect(() => {
    const refreshUserGroupNameTips = () => {
      updateUserGroupList(projectName);
    };

    EventEmitter.subscribe(
      EmitterKey.Refresh_Filter_User_Group_Tips,
      refreshUserGroupNameTips
    );

    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Filter_User_Group_Tips,
        refreshUserGroupNameTips
      );
    };
  }, [projectName, updateUserGroupList]);

  return (
    <Form<MemberGroupListFilterFormFields>
      form={form}
      {...FilterFormLayout}
      onFinish={submit}
    >
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filterUserGroupName"
            label={t('member.memberGroupList.filterForm.userGroupName')}
          >
            <Select allowClear showSearch>
              {generateUserGroupSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filterInstance"
            label={t('member.memberGroupList.filterForm.instance')}
          >
            <Select allowClear showSearch>
              {generateInstanceSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col
          {...filterFormButtonLayoutFactory(12, 0, 6)}
          className="text-align-right"
        >
          <Form.Item wrapperCol={{ span: 24 }}>
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

export default MemberGroupListFilterForm;
