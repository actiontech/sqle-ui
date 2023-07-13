/* eslint-disable no-console */
import { renderHook } from '@testing-library/react-hooks';
import { EditRuleScriptProps } from '..';
import { renderWithRedux } from '../../../../testUtils/customRender';
import { mockUseStyle } from '../../../../testUtils/mockStyle';
import EditRuleScript from '../EditRuleScript';
import { Form } from 'antd';
import { customRules } from '../../__mockApi__/data';
import { fireEvent, screen } from '@testing-library/react';

describe('test EditRuleScript', () => {
  const error = console.error;
  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes(
          'A component is changing an uncontrolled input to be controlled'
        )
      ) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });
  test('should match snapshot', () => {
    mockUseStyle();
    const { result } = renderHook(() => Form.useForm());
    const mockPreStep = jest.fn();
    const mockSubmit = jest.fn();
    const props: EditRuleScriptProps = {
      form: result.current[0],
      submitLoading: false,
      prevStep: mockPreStep,
      submit: mockSubmit,
      defaultData: customRules[0],
    };
    const { container } = renderWithRedux(
      <EditRuleScript {...props} />,
      undefined,
      {
        user: {
          theme: 'light',
        },
      }
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(mockPreStep).toBeCalledTimes(1);

    fireEvent.click(screen.getByText('common.submit'));
    expect(mockPreStep).toBeCalledTimes(1);
  });
});
