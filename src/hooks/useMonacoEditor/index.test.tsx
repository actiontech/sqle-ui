import { renderHook } from '@testing-library/react-hooks';
import useMonacoEditor from '.';

describe('userMonacoEditor', () => {
  test('should set value to empty when editor value is equal default placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const { result } = renderHook(() => useMonacoEditor());
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
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
  });

  test('should set value to empty when editor value is equal custom placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const { result } = renderHook(() =>
      useMonacoEditor(undefined, { placeholder: 'test aaaa' })
    );
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
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
  });

  test('should set value to default placeholder when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const { result } = renderHook(() => useMonacoEditor());
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
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
  });

  test('should set value to custom placeholder when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const { result } = renderHook(() =>
      useMonacoEditor(undefined, { placeholder: 'test aaa' })
    );
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
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
  });

  test('should set value to empty by form instance when editor value is equal default placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const form = {
      getFieldValue: jest.fn(),
      setFieldsValue: jest.fn(),
    };
    const { result } = renderHook(() =>
      useMonacoEditor(form as any, { formName: 'sql' })
    );
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('/* input your sql */');

    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(1);
    expect(form.setFieldsValue).toBeCalledWith({ sql: '' });
  });

  test('should set value to empty by form instance when editor value is equal custom placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const form = {
      getFieldValue: jest.fn(),
      setFieldsValue: jest.fn(),
    };
    const { result } = renderHook(() =>
      useMonacoEditor(form as any, {
        formName: 'sql',
        placeholder: 'test aaaa',
      })
    );
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('test aaaa');

    focusFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(1);
    expect(form.setFieldsValue).toBeCalledWith({ sql: '' });
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);
  });

  test('should set value to default placeholder by form instance when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const form = {
      getFieldValue: jest.fn(),
      setFieldsValue: jest.fn(),
    };
    const { result } = renderHook(() =>
      useMonacoEditor(form as any, { formName: 'sql' })
    );
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('');

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(1);
    expect(form.setFieldsValue).toBeCalledWith({ sql: '/* input your sql */' });
  });

  test('should set value to custom placeholder by form instance when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn(),
    };
    const form = {
      getFieldValue: jest.fn(),
      setFieldsValue: jest.fn(),
    };
    const { result } = renderHook(() =>
      useMonacoEditor(form as any, {
        formName: 'sql',
        placeholder: 'test aaaa',
      })
    );
    result.current.editorDidMount(editor as any, {} as any);

    expect(editor.onDidBlurEditorText).toBeCalledTimes(1);
    expect(editor.onDidFocusEditorText).toBeCalledTimes(1);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(1);
    expect(form.getFieldValue).toBeCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(0);
    expect(editor.getValue).toBeCalledTimes(0);
    expect(editor.setValue).toBeCalledTimes(0);

    form.getFieldValue.mockReturnValue('');

    blurFn();
    expect(form.getFieldValue).toBeCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFieldsValue).toBeCalledTimes(1);
    expect(form.setFieldsValue).toBeCalledWith({ sql: 'test aaaa' });
  });
});
