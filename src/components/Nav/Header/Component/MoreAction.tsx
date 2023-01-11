import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ModalName } from '../../../../data/ModalName';
import { updateNavModalStatus } from '../../../../store/nav';
import EmptyBox from '../../../EmptyBox';
import useCurrentUser from '../../../../hooks/useCurrentUser';

const MoreAction: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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

  return (
    <>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              key="version"
              onClick={() => openInfoDialog(ModalName.SHOW_VERSION)}
            >
              {t('system.log.version')}
            </Menu.Item>

            <EmptyBox if={isAdmin}>
              <Menu.Divider />
              <Menu.Item
                key="reportStatistics"
                onClick={() => history.push('/reportStatistics')}
              >
                {t('menu.reportStatistics')}
              </Menu.Item>
              <Menu.Divider />
              <Menu.ItemGroup title={t('menu.platformManage')}>
                <Menu.Item
                  key="userCenter"
                  onClick={() => history.push('/userCenter')}
                >
                  {t('menu.userCenter')}
                </Menu.Item>
                <Menu.Item
                  key="ruleTemplate"
                  onClick={() => history.push('/rule/template')}
                >
                  {t('menu.globalRuleTemplate')}
                </Menu.Item>
                <Menu.Item
                  key="syncDataSource"
                  onClick={() => history.push('/syncDataSource')}
                >
                  {t('menu.syncDataSource')}
                </Menu.Item>
                <Menu.Item
                  key="systemSetting"
                  onClick={() => history.push('/system')}
                >
                  {t('menu.systemSetting')}
                </Menu.Item>
              </Menu.ItemGroup>
            </EmptyBox>
          </Menu>
        }
      >
        <MoreOutlined
          className="header-more-icon"
          data-testid="more-action-icon"
        />
      </Dropdown>
    </>
  );
};

export default MoreAction;
