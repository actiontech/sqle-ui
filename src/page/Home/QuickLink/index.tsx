import { Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SystemRole } from '../../../data/common';
import { IReduxState } from '../../../store';

const QuickLink = () => {
  const { t } = useTranslation();
  const isAdmin = useSelector<IReduxState, boolean>(
    (state) => state.user.role === SystemRole.admin
  );

  const links = [
    <Link key="workflow" to="/order/create">
      {t('menu.workflow')}
    </Link>,
    <Link key="order" to="/order">
      {t('menu.order')}
    </Link>,
    <Link key="rule" to="/rule">
      {t('menu.rule')}
    </Link>,
  ];

  if (isAdmin) {
    links.push(
      ...[
        <Link key="user" to="/user">
          {t('menu.user')}
        </Link>,
        <Link key="data" to="/data">
          {t('menu.dataSource')}
        </Link>,
        <Link key="ruleTemplate" to="/rule/template">
          {t('menu.ruleTemplate')}
        </Link>,
      ]
    );
  }

  return (
    <Card title={t('dashboard.title.quickLink')}>
      <Space>{links}</Space>
    </Card>
  );
};

export default QuickLink;
