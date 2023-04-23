import { Form, Switch, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { BackendFormProps } from '.';

const BackendForm: React.FC<BackendFormProps> = (props) => {
  const { t } = useTranslation();

  const { paramsKey = 'params' } = props;

  return <>
    {props.params.map((item) => {
      if (item.type === 'bool') {
        return (
          <Form.Item
            key={item.key}
            name={[paramsKey, item.key ?? '']}
            label={item.desc}
            valuePropName="checked"
          >
            <Switch disabled={props.disabled} />
          </Form.Item>
        );
      }
      if (item.type === 'int') {
        return (
          <Form.Item
            key={item.key}
            label={item.desc ?? ''}
            name={[paramsKey, item.key ?? '']}
            rules={[
              {
                pattern: /^\d+$/,
                message: t('ruleTemplate.editModal.ruleValueTypeOnlyNumber'),
              },
            ]}
          >
            <Input disabled={props.disabled} />
          </Form.Item>
        );
      }
      return (
        <Form.Item
          key={item.key}
          label={item.desc ?? ''}
          name={[paramsKey, item.key ?? '']}
        >
          <Input disabled={props.disabled} />
        </Form.Item>
      );
    })}
  </>;
};

export default BackendForm;
