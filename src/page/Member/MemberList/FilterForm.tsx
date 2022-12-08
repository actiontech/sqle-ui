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
import useMember from '../../../hooks/useMember';
import EventEmitter from '../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../ProjectManage/ProjectDetail';
import {
  MemberListFilterFormFields,
  MemberListFilterFormProps,
} from './index.type';

const MemberListFilterForm: React.FC<MemberListFilterFormProps> = ({
  submit,
}) => {
  const { t } = useTranslation();
  const [form] = useForm<MemberListFilterFormFields>();
  const { projectName } = useCurrentProjectName();
  const { generateInstanceSelectOption, updateInstanceList } = useInstance();
  const { generateMemberSelectOption, updateMemberList } = useMember();

  const reset = () => {
    form.resetFields();
    submit?.({});
  };

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateMemberList(projectName);
  }, [projectName, updateInstanceList, updateMemberList]);

  useEffect(() => {
    const refreshUsernameTips = () => {
      updateMemberList(projectName);
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
  }, [projectName, updateMemberList]);

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
              {generateMemberSelectOption()}
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
              <Button htmlType="submit" type="primary">
                {t('common.search')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default MemberListFilterForm;
