import { fireEvent, screen, act } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import AddDataSource from '.';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import {
  getBySelector,
  getSelectValueByFormLabel,
  selectOptionByIndex,
} from '../../../testUtils/customQuery';
import {
  renderWithTheme,
  renderWithThemeAndRouter,
} from '../../../testUtils/customRender';
import {
  mockUseRuleTemplate,
  mockDriver,
  resolveThreeSecond,
  mockUseGlobalRuleTemplate,
} from '../../../testUtils/mockRequest';
import EventEmitter from '../../../utils/EventEmitter';
import { dataSourceMetas } from '../__testData__';
import useNavigate from '../../../hooks/useNavigate';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../../hooks/useNavigate', () => jest.fn());

const projectName = 'default';

describe('AddDataSource', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRuleTemplate();
    mockGetDataSourceMetas();
    mockDriver();
    mockUseGlobalRuleTemplate();
    useParamsMock.mockReturnValue({ projectName });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockCreateInstanceRequest = () => {
    const spy = jest.spyOn(instance, 'createInstanceV2');
    spy.mockImplementation(() => resolveThreeSecond(undefined));
    return spy;
  };

  const mockEventEmit = () => {
    const spy = jest.spyOn(EventEmitter, 'emit');
    return spy;
  };

  const mockGetDataSourceMetas = () => {
    const spy = jest.spyOn(instance, 'getInstanceAdditionalMetas');
    spy.mockImplementation(() => resolveThreeSecond(dataSourceMetas));
    return spy;
  };

  test('should render data source form', () => {
    const { container } = renderWithTheme(<AddDataSource />);
    expect(container).toMatchSnapshot();
  });

  test('should send create instance request when click submit', async () => {
    const create = mockCreateInstanceRequest();
    renderWithThemeAndRouter(<AddDataSource />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
      target: { value: 'instance_name1' },
    });

    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.describe'),
      {
        target: { value: 'desc1' },
      }
    );

    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.type')
    );
    const databaseTypeOption = screen.getAllByText('mysql')[1];
    expect(databaseTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseTypeOption);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.ip'), {
      target: { value: '1.1.1.1' },
    });

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.port'), {
      target: { value: 4444 },
    });

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.user'), {
      target: { value: 'root' },
    });

    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.password'),
      {
        target: { value: '123456' },
      }
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    ).toHaveValue('');
    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    );

    await screen.findAllByText('rule_template_name1');
    const allInstanceOptions = screen.getAllByText('rule_template_name1');
    const instanceOption = allInstanceOptions[1];
    expect(instanceOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instanceOption);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('common.add'));

    fireEvent.click(getBySelector('.ant-picker-range'));

    fireEvent.click(screen.getAllByText('23')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('OK'));

    fireEvent.click(screen.getAllByText('02')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('OK'));

    fireEvent.click(screen.getByText('common.ok'));

    fireEvent.mouseDown(
      screen.getByLabelText(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )
    );
    await act(async () => jest.advanceTimersByTime(0));

    const noticeOptions = screen.getAllByText('notice');
    const noticeOption = noticeOptions[1];
    fireEvent.click(noticeOption);

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    await act(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(create).toBeCalledTimes(1);
    expect(create).toBeCalledWith({
      additional_params: [
        {
          name: 'a',
          value: '123',
        },
        {
          name: 'b',
          value: '123',
        },
        {
          name: 'c',
          value: 'true',
        },
      ],
      db_type: 'mysql',
      db_host: '1.1.1.1',
      db_password: '123456',
      db_port: '4444',
      db_user: 'root',
      desc: 'desc1',
      instance_name: 'instance_name1',
      project_name: 'default',
      rule_template_name: 'rule_template_name1',
      maintenance_times: [
        {
          maintenance_stop_time: {
            hour: 23,
            minute: 0,
          },
          maintenance_start_time: {
            hour: 2,
            minute: 0,
          },
        },
      ],
      sql_query_config: {
        allow_query_when_less_than_audit_level: 'notice',
        audit_enabled: true,
      },
    });

    await act(async () => jest.advanceTimersByTime(3000));

    const emit = mockEventEmit();
    expect(screen.getByText('dataSource.addDatabaseSuccess')).not.toBeNull();

    fireEvent.click(screen.getByText('common.resetAndClose'));

    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      ''
    );
    expect(getBySelector('.ant-modal-wrap')).toHaveStyle('display: none');
    expect(emit).toBeCalledTimes(1);
    expect(emit).toBeCalledWith(EmitterKey.Reset_Test_Data_Source_Connect);
  });

  test('should reset all fields when click reset button', async () => {
    renderWithTheme(<AddDataSource />);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
      target: { value: 'instance_name1' },
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      'instance_name1'
    );

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.port'), {
      target: { value: 4444 },
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByLabelText('dataSource.dataSourceForm.port')).toHaveValue(
      '4444'
    );

    fireEvent.click(screen.getByText('common.reset'));

    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      ''
    );
    expect(screen.getByLabelText('dataSource.dataSourceForm.port')).toHaveValue(
      '3306'
    );
    expect(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    ).toHaveValue('');
  });

  test('should be hidden "allowQueryWhenLessThanAuditLevel" field when audit enabled is equal false', async () => {
    renderWithThemeAndRouter(<AddDataSource />, undefined);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByTitle(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )?.parentElement?.parentElement?.parentElement
    ).toHaveClass('ant-form-item-hidden');

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );
    expect(
      screen.getByTitle(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )?.parentElement?.parentElement?.parentElement
    ).not.toHaveClass('ant-form-item-hidden');

    selectOptionByIndex(
      'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel',
      'error',
      0
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      getSelectValueByFormLabel(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )
    ).toHaveTextContent('error');

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    expect(
      screen.getByTitle(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )?.parentElement?.parentElement?.parentElement
    ).toHaveClass('ant-form-item-hidden');
  });
});
