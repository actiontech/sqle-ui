import { Space } from 'antd';
import LanguageSelect from '../../LanguageSelect';
import HeaderMenu from './Component/HeaderMenu';
import Logo from './Component/Logo';
import MoreAction from './Component/MoreAction';
import UserNavigation from './Component/UserNavigation';
import NavModal from './Modal';

const Header: React.FC = () => {
  return (
    <header className="sqle-header">
      <Space>
        <Logo />
        <HeaderMenu />
      </Space>

      <Space>
        <LanguageSelect />
        <UserNavigation />
        <MoreAction />
      </Space>

      <NavModal />
    </header>
  );
};

export default Header;
