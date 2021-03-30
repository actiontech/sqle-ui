import { Card, Form, Input, PageHeader } from 'antd';
import { PageFormLayout } from '../../data/common';

const Workflow = () => {
  return (
    <>
      <PageHeader title="工单创建" ghost={false}>
        您可以在这里选择数据源进行创建SQL审核工单
      </PageHeader>
      <section className="padding-content">
        <Card title="工单基本信息">
          <Form {...PageFormLayout}>
            <Form.Item name="name" label="工单名称">
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </section>
    </>
  );
};

export default Workflow;
