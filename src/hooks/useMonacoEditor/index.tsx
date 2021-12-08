import { FormInstance } from 'antd';
import React from 'react';
import { EditorDidMount } from 'react-monaco-editor';
import { IDisposable } from 'monaco-editor';
import { createDependencyProposals } from './index.data';
import { IRange } from './index.type';
const useMonacoEditor = (
  form?: FormInstance,
  {
    formName,
    placeholder = '/* input your sql */',
  }: { formName?: string; placeholder?: string } = {}
) => {
  const monacoProviderRef = React.useRef<IDisposable>();
  React.useEffect(() => {
    return () => {
      monacoProviderRef.current?.dispose();
    };
  }, []);
  const editorDidMount: EditorDidMount = (editor, monaco) => {
    monacoProviderRef.current = monaco.languages.registerCompletionItemProvider(
      'sql',
      {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range: IRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: createDependencyProposals(monaco, range),
          };
        },
      }
    );

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
