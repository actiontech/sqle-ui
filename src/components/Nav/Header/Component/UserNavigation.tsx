import Icon, {
  LoadingOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useChangeTheme from '../../../../hooks/useChangeTheme';
import { IReduxState } from '../../../../store';
import { SupportTheme } from '../../../../theme';
import { ReactComponent as Sun } from '../../../../assets/img/sun.svg';
import { ReactComponent as Moon } from '../../../../assets/img/moon.svg';
import useUserInfo from '../../../../hooks/useUserInfo';
import user from '../../../../api/user';
import { ResponseCode } from '../../../../data/common';

const UserNavigation: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { clearUserInfo } = useUserInfo();

  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const { changeLoading, currentTheme, changeTheme } = useChangeTheme();

  const handleThemeChange = useCallback(
    (theme: SupportTheme) => {
      changeTheme(theme);
    },
    [changeTheme]
  );

  const logout = useCallback(async () => {
    const res = await user.logoutV1();
    if (res.data.code === ResponseCode.SUCCESS) {
      clearUserInfo();
      history.push('/');
    }
  }, [clearUserInfo, history]);

  return (
    <Dropdown
      overlay={
        <Menu>
          {/* https://github.com/ant-design/ant-design/issues/31025 */}
          {/* <Link to="/account"> */}
          <Menu.Item key="account" onClick={() => history.push('/account')}>
            <UserOutlined />
            {t('common.account')}
          </Menu.Item>
          {/* </Link> */}
          <Menu.Item
            hidden={currentTheme === SupportTheme.LIGHT}
            key="light"
            disabled={changeLoading}
            onClick={handleThemeChange.bind(null, SupportTheme.LIGHT)}
          >
            <Icon component={Sun} />
            {t('common.theme.light')}
            {changeLoading && <LoadingOutlined />}
          </Menu.Item>
          <Menu.Item
            hidden={currentTheme === SupportTheme.DARK}
            key="dark"
            disabled={changeLoading}
            onClick={handleThemeChange.bind(null, SupportTheme.DARK)}
          >
            <Icon component={Moon} />
            {t('common.theme.dark')}
            {changeLoading && <LoadingOutlined />}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout" onClick={logout}>
            <PoweroffOutlined /> {t('common.logout')}
          </Menu.Item>
        </Menu>
      }
    >
      <Space size={2} className="menu-wrapper">
        <UserOutlined />
        {username}
      </Space>
    </Dropdown>
  );
};

export default UserNavigation;
