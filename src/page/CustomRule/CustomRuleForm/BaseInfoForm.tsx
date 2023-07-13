import { Button, Divider, Form, Input, InputRef, Select, Space } from 'antd';
import { BaseInfoFormProps, CustomRuleFormBaseInfoFields } from '.';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../data/common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useDatabaseType from '../../../hooks/useDatabaseType';
import useStaticStatus from '../../../hooks/useStaticStatus';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';
import { RuleResV1LevelEnum } from '../../../api/common.enum';
import useRuleType from '../../../hooks/useRuleType';
import { PlusOutlined } from '@ant-design/icons';

const BaseInfoForm: React.FC<BaseInfoFormProps> = (props) => {
  const { t } = useTranslation();
  const inputRef = useRef<InputRef>(null);

  const { updateDriverNameList, generateDriverSelectOptions } =
    useDatabaseType();

  const { updateRuleTypeList, ruleTypeList } = useRuleType();

  const [extraRuleTypeList, setExtraRuleTypeList] = useState<string[]>([]);
  const [extraRuleName, setExtraRuleName] = useState('');

  const { getRuleLevelStatusSelectOption } = useStaticStatus();

  const isUpdate = useMemo(() => !!props.defaultData, [props.defaultData]);

  const currentDbType = Form.useWatch('dbType', props.form);

  const reset = useCallback(() => {
    if (isUpdate) {
      props.form.resetFields(['desc', 'annotation', 'ruleType', 'level']);
      return;
    }
    props.form.resetFields();
    setExtraRuleName('');
    setExtraRuleTypeList([]);
  }, [props.form, isUpdate]);

  const addRuleType = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (!extraRuleName) {
      return;
    }
    setExtraRuleTypeList((v) => [...v, extraRuleName]);
    setExtraRuleName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  useEffect(() => {
    if (!!props.defaultData) {
      props.form.setFieldsValue({
        desc: props.defaultData.desc,
        annotation: props.defaultData.annotation,
        dbType: props.defaultData.db_type,
        ruleType: props.defaultData.type,
        level: props.defaultData.level,
      });
    }
  }, [props.defaultData, props.form]);

  useEffect(() => {
    if (currentDbType) {
      updateRuleTypeList(currentDbType);
    }
  }, [currentDbType, props.form, updateRuleTypeList]);

  return (
    <Form<CustomRuleFormBaseInfoFields> form={props.form} {...PageFormLayout}>
      <Form.Item
        label={t('customRule.baseInfoForm.ruleName')}
        name="desc"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input
          placeholder={t('common.form.placeholder.input', {
            name: t('customRule.baseInfoForm.ruleName'),
          })}
        />
      </Form.Item>

      <Form.Item
        label={t('customRule.baseInfoForm.ruleDesc')}
        name="annotation"
      >
        <Input.TextArea
          className="textarea-no-resize"
          placeholder={t('common.form.placeholder.input', {
            name: t('customRule.baseInfoForm.ruleDesc'),
          })}
          maxLength={255}
        />
      </Form.Item>

      <Form.Item
        label={t('customRule.baseInfoForm.dbType')}
        name="dbType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.dbType'),
          })}
          onChange={() => {
            props.form.setFieldsValue({
              ruleType: '',
            });
          }}
        >
          {generateDriverSelectOptions()}
        </Select>
      </Form.Item>

      <Form.Item
        label={t('customRule.baseInfoForm.ruleType')}
        name="ruleType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          allowClear
          showSearch
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.ruleType'),
          })}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  data-testid="add-rule-type"
                  placeholder={t(
                    'customRule.baseInfoForm.addExtraRuleTypePlaceholder'
                  )}
                  ref={inputRef}
                  value={extraRuleName}
                  onChange={(e) => setExtraRuleName(e.target.value)}
                />
                <Button icon={<PlusOutlined />} onClick={addRuleType}>
                  {t('customRule.baseInfoForm.addExtraRuleType')}
                </Button>
              </Space>
            </>
          )}
          options={[
            ...ruleTypeList.map((v) => ({
              label: v.rule_count ? (
                <Space size={6}>
                  <span>{v.rule_type}</span>
                  <span>{`(${v.rule_count})`}</span>
                </Space>
              ) : (
                v.rule_type
              ),
              value: v.rule_type,
            })),

            ...extraRuleTypeList.map((v) => ({
              label: v,
              value: v,
            })),
          ]}
        />
      </Form.Item>

      <Form.Item
        label={t('customRule.baseInfoForm.level')}
        name="level"
        initialValue={RuleResV1LevelEnum.notice}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={t('common.form.placeholder.select', {
            name: t('customRule.baseInfoForm.level'),
          })}
        >
          {getRuleLevelStatusSelectOption()}
        </Select>
      </Form.Item>

      <FooterButtonWrapper insideProject={false}>
        <Button onClick={reset}>{t('common.reset')}</Button>
        <Button type="primary" onClick={props.submit}>
          {t('common.nextStep')}
        </Button>
      </FooterButtonWrapper>
    </Form>
  );
};

export default BaseInfoForm;
