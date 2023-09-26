import { Button, Col, Form, Popover, Radio, Row, Space } from 'antd';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BatchUpdateSqlManageReqStatusEnum } from '../../../api/common.enum';

const UpdateSQLStatus: React.FC<{
  children: ReactNode;
  onConfirm: (
    status: BatchUpdateSqlManageReqStatusEnum
  ) => Promise<void> | undefined;
  disabled: boolean;
}> = ({ children, onConfirm, disabled }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<{ status: BatchUpdateSqlManageReqStatusEnum }>();
  const [open, setOpen] = useState(false);

  const submit = async () => {
    const values = await form.validateFields();
    onConfirm(values.status)?.finally(() => {
      setOpen(false);
    });
  };

  return (
    <Popover
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      content={
        <Space direction="vertical" className="full-width-element">
          <Form form={form}>
            <Form.Item
              style={{ marginBottom: 0 }}
              name="status"
              label={t('sqlManagement.table.updateStatus.label')}
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue={BatchUpdateSqlManageReqStatusEnum.solved}
            >
              <Radio.Group>
                <Radio value={BatchUpdateSqlManageReqStatusEnum.solved}>
                  {t('sqlManagement.table.updateStatus.solve')}
                </Radio>
                <Radio value={BatchUpdateSqlManageReqStatusEnum.ignored}>
                  {t('sqlManagement.table.updateStatus.ignore')}
                </Radio>
                <Radio value={BatchUpdateSqlManageReqStatusEnum.manual_audited}>
                  {t('sqlManagement.table.updateStatus.manualAudit')}
                </Radio>
              </Radio.Group>
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

export default UpdateSQLStatus;
