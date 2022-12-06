import { fireEvent, waitFor, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import AddDataSource from '.';
import instance from '../../../api/instance';
import EmitterKey from '../../../data/EmitterKey';
import { getBySelector } from '../../../testUtils/customQuery';
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const projectName = 'default';

describe('AddDataSource', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseRuleTemplate();
    mockGetDataSourceMetas();
    mockDriver();
    mockUseGlobalRuleTemplate();
    useParamsMock.mockReturnValue({ projectName });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const mockCreateInstanceRequest = () => {
    const spy = jest.spyOn(instance, 'createInstanceV1');
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

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

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
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const databaseTypeOption = screen.getAllByText('mysql')[1];
    expect(databaseTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseTypeOption);

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
    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.queryTimeoutSecond'),
      {
        target: { value: '10000' },
      }
    );

    expect(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    ).toHaveValue('');
    fireEvent.mouseDown(
      screen.getByLabelText('dataSource.dataSourceForm.ruleTemplate')
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    await screen.findAllByText('rule_template_name1');
    const allInstanceOptions = screen.getAllByText('rule_template_name1');
    const instanceOption = allInstanceOptions[1];
    expect(instanceOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(instanceOption);

    fireEvent.click(screen.getByText('common.add'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(getBySelector('.ant-picker-range'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getAllByText('23')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getAllByText('02')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.ok'));

    fireEvent.mouseDown(
      screen.getByLabelText(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const noticeOptions = screen.getAllByText('notice');
    const noticeOption = noticeOptions[1];
    fireEvent.click(noticeOption);

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

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
        max_pre_query_rows: 100,
        query_timeout_second: 10000,
        allow_query_when_less_than_audit_level: 'error',
        audit_enabled: true,
      },
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
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

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.name'), {
      target: { value: 'instance_name1' },
    });
    expect(screen.getByLabelText('dataSource.dataSourceForm.name')).toHaveValue(
      'instance_name1'
    );

    fireEvent.input(screen.getByLabelText('dataSource.dataSourceForm.port'), {
      target: { value: 4444 },
    });
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

  test('should be send an empty string when rule template is not selected', async () => {
    const create = mockCreateInstanceRequest();
    renderWithThemeAndRouter(<AddDataSource />);

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

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
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const databaseTypeOption = screen.getAllByText('mysql')[1];
    expect(databaseTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseTypeOption);

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
    fireEvent.input(
      screen.getByLabelText('dataSource.dataSourceForm.queryTimeoutSecond'),
      {
        target: { value: '10000' },
      }
    );

    fireEvent.click(screen.getByText('common.add'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(getBySelector('.ant-picker-range'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });

    fireEvent.click(screen.getAllByText('23')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getAllByText('02')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('Ok'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    fireEvent.click(screen.getByText('common.ok'));

    fireEvent.mouseDown(
      screen.getByLabelText(
        'dataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
      )
    );
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    const noticeOptions = screen.getAllByText('notice');
    const noticeOption = noticeOptions[1];
    fireEvent.click(noticeOption);

    fireEvent.click(
      screen.getByLabelText('dataSource.dataSourceForm.needAuditForSqlQuery')
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('common.submit'));
    });

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
      rule_template_name: '',
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
        max_pre_query_rows: 100,
        query_timeout_second: 10000,
        allow_query_when_less_than_audit_level: 'error',
        audit_enabled: true,
      },
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
  });
});
