import { Button, Col, Form, Popover, Row, Select, Space, Spin } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import useMember from '../../../hooks/useMember';
import { useTranslation } from 'react-i18next';

const AssignMember: React.FC<{
  children: ReactNode;
  projectName: string;
  onConfirm: (values: string[]) => Promise<void> | undefined;
  disabled: boolean;
}> = ({ children, projectName, onConfirm, disabled }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<{ members: string[] }>();
  const [open, setOpen] = useState(false);
  const { generateMemberSelectOption, updateMemberList, loading } = useMember();

  const submit = async () => {
    const values = await form.validateFields();
    onConfirm(values.members)?.finally(() => {
      setOpen(false);
      form.resetFields();
    });
  };

  useEffect(() => {
    if (open) {
      updateMemberList(projectName);
    }
  }, [open, projectName, updateMemberList]);
  return (
    <Popover
      trigger={['click']}
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setOpen(true);
        } else {
          setOpen(false);
          form.resetFields();
        }
      }}
      content={
        <Spin spinning={loading}>
          <Space direction="vertical" className="full-width-element">
            <Form form={form}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="members"
                label={t('sqlManagement.table.assignMember.label')}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  style={{ width: 200 }}
                  showSearch
                  allowClear
                  mode="multiple"
                >
                  {generateMemberSelectOption()}
                </Select>
              </Form.Item>
            </Form>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="primary" size="small" onClick={submit}>
                    {t('common.ok')}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </Spin>
      }
    >
      <div
        onClick={() => {
          if (disabled) {
            return;
          }
          setOpen(true);
        }}
      >
        {children}
      </div>
    </Popover>
  );
};

export default AssignMember;
