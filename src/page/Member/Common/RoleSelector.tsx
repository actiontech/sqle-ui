import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useInstance from '../../../hooks/useInstance';
import useRole from '../../../hooks/useRole';

const RoleSelector: React.FC<{ projectName: string }> = ({ projectName }) => {
  const { t } = useTranslation();
  const { updateRoleList, generateRoleSelectOption } = useRole();
  const { updateInstanceList, generateInstanceSelectOption } = useInstance();
  useEffect(() => {
    updateRoleList();
    updateInstanceList({ project_name: projectName });
  }, [projectName, updateInstanceList, updateRoleList]);

  return (
    <Form.List name="roles" initialValue={[]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Row key={field.key}>
              <Col span={12}>
                <Form.Item
                  labelCol={{
                    xs: { span: 24 },
                    sm: { span: 14 },
                  }}
                  wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 10 },
                  }}
                  label={t('member.roleSelector.role')}
                  {...field}
                  name={[field.name, 'role_names']}
                  rules={[{ required: true }]}
                >
                  <Select<string>
                    mode="multiple"
                    showSearch
                    placeholder={t('common.form.placeholder.select', {
                      name: t('member.roleSelector.role'),
                    })}
                  >
                    {generateRoleSelectOption()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10} offset={1}>
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
                        sm: { span: 7 },
                      }}
                      wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 10 },
                      }}
                      {...field}
                      name={[field.name, 'instance_name']}
                      label={t('member.roleSelector.instance')}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder={t('common.form.placeholder.select', {
                          name: t('member.roleSelector.instance'),
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
                <MinusCircleOutlined
                  data-testid="remove-item"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    remove(index);
                  }}
                />
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
              {t('member.roleSelector.addRole')}
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default RoleSelector;
