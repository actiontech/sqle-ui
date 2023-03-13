import { renderHook } from '@testing-library/react-hooks';
import useMonacoEditor from '.';
import { createDependencyProposals } from './index.data';
import { IRange } from './index.type';

describe('userMonacoEditor', () => {
  test('should set value to empty when editor value is equal default placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const { result, unmount } = renderHook(() => useMonacoEditor());
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(editor.getValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledTimes(0);

    editor.getValue.mockReturnValue('/* input your sql */');

    focusFn();
    expect(editor.getValue).toBeCalledTimes(2);
    expect(editor.setValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledWith('');

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to empty when editor value is equal custom placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(undefined, { placeholder: 'test aaaa' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    editor.getValue.mockReturnValue('/* input your sql */');
    focusFn();
    expect(editor.getValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledTimes(0);

    editor.getValue.mockReturnValue('test aaaa');
    focusFn();
    expect(editor.getValue).toBeCalledTimes(2);
    expect(editor.setValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledWith('');

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to default placeholder when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const { result, unmount } = renderHook(() => useMonacoEditor());
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(editor.getValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledTimes(0);

    editor.getValue.mockReturnValue('');

    blurFn();
    expect(editor.getValue).toBeCalledTimes(2);
    expect(editor.setValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledWith('/* input your sql */');

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to custom placeholder when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(undefined, { placeholder: 'test aaa' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(editor.getValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledTimes(0);

    editor.getValue.mockReturnValue('');

    blurFn();
    expect(editor.getValue).toBeCalledTimes(2);
    expect(editor.setValue).toBeCalledTimes(1);
    expect(editor.setValue).toBeCalledWith('test aaa');

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to empty by form instance when editor value is equal default placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn(),
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, { formName: 'sql' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('/* input your sql */');

    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(1);
    expect(form.setFields).toBeCalledWith([{ name: 'sql', value: '' }]);

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to empty by form instance when editor value is equal custom placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn(),
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, {
        formName: 'sql',
        placeholder: 'test aaaa',
      })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('test aaaa');

    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(1);
    expect(form.setFields).toBeCalledWith([{ name: 'sql', value: '' }]);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to default placeholder by form instance when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn(),
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, { formName: 'sql' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('');

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(1);
    expect(form.setFields).toBeCalledWith([
      { name: 'sql', value: '/* input your sql */' },
    ]);

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should set value to custom placeholder by form instance when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose })),
      },
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn(),
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, {
        formName: 'sql',
        placeholder: 'test aaaa',
      })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(monaco.languages.registerCompletionItemProvider).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('');

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toBeCalledTimes(1);
    expect(form.setFields).toBeCalledWith([
      { name: 'sql', value: 'test aaaa' },
    ]);

    unmount();
    expect(dispose).toBeCalledTimes(1);
  });

  test('should match snapshot for createDependencyProposals', () => {
    const monaco = {
      languages: {
        CompletionItemKind: {
          Function: 'function',
        },
      },
    };
    const range: IRange = {
      startLineNumber: 1,
      endLineNumber: 1,
      startColumn: 1,
      endColumn: 1,
    };

    expect(createDependencyProposals(monaco as any, range)).toMatchSnapshot();
  });
});
