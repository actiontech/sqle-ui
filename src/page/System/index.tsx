import { PageHeader, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import GlobalSetting from './GlobalSetting';
import LDAPSetting from './LDAPSetting';
import SMTPSetting from './SMTPSetting';
/* IFTRUE_isEE */
import License from './License';
import Wechat from './Wechat/Wechat';
/* FITRUE_isEE */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initSystemModalStatus } from '../../store/system';
import { ModalName } from '../../data/ModalName';
import Oauth from './Oauth/Oauth';

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
        <Space direction="vertical" className="full-width-element">
          <SMTPSetting />
          {/* IFTRUE_isEE */}
          <Wechat />
          {/* FITRUE_isEE */}
          <GlobalSetting />
          <LDAPSetting />
          {/* IFTRUE_isEE */}
          <License />
          {/* FITRUE_isEE */}
          <Oauth />
        </Space>
      </section>
    </>
  );
};

export default System;
