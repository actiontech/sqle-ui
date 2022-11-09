import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyBox from '../../../components/EmptyBox';
import useInstance from '../../../hooks/useInstance';
import useRole from '../../../hooks/useRole';

const RoleSelector: React.FC = () => {
  const { t } = useTranslation();
  const { updateRoleList, generateRoleSelectOption } = useRole();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();

  useEffect(() => {
    updateRoleList();
    updateInstanceList();
  }, [updateInstanceList, updateRoleList]);

  return (
    <Form.List name="roles" initialValue={[{}]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Row key={field.key}>
              <Col span={12}>
                <Form.Item
                  labelCol={{
                    xs: { span: 24 },
                    sm: { span: 8 },
                  }}
                  wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 14 },
                  }}
                  label={t('member.memberForm.role')}
                  {...field}
                  name={[field.name, 'role_names']}
                >
                  <Select<string>
                    mode="multiple"
                    showSearch
                    placeholder={t('common.form.placeholder.select', {
                      name: t('member.memberForm.role'),
                    })}
                  >
                    {generateRoleSelectOption()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) => {
                    return (
                      prevValues?.roles[index]?.instance_name !==
                      curValues?.roles[index]?.instance_name
                    );
                  }}
                >
                  {() => (
                    <Form.Item
                      labelCol={{
                        xs: { span: 24 },
                        sm: { span: 6 },
                      }}
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 14 },
                      }}
                      {...field}
                      name={[field.name, 'instance_name']}
                      label={t('member.memberForm.instance')}
                    >
                      <Select
                        placeholder={t('common.form.placeholder.select', {
                          name: t('member.memberForm.instance'),
                        })}
                        showSearch
                        allowClear
                      >
                        {generateInstanceSelectOption()}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              <Col span={1}>
                <EmptyBox if={index !== 0}>
                  <MinusCircleOutlined
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      remove(index);
                    }}
                  />
                </EmptyBox>
              </Col>
            </Row>
          ))}
          <Form.Item label=" " colon={false}>
            <Button
              type="dashed"
              onClick={() => {
                add();
              }}
              block
              icon={<PlusOutlined />}
            >
              {t('common.add')}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default RoleSelector;
