/* eslint-disable no-console */
import { act } from '@testing-library/react';
import { mockGetRoleUserCount } from './mockApi';
import MemberInfo from '../MemberInfo';
import { panelCommonProps } from './index.data';
import { renderWithRouterAndRedux } from '../../../../../testUtils/customRender';
import { resolveErrorThreeSecond } from '../../../../../testUtils/mockRequest';
import { getHrefByText } from '../../../../../testUtils/customQuery';

describe('test MemberInfo', () => {
  let getRoleUserCountSpy: jest.SpyInstance;
  beforeEach(() => {
    getRoleUserCountSpy = mockGetRoleUserCount();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  const error = console.error;

  beforeAll(() => {
    console.error = jest.fn((message: any) => {
      if (message.includes('React does not recognize the')) {
        return;
      }
      error(message);
    });
  });

  afterAll(() => {
    console.error = error;
  });
  test('should match snapshot', async () => {
    const { container } = renderWithRouterAndRedux(
      <MemberInfo {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    expect(getRoleUserCountSpy).toBeCalledTimes(1);
    expect(getRoleUserCountSpy).toBeCalledWith({
      project_name: panelCommonProps.projectName,
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      getHrefByText('projectManage.projectOverview.memberInfo.action')
    ).toBe(`/project/${panelCommonProps.projectName}/member`);
    expect(container).toMatchSnapshot();
  });

  test('should render error message', async () => {
    getRoleUserCountSpy.mockImplementation(() =>
      resolveErrorThreeSecond({ message: 'error message' })
    );

    const { container } = renderWithRouterAndRedux(
      <MemberInfo {...panelCommonProps} />,
      undefined,
      {
        projectManage: {
          overviewRefreshFlag: false,
        },
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
