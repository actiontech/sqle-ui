import { fireEvent, render } from '@testing-library/react';
import { getBySelector } from '../../testUtils/customQuery';
import EditText from './EditText';

describe('EditText', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should call onEnd with user input when user press enter key', async () => {
    const onEnd = jest.fn();
    const onChange = jest.fn();
    const { container } = render(
      <EditText editable={{ onEnd, onChange }}>test</EditText>
    );
    expect(container).toMatchSnapshot();
    fireEvent.click(getBySelector('.ant-typography-edit'));
    fireEvent.change(getBySelector('.ant-input'), {
      target: { value: 'new value' },
    });
    expect(container).toMatchSnapshot();
    // ant design will check user press up key is same as press down key....
    fireEvent.keyDown(getBySelector('.ant-input'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    });
    fireEvent.keyUp(getBySelector('.ant-input'), {
      key: 'Enter',
      code: 13,
      keyCode: 13,
    });
    expect(onEnd).toBeCalledTimes(1);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith('new value');
    expect(onEnd).toBeCalledWith('new value');
    expect(container).toMatchSnapshot();
  });
});
