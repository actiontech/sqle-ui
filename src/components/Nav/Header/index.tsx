import { Dropdown, Menu, Space } from 'antd';
import React, { useCallback, useEffect } from 'react';
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
  QuestionCircleOutlined,
} from '@ant-design/icons';
import LanguageSelect from '../../LanguageSelect';
import { useTranslation } from 'react-i18next';
import { updateToken, updateUser } from '../../../store/user';
import { useHistory } from 'react-router';
import { ModalName } from '../../../data/ModalName';
import { initNavModalStatus, updateNavModalStatus } from '../../../store/nav';
import NavModal from './Modal';

const Header = () => {
  const username = useSelector<IReduxState, string>(
    (state) => state.user.username
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const { changeLoading, currentTheme, changeTheme } = useChangeTheme();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      initNavModalStatus({
        modalStatus: {
          [ModalName.SHOW_VERSION]: false,
        },
      })
    );
  }, [dispatch]);

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

  const openInfoDialog = useCallback(
    (modalName: ModalName) => {
      dispatch(
        updateNavModalStatus({
          modalName: modalName,
          status: true,
        })
      );
    },
    [dispatch]
  );

  return (
    <header>
      <Space align="center" className="header-wrapper">
        <LanguageSelect />
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

        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="version"
                onClick={() => openInfoDialog(ModalName.SHOW_VERSION)}
              >
                {t('system.log.version')}
              </Menu.Item>
            </Menu>
          }
        >
          <QuestionCircleOutlined data-testid="system-icon" />
        </Dropdown>
      </Space>

      <NavModal />
    </header>
  );
};

export default Header;
