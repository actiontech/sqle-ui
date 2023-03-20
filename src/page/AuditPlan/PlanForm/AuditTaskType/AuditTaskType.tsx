import { useRequest } from 'ahooks';
import { Form, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuditTaskTypeProps } from '.';
import audit_plan from '../../../../api/audit_plan';
import BackendForm from '../../../../components/BackendForm';
import useAsyncParams from '../../../../components/BackendForm/useAsyncParams';
import EmptyBox from '../../../../components/EmptyBox';

const AuditTaskType: React.FC<AuditTaskTypeProps> = (props) => {
  const { form, dbType, defaultValue, updateCurrentTypeParams } = props;

  const { t } = useTranslation();

  const {
    data: metas,
    loading,
    run: updateAuditTaskMetas,
  } = useRequest(
    () =>
      audit_plan
        .getAuditPlanMetasV1({
          filter_instance_type: dbType,
        })
        .then((res) => res.data.data),
    {
      manual: true,
    }
  );

  const [currentType, setCurrentType] = useState('');

  const formMate = useMemo(() => {
    if (!currentType || !metas) {
      return undefined;
    }
    return metas.find((item) => item.audit_plan_type === currentType)
      ?.audit_plan_params;
  }, [currentType, metas]);

  useEffect(() => {
    updateCurrentTypeParams?.(formMate);
  }, [formMate, updateCurrentTypeParams]);

  const { generateFormValueByParams } = useAsyncParams();

  useEffect(() => {
    if (!formMate) {
      return;
    }
    if (!defaultValue) {
      form.setFieldsValue({
        params: generateFormValueByParams(formMate),
      });
    } else {
      form.setFieldsValue({
        params: generateFormValueByParams(
          defaultValue.audit_plan_meta?.audit_plan_params ?? []
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formMate]);

  useEffect(() => {
    form.setFieldsValue({
      auditTaskType: undefined,
    });
    setCurrentType('');
    if (!!dbType) {
      updateAuditTaskMetas();
      if (!!defaultValue) {
        form.setFieldsValue({
          auditTaskType: defaultValue.audit_plan_meta?.audit_plan_type,
        });
        setCurrentType(defaultValue.audit_plan_meta?.audit_plan_type ?? '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbType, defaultValue]);

  return (
    <EmptyBox if={!!dbType}>
      <Form.Item
        name="auditTaskType"
        label={t('auditPlan.planForm.taskType')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select<string>
          loading={loading}
          placeholder={t('common.form.placeholder.select')}
          onChange={setCurrentType}
          disabled={!!defaultValue}
        >
          {metas?.map((meta) => (
            <Select.Option
              key={meta.audit_plan_type}
              value={meta.audit_plan_type ?? ''}
            >
              {meta.audit_plan_type_desc}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <EmptyBox if={!!formMate}>
        <BackendForm params={formMate ?? []} />
      </EmptyBox>
    </EmptyBox>
  );
};

export default AuditTaskType;
