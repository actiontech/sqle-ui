import OperationRecordNavigation from '../OperationRecordNavigation';
import { renderWithRedux } from '../../../../../testUtils/customRender';
import useNavigate from '../../../../../hooks/useNavigate';

jest.mock('../../../../../hooks/useNavigate', () => jest.fn());

describe('test Nav/Header/OperationRecordNavigation', () => {
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const navigateSpy = jest.fn();

  test('should match snapshot', () => {
    const { container } = renderWithRedux(
      <OperationRecordNavigation />,
      undefined,
      {
        user: { username: 'admin', role: 'admin' },
      }
    );

    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when role is not admin', () => {
    const { container } = renderWithRedux(
      <OperationRecordNavigation />,
      undefined,
      {
        user: { username: 'test', role: '' },
      }
    );
    expect(container).toMatchSnapshot();
  });
});
