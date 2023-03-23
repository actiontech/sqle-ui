import { Card, PageHeader, Space, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import GlobalSetting from './GlobalSetting';
import LDAPSetting from './LDAPSetting';
import SMTPSetting from './SMTPSetting';
/* IFTRUE_isEE */
import License from './License';
/* FITRUE_isEE */
import Wechat from './Wechat/Wechat';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initSystemModalStatus } from '../../store/system';
import { ModalName } from '../../data/ModalName';
import Oauth from './Oauth/Oauth';
import DingTalkSetting from './DingTalkSetting';
import LarkSetting from './LarkSetting';
import PersonalizeSetting from './PersonalizeSetting';

const System = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initSystemModalStatus({
        modalStatus: {
          [ModalName.Import_License]: false,
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader title={t('system.pageTitle')} ghost={false}>
        {t('system.pageDesc')}
      </PageHeader>
      <section className="padding-content">
        <Card>
          <Tabs>
            <Tabs.TabPane
              tab={t('system.tabPaneTitle.pushNotification')}
              key="pushNotification"
            >
              <Space direction="vertical" className="full-width-element">
                <SMTPSetting />
                <Wechat />
                <LarkSetting />
              </Space>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={t('system.tabPaneTitle.processConnection')}
              key="processConnection"
            >
              <DingTalkSetting />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={t('system.tabPaneTitle.loginConnection')}
              key="loginConnection"
            >
              <Space direction="vertical" className="full-width-element">
                <LDAPSetting />
                <Oauth />
              </Space>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={t('system.tabPaneTitle.globalConfiguration')}
              key="globalCOnfiguration"
            >
              <GlobalSetting />
            </Tabs.TabPane>

            {/* IFTRUE_isEE */}
            <Tabs.TabPane tab={t('system.tabPaneTitle.license')} key="license">
              <License />
            </Tabs.TabPane>
            {/* FITRUE_isEE */}

            {/* IFTRUE_isEE */}
            <Tabs.TabPane
              tab={t('system.tabPaneTitle.personalize')}
              key="personalize"
            >
              <PersonalizeSetting />
            </Tabs.TabPane>
            {/* FITRUE_isEE */}
          </Tabs>
        </Card>
      </section>
    </>
  );
};

export default System;
