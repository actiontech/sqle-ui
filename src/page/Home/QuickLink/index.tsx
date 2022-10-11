import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import './index.less';

const QuickLink = () => {
  const { t } = useTranslation();

  return (
    <section className="fixed-widgets-dashboard-namespace">
      <Link to="/order/create">
        <Button type="primary" shape="round">
          <PlusOutlined />
          {t('order.createOrder.title')}
        </Button>
      </Link>
    </section>
  );
};

export default QuickLink;
