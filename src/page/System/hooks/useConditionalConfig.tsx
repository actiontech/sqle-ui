import { Descriptions, Form } from 'antd';
import { DescriptionsItemProps } from 'antd/lib/descriptions/Item';
import { useBoolean } from 'ahooks';
import { PageFormLayout } from '../../../data/common';

type RenderReadOnlyElementConfig<T> = {
  data: T;
  columns: ReadOnlyConfigColumnsType<T>;
  extra?: React.ReactNode;
};

export type ReadOnlyConfigColumnsType<T> = Array<
  {
    hidden?: boolean;
    dataIndex: keyof Required<T>;
    render?: (val: T[keyof T], record: T) => React.ReactNode;
  } & Omit<DescriptionsItemProps, 'children'>
>;

export function renderReadOnlyModeConfig<T>(
  params: RenderReadOnlyElementConfig<T>
) {
  const { data = {} as T, columns, extra } = params;
  return (
    <Descriptions>
      {columns.map(
        (v, index) =>
          !v.hidden && (
            <Descriptions.Item key={index} label={v.label} span={v.span}>
              {typeof v.render === 'function' ? (
                v.render(data[v.dataIndex], data)
              ) : (
                <>{data[v.dataIndex] || '--'}</>
              )}
            </Descriptions.Item>
          )
      )}

      <Descriptions.Item key="extra" span={3}>
        {extra}
      </Descriptions.Item>
    </Descriptions>
  );
}

function useConditionalConfig<T>({
  switchFieldName,
}: {
  switchFieldName: keyof T;
}) {
  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();
  const [form] = Form.useForm<T>();

  const enabled = Form.useWatch(switchFieldName, form);

  function renderEditingModeConfig({
    switchField,
    configField,
    submitButtonField,
    submit,
  }: {
    switchField: React.ReactNode;
    configField: React.ReactNode;
    submitButtonField?: React.ReactNode;
    submit?: (val: T) => void;
  }) {
    return (
      <Form
        {...PageFormLayout}
        hidden={!modifyFlag}
        form={form}
        onFinish={submit}
      >
        {enabled ? (
          <>
            {switchField}
            {configField}
          </>
        ) : (
          switchField
        )}
        {submitButtonField}
      </Form>
    );
  }

  return {
    modifyFinish,
    startModify,
    modifyFlag,
    renderEditingModeConfig,
    form,
  };
}

export default useConditionalConfig;
