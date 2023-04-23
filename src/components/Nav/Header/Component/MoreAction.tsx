import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { updateNavModalStatus } from '../../../../store/nav';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useNavigate from '../../../../hooks/useNavigate';
import { useMemo } from 'react';

const MoreAction: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAdmin } = useCurrentUser();

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

  const items: MenuProps['items'] = useMemo(() => {
    const showVersion = {
      label: t('system.log.version'),
      key: 'version',
      onClick: () => openInfoDialog(ModalName.SHOW_VERSION),
    };

    const adminMenu: MenuProps['items'] = [
      {
        type: 'divider',
      },
      {
        label: t('menu.reportStatistics'),
        key: 'reportStatistics',
        onClick: () => navigate('reportStatistics'),
      },
      {
        type: 'divider',
      },
      {
        key: 'platformManage',
        type: 'group',
        label: t('menu.platformManage'),
        children: [
          {
            key: 'useCenter',
            label: t('menu.userCenter'),
            onClick: () => navigate('userCenter'),
          },
          {
            key: 'ruleTemplate',
            label: t('menu.globalRuleTemplate'),
            onClick: () => navigate('rule/template'),
          },
          {
            key: 'syncDataSource',
            label: t('menu.syncDataSource'),
            onClick: () => navigate('syncDataSource'),
          },
          {
            key: 'systemSetting',
            label: t('menu.systemSetting'),
            onClick: () => navigate('system'),
          },
        ],
      },
    ];
    return isAdmin ? [showVersion, ...adminMenu] : [showVersion];
  }, [isAdmin, openInfoDialog, navigate, t]);

  return (
    <>
      <Dropdown menu={{ items }}>
        <MoreOutlined
          className="header-more-icon"
          data-testid="more-action-icon"
        />
      </Dropdown>
    </>
  );
};

export default MoreAction;
