import { Space } from 'antd';
import HeaderMenu from './Component/HeaderMenu';
import Logo from './Component/Logo';
import MoreAction from './Component/MoreAction';
import UserNavigation from './Component/UserNavigation';
import NavModal from './Modal';

/* IFTRUE_isEE */
import OperationRecordNavigation from './Component/OperationRecordNavigation';
import CompanyNoticeTrigger from './Component/CompanyNoticeTrigger';
/* FITRUE_isEE */

const Header: React.FC = () => {
  return (
    <>
      <header className="sqle-header">
        <Space>
          <Logo />
          <HeaderMenu />
        </Space>

        <Space>
          {/* IFTRUE_isEE */}
          <CompanyNoticeTrigger />
          <OperationRecordNavigation />
          {/* FITRUE_isEE */}

          {/* <LanguageSelect /> */}
          <UserNavigation />
          <MoreAction />
        </Space>
      </header>
      <NavModal />
    </>
  );
};

export default Header;
