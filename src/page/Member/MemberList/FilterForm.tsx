import { Button, Col, Form, Row, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout,
  FilterFormLayout,
  FilterFormRowLayout,
} from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import useInstance from '../../../hooks/useInstance';
import useUsername from '../../../hooks/useUsername';
import EventEmitter from '../../../utils/EventEmitter';
import { ProjectDetailLocationStateType } from '../../ProjectManage/ProjectDetail';
import {
  MemberListFilterFormFields,
  MemberListFilterFormProps,
} from './index.type';

const MemberListFilterForm: React.FC<MemberListFilterFormProps> = ({
  submit,
}) => {
  const { t } = useTranslation();
  const [form] = useForm<MemberListFilterFormFields>();
  const location = useLocation<ProjectDetailLocationStateType>();

  const { generateInstanceSelectOption, updateInstanceList } = useInstance();
  const { generateUsernameSelectOption, updateUsernameList } = useUsername();

  const reset = () => {
    form.resetFields();
    submit?.({});
  };

  useEffect(() => {
    updateInstanceList();
    updateUsernameList(location.state.projectName);
  }, [location.state.projectName, updateInstanceList, updateUsernameList]);

  useEffect(() => {
    const refreshUsernameTips = () => {
      updateUsernameList(location.state.projectName);
    };

    EventEmitter.subscribe(
      EmitterKey.Refresh_Filter_User_Tips,
      refreshUsernameTips
    );

    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Filter_User_Tips,
        refreshUsernameTips
      );
    };
  }, [location.state.projectName, updateUsernameList]);

  return (
    <Form<MemberListFilterFormFields>
      form={form}
      {...FilterFormLayout}
      onFinish={submit}
    >
      <Row {...FilterFormRowLayout}>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filterUserName"
            label={t('member.memberList.filterForm.username')}
          >
            <Select allowClear showSearch>
              {generateUsernameSelectOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col {...FilterFormColLayout}>
          <Form.Item
            name="filterInstance"
            label={t('member.memberList.filterForm.instance')}
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
              <Button type="primary">{t('common.search')}</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default MemberListFilterForm;
