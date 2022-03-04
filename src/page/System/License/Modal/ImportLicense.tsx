import { useBoolean } from 'ahooks';
import { Button, Form, message, Modal, Table, Upload } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { RcFile } from 'antd/lib/upload';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { licenseColumn } from '..';
import { ILicenseItem } from '../../../../api/common';
import configuration from '../../../../api/configuration';
import {
  ModalFormLayout,
  ModalSize,
  ResponseCode,
} from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import { updateSystemModalStatus } from '../../../../store/system';
import { getFileFromUploadChangeEvent } from '../../../../utils/Common';
import EventEmitter from '../../../../utils/EventEmitter';

const ImportModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.system.modalStatus[ModalName.Import_License]
  );

  const [licenseData, setLicenseData] = useState<ILicenseItem[]>([]);
  const [prepareLoading, { setTrue: startPrepare, setFalse: prepareFinish }] =
    useBoolean();
  const [form] = useForm();

  const fileChange = (currentFile: RcFile) => {
    startPrepare();
    configuration
      .checkSQLELicenseV1({
        license_file: currentFile,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setLicenseData(res.data.license ?? []);
        } else {
          setLicenseData([]);
        }
      })
      .catch(() => {
        setLicenseData([]);
      })
      .finally(() => {
        prepareFinish();
      });
    return false;
  };

  const close = () => {
    form.resetFields();
    dispatch(
      updateSystemModalStatus({
        modalName: ModalName.Import_License,
        status: false,
      })
    );
  };

  const [importLoading, { setTrue: startImport, setFalse: importFinish }] =
    useBoolean();

  const submit = async () => {
    const values = await form.validateFields();
    startImport();
    try {
      const res = await configuration.setSQLELicenseV1({
        license_file: values.file?.[0],
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        close();
        EventEmitter.emit(EmitterKey.Refresh_License);
        message.success(t('system.license.importSuccessTips'));
      }
    } finally {
      importFinish();
    }
  };

  return (
    <Modal
      title={t('system.license.import')}
      visible={visible}
      closable={false}
      width={ModalSize.big}
      footer={
        <>
          <Button onClick={close} disabled={importLoading}>
            {t('common.close')}
          </Button>
          <Button type="primary" onClick={submit} loading={importLoading}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <Form form={form} {...ModalFormLayout}>
        <Form.Item
          label={t('system.license.form.licenseFile')}
          valuePropName="fileList"
          name="file"
          rules={[
            {
              required: true,
              message: t('common.form.rule.selectFile'),
            },
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <Upload beforeUpload={fileChange}>
            <Button>{t('common.upload')}</Button>
          </Upload>
        </Form.Item>
      </Form>
      <Table
        rowKey="name"
        columns={licenseColumn}
        loading={prepareLoading}
        dataSource={licenseData}
      />
    </Modal>
  );
};

export default ImportModal;
