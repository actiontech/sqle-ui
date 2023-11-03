import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import {
  Button,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { updateNavModalStatus } from '../../../../../store/nav';
import LocalStorageWrapper from '../../../../../utils/LocalStorageWrapper';
import StorageKey from '../../../../../data/StorageKey';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import {
  CompanyNoticeDisplayStatusEnum,
  ResponseCode,
} from '../../../../../data/common';
import { useBoolean, useRequest } from 'ahooks';
import companyNotice from '../../../../../api/companyNotice';
import EmptyBox from '../../../../EmptyBox';

const CompanyNoticeModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.nav.modalStatus[ModalName.Company_Notice]
  );
  const { isAdmin } = useCurrentUser();
  const [value, setValue] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const [hasDirtyData, setHasDirtyData] = useState(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: finishedSubmit }] =
    useBoolean(false);

  const { data, loading } = useRequest(
    () =>
      companyNotice.getCompanyNotice().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setValue(res.data.data?.notice_str ?? '');
          return res.data.data?.notice_str ?? '';
        }
      }),
    { ready: !!visible }
  );

  const resetAllState = () => {
    setValue('');
    setCanEdit(false);
    setHasDirtyData(false);
  };

  const handleCloseModal = useCallback(() => {
    dispatch(
      updateNavModalStatus({
        modalName: ModalName.Company_Notice,
        status: false,
      })
    );

    resetAllState();
  }, [dispatch]);

  const handleCancelEdit = useCallback(() => {
    setHasDirtyData(false);
    setCanEdit(false);
    setValue(data ?? '');
  }, [data]);

  const submit = () => {
    startSubmit();

    companyNotice
      .updateCompanyNotice({ notice_str: value })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('system.notification.successMessage'));
          handleCloseModal();
        }
      })
      .finally(finishedSubmit);
  };

  useEffect(() => {
    if (visible) {
      LocalStorageWrapper.set(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.Displayed
      );
    }
  }, [visible]);

  return (
    <Modal
      width={720}
      maskClosable={false}
      title={t('system.notification.title')}
      onCancel={handleCloseModal}
      open={visible}
      className="company-notice-modal-namespace"
      closable
      bodyStyle={{
        maxHeight: '600px',
      }}
      footer={
        <Space>
          {canEdit ? (
            <>
              <EmptyBox
                if={hasDirtyData}
                defaultNode={
                  <Button
                    onClick={() => {
                      setCanEdit(false);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                }
              >
                <Popconfirm
                  title={t('system.notification.hasDirtyDataTips')}
                  okText={t('common.ok')}
                  cancelText={t('common.cancel')}
                  onConfirm={handleCancelEdit}
                  okButtonProps={{ disabled: submitLoading }}
                >
                  <Button loading={submitLoading} disabled={submitLoading}>
                    {t('common.cancel')}
                  </Button>
                </Popconfirm>
              </EmptyBox>

              <Button
                onClick={submit}
                loading={submitLoading}
                disabled={submitLoading}
                type="primary"
              >
                {t('common.submit')}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCloseModal}>{t('common.close')}</Button>
              <EmptyBox if={isAdmin}>
                <Button type="primary" onClick={() => setCanEdit(true)}>
                  {t('common.edit')}
                </Button>
              </EmptyBox>
            </>
          )}
        </Space>
      }
    >
      <Spin spinning={loading}>
        <EmptyBox
          if={canEdit}
          defaultNode={
            <>
              {data ? (
                <span className="pre-warp-break-all">{data}</span>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('system.notification.notData')}
                />
              )}
            </>
          }
        >
          <Input.TextArea
            autoSize
            value={value}
            disabled={submitLoading}
            onChange={(e) => {
              setValue(e.target.value ?? '');
              setHasDirtyData(true);
            }}
          />
        </EmptyBox>
      </Spin>
    </Modal>
  );
};

export default CompanyNoticeModal;
