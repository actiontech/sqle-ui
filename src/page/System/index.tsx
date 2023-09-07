import { Card, PageHeader, Space, Tabs, TabsProps } from 'antd';
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
import WebHook from './WebhookSetting/Webhook';
import LarkAuditSetting from './LarkAuditSetting';

const System = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tabsItems: TabsProps['items'] = [
    {
      label: t('system.tabPaneTitle.pushNotification'),
      key: 'pushNotification',
      children: (
        <Space direction="vertical" className="full-width-element">
          <SMTPSetting />
          <Wechat />
          <LarkSetting />
          <WebHook />
        </Space>
      ),
    },
    {
      label: t('system.tabPaneTitle.processConnection'),
      key: 'processConnection',
      children: (
        <Space direction="vertical" className="full-width-element">
          <DingTalkSetting />
          <LarkAuditSetting />
        </Space>
      ),
    },
    {
      label: t('system.tabPaneTitle.loginConnection'),
      key: 'loginConnection',
      children: (
        <Space direction="vertical" className="full-width-element">
          <LDAPSetting />
          <Oauth />
        </Space>
      ),
    },
    {
      label: t('system.tabPaneTitle.globalConfiguration'),
      key: 'globalConfiguration',
      children: <GlobalSetting />,
    },
    /* IFTRUE_isEE */
    {
      label: t('system.tabPaneTitle.license'),
      key: 'license',
      children: <License />,
    },
    /* FITRUE_isEE */

    /* IFTRUE_isEE */
    {
      label: t('system.tabPaneTitle.personalize'),
      key: 'personalize',
      children: <PersonalizeSetting />,
    },
    /* FITRUE_isEE */
  ];

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
          <Tabs items={tabsItems} />
        </Card>
      </section>
    </>
  );
};

export default System;
