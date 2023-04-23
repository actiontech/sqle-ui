import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { IRuleManagerForm, RuleManagerFormProps } from './index.type';
import { ModalFormLayout, ModalSize } from '../../../../../data/common';
import { useTranslation } from 'react-i18next';
import useStaticStatus from '../../../../../hooks/useStaticStatus';
import { useForm } from 'antd/lib/form/Form';
import './index.less';
import { useTheme } from '@mui/styles';
import EmptyBox from '../../../../../components/EmptyBox';
import BackendForm from '../../../../../components/BackendForm';
import useAsyncParams from '../../../../../components/BackendForm/useAsyncParams';
import { IRuleParamResV1 } from '../../../../../api/common';
import { Theme } from '@mui/material/styles';

const RuleManagerModal: React.FC<RuleManagerFormProps> = (props) => {
  const { t } = useTranslation();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();
  const [form] = useForm<IRuleManagerForm>();
  const theme = useTheme<Theme>();
  const { generateFormValueByParams } = useAsyncParams();

  React.useEffect(() => {
    if (!!props.ruleData) {
      if (!!props.ruleData.params && props.ruleData.params.length > 0) {
        form.setFieldsValue({
          params: generateFormValueByParams(props.ruleData.params),
          level: props.ruleData?.level,
          desc: props.ruleData?.desc ?? '',
          type: props.ruleData?.type ?? '',
          rule_name: props.ruleData?.rule_name ?? '',
          db_type: props.ruleData?.db_type ?? '',
          annotation: props.ruleData?.annotation ?? '',
        });
      } else {
        form.setFieldsValue({
          level: props.ruleData?.level,
          desc: props.ruleData?.desc ?? '',
          type: props.ruleData?.type ?? '',
          rule_name: props.ruleData?.rule_name ?? '',
          db_type: props.ruleData?.db_type ?? '',
          annotation: props.ruleData?.annotation ?? '',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.ruleData, form, props.visible]);

  const onCancel = React.useCallback(() => {
    form?.resetFields();
    props.setVisibleFalse();
  }, [props, form]);

  const submit = React.useCallback(async () => {
    const values: IRuleManagerForm = await form.validateFields();
    const params = props.ruleData?.params?.map((item) => {
      const temp: IRuleParamResV1 = {
        key: item.key,
        value: item.value,
        type: item.type,
        desc: item.desc,
      };
      if (
        item.key &&
        Object.prototype.hasOwnProperty.call(values.params, item.key)
      ) {
        const tempVal = values.params[item.key];
        if (typeof tempVal === 'boolean') {
          temp.value = tempVal ? 'true' : 'false';
        } else {
          temp.value = String(tempVal);
        }
      }
      return temp;
    });
    props.submit({
      ...props.ruleData,
      params,
      level: values.level,
    });
  }, [form, props]);

  return (
    <>
      <Modal
        title={t('ruleTemplate.editModal.title')}
        open={props.visible}
        cancelText={t('common.close')}
        closable={false}
        okText={t('common.submit')}
        onCancel={onCancel}
        onOk={submit}
        className="rule-manager-modal"
        width={ModalSize.mid}
      >
        <Form {...ModalFormLayout} form={form} data-testid="base-form">
          <Form.Item hidden={true} name="rule_name">
            <Input />
          </Form.Item>
          <Form.Item label={t('ruleTemplate.editModal.rule')} name="desc">
            <Input.TextArea
              style={{ color: theme.common.color.disabledFont }}
              disabled
              value={props.ruleData?.desc}
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.annotation')}
            name="annotation"
          >
            <Input.TextArea
              style={{ color: theme.common.color.disabledFont }}
              disabled
              value={props.ruleData?.annotation}
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleTypeLabel')}
            name="type"
          >
            <Input
              disabled
              style={{ color: theme.common.color.disabledFont }}
              value={props.ruleData?.type}
            />
          </Form.Item>
          <Form.Item
            label={t('ruleTemplate.editModal.ruleDbType')}
            name="db_type"
          >
            <Input
              disabled
              style={{ color: theme.common.color.disabledFont }}
              value={props.ruleData?.db_type}
            />
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

          <EmptyBox
            if={!!props.ruleData?.params && props.ruleData.params.length > 0}
          >
            <BackendForm params={props.ruleData?.params ?? []} />
          </EmptyBox>
        </Form>
      </Modal>
    </>
  );
};
export default RuleManagerModal;
