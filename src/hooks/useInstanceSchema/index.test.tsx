import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup,
} from '@testing-library/react';
import instance from '../../api/instance';
import { resolveThreeSecond } from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useInstanceSchema from '.';

describe('useInstanceSchema', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(instance, 'getInstanceSchemasV1');
    return spy;
  };

  test('should get instance schema data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ schema_name_list: ['schema1'] })
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useInstanceSchema('instanceId')
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.schemaList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateInstanceSchemaSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    expect(requestSpy).toBeCalledTimes(1);
    expect(requestSpy).toBeCalledWith({ instance_name: 'instanceId' });
    expect(result.current.schemaList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toBeCalledTimes(1);
    expect(result.current.schemaList).toEqual(['schema1']);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateInstanceSchemaSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('schema1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should not request when use hooks without params', () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ schema_name_list: ['schema1'] })
    );
    const { result } = renderHook(() => useInstanceSchema());
    expect(result.current.loading).toBe(false);
    expect(requestSpy).not.toBeCalled();

    act(() => {
      result.current.updateSchemaList();
    });

    expect(result.current.loading).toBe(false);
    expect(requestSpy).not.toBeCalled();
  });
});
