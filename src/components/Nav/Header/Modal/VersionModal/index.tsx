import React, { useEffect, useState } from 'react';
import { Button, Modal, Space, Typography } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { UI_VERSION } from '../../../../../scripts/version';
import { IReduxState } from '../../../../../store';
import { updateNavModalStatus } from '../../../../../store/nav';
import GlobalService from '../../../../../api/global';

const VersionModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const visible = useSelector<IReduxState, boolean>(
    (state) => state.nav.modalStatus[ModalName.SHOW_VERSION]
  );
  const [serverVersion, setServerVersion] = useState<string>('');
  const handleCloseModal = useCallback(() => {
    dispatch(
      updateNavModalStatus({
        modalName: ModalName.SHOW_VERSION,
        status: false,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      GlobalService.getSQLEInfoV1().then((res) => {
        setServerVersion(formatServerVersion(res.data.data?.version));
      });
    }
  }, [visible]);

  const formatServerVersion = (version?: string): string => {
    if (!version) {
      return '';
    }
    const versionArr = version.replace(/"/g, '').split(' ');
    if (versionArr.length === 1) {
      return versionArr[0];
    }
    return `${versionArr[0]} ${versionArr[1].slice(0, 10)}`;
  };

  return (
    <Modal
      title={t('system.log.version_title')}
      onCancel={handleCloseModal}
      visible={visible}
      className="version-modal-namespace"
      footer={
        <>
          <Button type="primary">
            <a
              target="_blank"
              href="https://github.com/actiontech/sqle"
              rel="noreferrer"
            >
              {t('common.showMore')}
            </a>
          </Button>
          <Button type="primary" onClick={handleCloseModal}>
            {t('common.close')}
          </Button>
        </>
      }
    >
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <Typography.Title level={2}>SQLE</Typography.Title>
        <Typography.Title level={5}>UI Version: {UI_VERSION}</Typography.Title>
        <Typography.Title level={5}>
          Server Version: {serverVersion}
        </Typography.Title>
        <Typography.Paragraph strong className="text-indent">
          {t('system.log.sqle_desc')}
        </Typography.Paragraph>
        <Typography.Paragraph
          strong
          className="text-indent"
          style={{ whiteSpace: 'pre-line' }}
        >
          {t('system.log.sqle_feature')}
        </Typography.Paragraph>
      </Space>
    </Modal>
  );
};
export default VersionModal;
