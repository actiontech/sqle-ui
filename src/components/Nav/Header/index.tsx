import { Dropdown, Menu, Space } from 'antd';
import React from 'react';
import useChangeTheme from '../../../hooks/useChangeTheme';
import { SupportTheme } from '../../../theme';
import { ReactComponent as Moon } from '../../../assets/img/moon.svg';
import { ReactComponent as Sun } from '../../../assets/img/sun.svg';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import Icon, {
  UserOutlined,
  PoweroffOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import LanguageSelect from '../../LanguageSelect';
import { useTranslation } from 'react-i18next';
import { updateToken, updateUser } from '../../../store/user';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const Header = () => {
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const { changeLoading, currentTheme, changeTheme } = useChangeTheme();
  const { t } = useTranslation();

  const handleThemeChange = React.useCallback(
    (theme: SupportTheme) => {
      changeTheme(theme);
    },
    [changeTheme]
  );

  const logout = React.useCallback(() => {
    dispatch(updateToken({ token: '' }));
    dispatch(updateUser({ username: '', role: '' }));
    history.push('/');
  }, [dispatch, history]);

  return (
    <header>
      <Space align="center" className="header-wrapper">
        <LanguageSelect />
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <Link to="/account">
                  <UserOutlined />
                  {t('common.account')}
                </Link>
              </Menu.Item>
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
      </Space>
    </header>
  );
};

export default Header;
