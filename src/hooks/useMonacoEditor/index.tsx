import { FormInstance } from 'antd';
import { EditorDidMount } from 'react-monaco-editor';

const useMonacoEditor = (
  form?: FormInstance,
  {
    formName,
    placeholder = '/* input your sql */',
  }: { formName?: string; placeholder?: string } = {}
) => {
  const editorDidMount: EditorDidMount = (editor) => {
    editor.onDidFocusEditorText(() => {
      if (!!form && !!formName) {
        const currentValue = form.getFieldValue(formName);
        if (currentValue === placeholder) {
          form.setFieldsValue({
            [formName]: '',
          });
        }
      } else {
        const currentValue = editor.getValue();
        if (currentValue === placeholder) {
          editor.setValue('');
        }
      }
    });

    editor.onDidBlurEditorText(() => {
      if (!!form && !!formName) {
        const currentValue = form.getFieldValue(formName);
        if (currentValue === '') {
          form.setFieldsValue({
            [formName]: placeholder,
          });
        }
      } else {
        const currentValue = editor.getValue();
        if (currentValue === '') {
          editor.setValue(placeholder);
        }
      }
    });
  };

  return {
    editorDidMount,
  };
};

export default useMonacoEditor;
