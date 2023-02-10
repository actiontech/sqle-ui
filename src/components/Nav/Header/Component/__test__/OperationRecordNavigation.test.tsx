import { render } from '@testing-library/react';
import { mockUseSelector } from '../../../../../testUtils/mockRedux';
import OperationRecordNavigation from '../OperationRecordNavigation';

describe('test Nav/Header/OperationRecordNavigation', () => {
  beforeEach(() => {
    mockUseSelector({
      user: { username: 'admin', role: 'admin' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should match snapshot', () => {
    const { container } = render(<OperationRecordNavigation />);

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when role is not admin', () => {
    mockUseSelector({
      user: { username: 'test', role: '' },
    });
    const { container } = render(<OperationRecordNavigation />);
    expect(container).toMatchSnapshot();
  });
});
