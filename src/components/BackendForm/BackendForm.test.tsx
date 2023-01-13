import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import BackendForm, { FormItem } from '.';
import { getAllBySelector, getBySelector } from '../../testUtils/customQuery';

describe('BackendForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const formItems: FormItem[] = [
    {
      type: 'bool',
      key: 'boolKey',
      desc: 'boolDesc',
      value: 'false',
    },
    {
      type: 'int',
      key: 'intKey',
      desc: 'intDesc',
      value: '1',
    },
    {
      type: 'string',
      key: 'stringKey',
      desc: 'stringDesc',
      value: 'stringValue',
    },
  ];

  it('should render form item by params key', async () => {
    const wrapper = shallow(<BackendForm params={formItems} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should generate value in "params" key of form values at default', async () => {
    const form = renderHook(() => useForm());
    render(
      <Form form={form.result.current[0]}>
        <BackendForm params={formItems} />
      </Form>
    );
    fireEvent.click(getBySelector('button'));
    fireEvent.input(getAllBySelector('input')[0], { target: { value: '123' } });
    fireEvent.input(getAllBySelector('input')[1], {
      target: { value: 'this is a string' },
    });
    expect(form.result.current[0].getFieldsValue()).toEqual({
      params: {
        boolKey: true,
        intKey: '123',
        stringKey: 'this is a string',
      },
    });
  });

  it('should generate value in paramsKey of form values', async () => {
    const form = renderHook(() => useForm());
    render(
      <Form form={form.result.current[0]}>
        <BackendForm params={formItems} paramsKey="custom" />
      </Form>
    );
    fireEvent.click(getBySelector('button'));
    fireEvent.input(getAllBySelector('input')[0], { target: { value: '123' } });
    fireEvent.input(getAllBySelector('input')[1], {
      target: { value: 'this is a string' },
    });
    expect(form.result.current[0].getFieldsValue()).toEqual({
      custom: {
        boolKey: true,
        intKey: '123',
        stringKey: 'this is a string',
      },
    });
  });

  it('should disable item when disabled props is equal true', () => {
    const form = renderHook(() => useForm());
    const { rerender } = render(
      <Form form={form.result.current[0]}>
        <BackendForm params={formItems} paramsKey="custom" disabled={true} />
      </Form>
    );

    expect(screen.getByLabelText('boolDesc')).toBeDisabled();
    expect(screen.getByLabelText('intDesc')).toBeDisabled();
    expect(screen.getByLabelText('stringDesc')).toBeDisabled();

    rerender(
      <Form form={form.result.current[0]}>
        <BackendForm params={formItems} paramsKey="custom" />
      </Form>
    );
    expect(screen.getByLabelText('boolDesc')).not.toBeDisabled();
    expect(screen.getByLabelText('intDesc')).not.toBeDisabled();
    expect(screen.getByLabelText('stringDesc')).not.toBeDisabled();
  });
});
