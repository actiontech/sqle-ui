import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { RuleManagerFormProps } from './index.type';
import { ModalFormLayout } from '../../../../../data/common';
import { useTranslation } from 'react-i18next';
import useStaticStatus from '../../../../../hooks/useStaticStatus';
import { useForm } from 'antd/lib/form/Form';
import { IRuleResV1 } from '../../../../../api/common';

const RuleManagerModal: React.FC<RuleManagerFormProps> = (props) => {
  const { t } = useTranslation();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();
  const [form] = useForm<IRuleResV1>();
  React.useEffect(() => {
    props.ruleData &&
      form.setFieldsValue({
        level: props.ruleData?.level,
        value: props.ruleData?.value,
        desc: props.ruleData?.desc,
        type: props.ruleData?.type,
        rule_name: props.ruleData?.rule_name,
      });
  }, [props.ruleData, form, props.visible]);

  const onCancel = React.useCallback(() => {
    form?.resetFields();
    props.setVisibleFalse();
  }, [props, form]);

  const submit = React.useCallback(async () => {
    const values: IRuleResV1 = await form.validateFields();
    props.submit(values);
  }, [form, props]);

  return (
    <>
      <Modal
        title={t('ruleTemplate.editModal.title')}
        visible={props.visible}
        cancelText={t('common.close')}
        closable={false}
        okText={t('common.submit')}
        onCancel={onCancel}
        onOk={submit}
      >
        <Form {...ModalFormLayout} form={form}>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleNameLabel')}
            name="rule_name"
          >
            <Input disabled value={props.ruleData?.rule_name} />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleLevelLabel')}
            name="level"
            validateFirst={true}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder={t('ruleTemplate.editModal.ruleLevelLabelPlace')}
            >
              {getRuleLevelStatusSelectOption()}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleLevelValue')}
            name="value"
            validateFirst={true}
            hidden={!props?.ruleData?.value}
          >
            <Input
              placeholder={t('ruleTemplate.editModal.ruleLevelValuePlace')}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleDescLabel')}
            name="desc"
          >
            <Input.TextArea disabled value={props.ruleData?.desc} />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleTypeLabel')}
            name="type"
          >
            <Input disabled value={props.ruleData?.type} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default RuleManagerModal;
