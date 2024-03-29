import { useBoolean } from 'ahooks';
import { Button, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import auditWhitelist from '../../../../../api/audit_whitelist';
import { IAuditWhitelistResV1 } from '../../../../../api/common.d';
import {
  CreateAuditWhitelistReqV1MatchTypeEnum,
  UpdateAuditWhitelistReqV1MatchTypeEnum,
} from '../../../../../api/common.enum';
import { ModalSize, ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateWhitelistModalStatus } from '../../../../../store/whitelist';
import EventEmitter from '../../../../../utils/EventEmitter';
import { useCurrentProjectName } from '../../../../ProjectManage/ProjectDetail';
import WhitelistForm from '../../../WhitelistForm';
import { WhitelistFormFields } from '../../../WhitelistForm/index.type';

const UpdateWhitelist = () => {
  const { t } = useTranslation();
  const [form] = useForm<WhitelistFormFields>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.whitelist.modalStatus[ModalName.Update_Whitelist]
  );
  const { projectName } = useCurrentProjectName();
  const currentWhitelist = useSelector<
    IReduxState,
    IAuditWhitelistResV1 | null
  >((state) => state.whitelist.selectWhitelist);
  const dispatch = useDispatch();
  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const closeModal = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Update_Whitelist,
        status: false,
      })
    );
  }, [dispatch, form]);

  const submit = React.useCallback(async () => {
    const values = await form.validateFields();
    startCreate();
    auditWhitelist
      .UpdateAuditWhitelistByIdV1({
        project_name: projectName,
        audit_whitelist_id: `${currentWhitelist?.audit_whitelist_id}`,
        value: values.sql,
        desc: values.desc,
        // emmmm... update enum should be same with create enum
        match_type:
          values.matchType as any as UpdateAuditWhitelistReqV1MatchTypeEnum,
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
  }, [
    closeModal,
    createFinish,
    currentWhitelist?.audit_whitelist_id,
    form,
    projectName,
    startCreate,
  ]);

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        sql: currentWhitelist?.value,
        desc: currentWhitelist?.desc,
        matchType:
          currentWhitelist?.match_type as CreateAuditWhitelistReqV1MatchTypeEnum,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      title={t('whitelist.modal.update.title')}
      open={visible}
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

export default UpdateWhitelist;
