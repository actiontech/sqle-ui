import { renderHook } from '@testing-library/react-hooks';
import useConditionalConfig, {
  renderReadOnlyModeConfig,
} from '../useConditionalConfig';
import { Button, Form, Input, Switch } from 'antd';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ReactFragment } from 'react';
import { FormInstance } from 'antd/es/form/Form';
import { act } from 'react-dom/test-utils';

describe('test useConditionalConfig', () => {
  const renderJsx = (
    jsx?: string | number | boolean | JSX.Element | ReactFragment | null
  ) => {
    const Element = () => <>{jsx}</>;
    return render(<Element />);
  };

  const customRenderHooks = () => {
    return renderHook(() =>
      useConditionalConfig<{ enable: string; other: string }>({
        switchFieldName: 'enable',
      })
    );
  };

  it('should match snapshot with renderReadOnlyModeConfig', () => {
    const data = {
      enable: true,
      field1: 'test1',
      field2: 'test2',
      field3: false,
      field4: 10,
    };
    const columns = [
      {
        label: 'label1',
        span: 3,
        dataIndex: 'enable',
        render: (val: boolean) => (val ? 'true' : false),
      },
      {
        label: 'label2',
        span: 3,
        dataIndex: 'field1',
      },
      {
        label: 'label3',
        span: 3,
        dataIndex: 'field2',
        hidden: true,
      },
      {
        label: 'label4',
        span: 3,
        dataIndex: 'field3',
      },
      {
        label: 'label5',
        span: 3,
        dataIndex: 'field4',
      },
    ];

    const Component = () => {
      return (
        <>
          {renderReadOnlyModeConfig<any>({
            data,
            columns,
            extra: <span> extra</span>,
          })}
        </>
      );
    };

    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('label3')).not.toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
    cleanup();
  });
  it('should be able to render nodes as expected', async () => {
    const switchField = (
      <Form.Item name="enable" label="enable" valuePropName="checked">
        <Switch />
      </Form.Item>
    );
    const configField = (
      <Form.Item name="other" label="otherField">
        <Input />
      </Form.Item>
    );

    const { result } = customRenderHooks();

    renderJsx(
      result.current.renderEditingModeConfig({
        switchField,
        configField,
      })
    );

    expect(screen.getByLabelText('enable')).toBeInTheDocument();
    expect(screen.queryByLabelText('otherField')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('enable'));
    expect(screen.getByLabelText('enable')).toBeTruthy();
    renderJsx(
      result.current.renderEditingModeConfig({
        switchField,
        configField,
      })
    );
    expect(screen.getByLabelText('otherField')).toBeInTheDocument();

    cleanup();

    jest.useFakeTimers();
    const submitMock = jest.fn();
    renderJsx(
      result.current.renderEditingModeConfig({
        switchField,
        configField,
        submitButtonField: (
          <Form.Item label="">
            <Button htmlType="submit">submit</Button>
          </Form.Item>
        ),
        submit: submitMock,
      })
    );

    fireEvent.click(screen.getByText('submit'));
    await act(() => jest.advanceTimersByTime(0));
    expect(submitMock).toBeCalled();
    jest.useRealTimers();
  });
});
