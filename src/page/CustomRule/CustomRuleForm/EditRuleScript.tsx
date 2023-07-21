import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { ComponentType, useEffect } from 'react';
import useChangeTheme from '../../../hooks/useChangeTheme';
import useMonacoEditor from '../../../hooks/useMonacoEditor';
import { EditRuleScriptFields, EditRuleScriptProps } from '.';
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageFormLayout } from '../../../data/common';
import useStyles from '../../../theme';
import FooterButtonWrapper from '../../../components/FooterButtonWrapper';

const MonacoEditorFunComponent =
  MonacoEditor as ComponentType<MonacoEditorProps>;

const EditRuleScript: React.FC<EditRuleScriptProps> = (props) => {
  const { currentEditorTheme } = useChangeTheme();
  const { t } = useTranslation();
  const theme = useStyles();

  const { editorDidMount, registerRegexLanguage } = useMonacoEditor(
    props.form,
    {
      formName: 'script',
      placeholder: '',
    }
  );

  useEffect(() => {
    if (props.defaultData) {
      props.form.setFieldsValue({
        script: props.defaultData.rule_script,
      });
    }
  }, [props.defaultData, props.form]);

  return (
    <Form<EditRuleScriptFields> {...PageFormLayout} form={props.form}>
      <Form.Item
        name="script"
        label={t('customRule.editScriptForm.inputRuleScript')}
        wrapperCol={{
          ...PageFormLayout.wrapperCol,
          className: theme.editor,
        }}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <MonacoEditorFunComponent
          theme={currentEditorTheme}
          width="100%"
          height="500"
          language="regexp"
          editorDidMount={(editor, monaco) => {
            editorDidMount(editor, monaco);
            registerRegexLanguage(editor, monaco);
          }}
          options={{
            automaticLayout: true,
          }}
        />
      </Form.Item>

      <FooterButtonWrapper insideProject={false}>
        <Button disabled={props.submitLoading} onClick={props.prevStep}>
          {t('common.prevStep')}
        </Button>
        <Button
          loading={props.submitLoading}
          onClick={props.submit}
          type="primary"
        >
          {t('common.submit')}
        </Button>
      </FooterButtonWrapper>
    </Form>
  );
};

export default EditRuleScript;
