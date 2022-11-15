import React from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import { IRuleManagerForm, RuleManagerFormProps } from './index.type';
import { ModalFormLayout, ModalSize } from '../../../../../data/common';
import { useTranslation } from 'react-i18next';
import useStaticStatus from '../../../../../hooks/useStaticStatus';
import { useForm } from 'antd/lib/form/Form';
import './index.less';
import {
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum,
} from '../../../../../api/common.enum';
import { useTheme } from '@material-ui/styles';
import { Theme } from '../../../../../types/theme.type';

const RuleManagerModal: React.FC<RuleManagerFormProps> = (props) => {
  const { t } = useTranslation();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();
  const [form] = useForm<IRuleManagerForm>();
  const theme = useTheme<Theme>();
  React.useEffect(() => {
    if (!!props.ruleData) {
      if (!!props.ruleData.params) {
        const values: IRuleManagerForm = {};
        props.ruleData.params.forEach((v) => {
          if (!!v.key && !!v.value) {
            if (v.value === 'true' || v.value === 'false') {
              const bool = {
                true: true,
                false: false,
              };
              values[v.key] = bool[v.value];
            } else {
              values[v.key] = v.value;
            }
          }
        });
        form.setFieldsValue({
          ...values,
          level: props.ruleData?.level ?? '',
          desc: props.ruleData?.desc ?? '',
          type: props.ruleData?.type ?? '',
          rule_name: props.ruleData?.rule_name ?? '',
          db_type: props.ruleData?.db_type ?? '',
        });
      } else {
        form.setFieldsValue({
          level: props.ruleData?.level ?? '',
          desc: props.ruleData?.desc ?? '',
          type: props.ruleData?.type ?? '',
          rule_name: props.ruleData?.rule_name ?? '',
          db_type: props.ruleData?.db_type ?? '',
        });
      }
    }
  }, [props.ruleData, form, props.visible]);

  const onCancel = React.useCallback(() => {
    form?.resetFields();
    props.setVisibleFalse();
  }, [props, form]);

  const submit = React.useCallback(async () => {
    const values: IRuleManagerForm = await form.validateFields();
    const formatValues: { [key: string]: string } = {};
    Object.keys(values).forEach((key) => {
      if (typeof values[key] === 'boolean') {
        formatValues[key] = values[key].toString();
      } else {
        formatValues[key] = values[key] as string;
      }
    });
    const params = props.ruleData?.params?.map((v) => {
      return { ...v, value: formatValues[v.key!] };
    });
    props.submit({
      ...props.ruleData,
      params,
      level: formatValues.level as RuleResV1LevelEnum,
    });
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

          {/* todo Rewrite using BackendForm */}
          {props.ruleData?.params &&
            props.ruleData?.params.map((item) => {
              if (item.type === RuleParamResV1TypeEnum.bool) {
                return (
                  <Form.Item
                    key={item.key}
                    name={item.key}
                    label={item.desc}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                );
              }
              if (item.type === RuleParamResV1TypeEnum.int) {
                return (
                  <Form.Item
                    key={item.key}
                    label={item.desc ?? ''}
                    name={item.key}
                    rules={[
                      {
                        pattern: /^\d+$/,
                        message: t(
                          'ruleTemplate.editModal.ruleValueTypeOnlyNumber'
                        ),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                );
              }
              return (
                <Form.Item
                  key={item.key}
                  label={item.desc ?? ''}
                  name={item.key}
                  className="wrap-form-item"
                >
                  <Input />
                </Form.Item>
              );
            })}
        </Form>
      </Modal>
    </>
  );
};
export default RuleManagerModal;
