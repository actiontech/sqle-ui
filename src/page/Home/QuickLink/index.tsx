import { PlusOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './index.less';

const QuickLink = () => {
  const { t } = useTranslation();

  const links = [
    <Link key="workflow" to="/order/create">
      {t('menu.workflow')}
    </Link>,
  ];

  return (
    <Popover content={links} className="fixed-widgets-dashboard-namespace">
      <Button type="primary" size="large" shape="circle">
        <PlusOutlined />
      </Button>
    </Popover>
  );
};

export default QuickLink;
