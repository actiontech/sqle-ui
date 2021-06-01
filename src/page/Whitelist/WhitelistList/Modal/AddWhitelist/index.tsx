import { useBoolean } from 'ahooks';
import { Button, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import auditWhitelist from '../../../../../api/audit_whitelist';
import { ModalSize, ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateWhitelistModalStatus } from '../../../../../store/whitelist';
import EventEmitter from '../../../../../utils/EventEmitter';
import WhitelistForm from '../../../WhitelistForm';
import { WhitelistFormFields } from '../../../WhitelistForm/index.type';

const AddWhitelist = () => {
  const { t } = useTranslation();
  const [form] = useForm<WhitelistFormFields>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Add_Whitelist]
  );
  const dispatch = useDispatch();
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const closeModal = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: false,
      })
    );
  }, [dispatch, form]);

  const submit = React.useCallback(async () => {
    const values = await form.validateFields();
    startCreate();
    auditWhitelist
      .createAuditWhitelistV1({
        value: values.sql,
        desc: values.desc,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          EventEmitter.emit(EmitterKey.Refresh_Whitelist_List);
          closeModal();
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [closeModal, createFinish, form, startCreate]);

  return (
    <Modal
      title={t('whitelist.modal.add.title')}
      visible={visible}
      closable={false}
      width={ModalSize.big}
      footer={
        <>
          <Button onClick={closeModal} disabled={createLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={submit} loading={createLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <WhitelistForm form={form} />
    </Modal>
  );
};

export default AddWhitelist;
