import Icon, {
  LoadingOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useChangeTheme from '../../../../hooks/useChangeTheme';
import { IReduxState } from '../../../../store';
import { SupportTheme } from '../../../../theme';
import { ReactComponent as Sun } from '../../../../assets/img/sun.svg';
import { ReactComponent as Moon } from '../../../../assets/img/moon.svg';
import useUserInfo from '../../../../hooks/useUserInfo';
import user from '../../../../api/user';
import { ResponseCode } from '../../../../data/common';
import useNavigate from '../../../../hooks/useNavigate';
import { useMemo } from 'react';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

const UserNavigation: React.FC = () => {
  const navigate = useNavigate();
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
      navigate('/login', { replace: true });
    }
  }, [clearUserInfo, navigate]);

  const items: MenuProps['items'] = useMemo(() => {
    const menu: MenuProps['items'] = [
      {
        icon: <UserOutlined />,
        label: <>{t('common.account')}</>,
        key: 'account',
        onClick: () => navigate('account'),
      },
    ];

    const lightMode: ItemType = {
      icon: <Icon component={Sun} />,
      label: (
        <>
          {t('common.theme.light')}
          {changeLoading && <LoadingOutlined />}
        </>
      ),
      key: 'light',
      disabled: changeLoading,
      onClick: () => handleThemeChange(SupportTheme.LIGHT),
    };

    const darkMode: ItemType = {
      icon: <Icon component={Moon} />,
      label: (
        <>
          {t('common.theme.dark')}
          {changeLoading && <LoadingOutlined />}
        </>
      ),
      key: 'dark',
      disabled: changeLoading,
      onClick: () => handleThemeChange(SupportTheme.DARK),
    };

    const logoutItem: ItemType = {
      icon: <PoweroffOutlined />,
      label: <>{t('common.logout')}</>,
      key: 'logout',
      onClick: logout,
    };

    return [
      ...menu,
      currentTheme === SupportTheme.LIGHT ? darkMode : lightMode,
      logoutItem,
    ];
  }, [t, changeLoading, logout, currentTheme, navigate, handleThemeChange]);

  return (
    <Dropdown menu={{ items }}>
      <Space size={2} className="menu-wrapper">
        <UserOutlined />
        {username}
      </Space>
    </Dropdown>
  );
};

export default UserNavigation;
