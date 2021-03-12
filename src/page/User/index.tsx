import { Card, Divider, List, PageHeader, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import user from '../../api/user';

import './index.less';

const User = () => {
  const { t } = useTranslation();

  const { data, loading } = useRequest(
    ({ current, pageSize }) =>
      user.getUserListV1({
        page_index: current,
        page_size: pageSize,
      }),
    {
      paginated: true,
      formatResult(res) {
        return {
          list: res.data.data ?? [],
          total: res.data.total_nums ?? 0,
        };
      },
    }
  );

  return (
    <article className="user-manage-page">
      <PageHeader title={t('user.pageTitle')} ghost={false}></PageHeader>
      <section className="padding-content">
        <Card title={t('user.userListTitle')}>
          <List
            loading={loading}
            dataSource={data?.list}
            renderItem={(item) => (
              <List.Item className="user-row-wrapper">
                <List.Item.Meta
                  title={item.user_name}
                  description={item.email || '未填写邮箱'}
                />
                <div className="user-cell">
                  <div>拥有角色</div>
                  {item.role_name_list?.join(',')}
                </div>
                <Space className="user-cell flex-end-horizontal">
                  <Typography.Link className="pointer">编辑</Typography.Link>
                  <Divider type="vertical" />
                  <Typography.Text type="danger" className="pointer">
                    删除
                  </Typography.Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      </section>
    </article>
  );
};

export default User;
