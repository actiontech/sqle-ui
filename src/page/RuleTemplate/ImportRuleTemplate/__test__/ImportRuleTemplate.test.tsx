import { act, fireEvent, render, screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { RuleResV1LevelEnum } from '../../../../api/common.enum';
import rule_template from '../../../../api/rule_template';
import { renderWithThemeAndRouter } from '../../../../testUtils/customRender';
import {
  mockDriver,
  mockInstanceTip,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { allRulesWithType } from '../../../Rule/__testData__';
import ImportRuleTemplate from '../ImportRuleTemplate';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('../../../../hooks/useNavigate', () => jest.fn());
const projectName = 'default';

const parseFileData = {
  name: 'test1',
  db_type: 'mysql',
  rule_list: [
    {
      annotation: 'annotation',
      db_type: 'mysql',
      desc: 'test data',
      level: RuleResV1LevelEnum.normal,
      rule_name: 'test1',
      type: 'type',
    },
    allRulesWithType[0],
  ],
  desc: 'test data',
};

const sqlFile = new File(
  [new Blob(['test data'], { type: 'text/plain' })],
  'test.txt'
);

describe('test RuleTemplate/ImportRuleTemplate', () => {
  let getAllRulesSpy: jest.SpyInstance;
  let importProjectRuleTemplateSpy: jest.SpyInstance;
  let createTemplateSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    mockDriver();
    mockInstanceTip();
    createTemplateSpy = mockCreateTemplate();
    getAllRulesSpy = mockGetAllRules();
    importProjectRuleTemplateSpy = mockImportProjectRuleTemplate();
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({ projectName });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  const mockGetAllRules = () => {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(allRulesWithType));
    return spy;
  };

  const mockImportProjectRuleTemplate = () => {
    const spy = jest.spyOn(rule_template, 'importProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond(parseFileData));
    return spy;
  };

  const mockCreateTemplate = () => {
    const spy = jest.spyOn(rule_template, 'createProjectRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render select file form when first entered the page', () => {
    const { container } = render(<ImportRuleTemplate />);
    expect(container).toMatchSnapshot();
  });

  test('should display the create rule template form when the import file succeeds', async () => {
    renderWithThemeAndRouter(<ImportRuleTemplate />);
    expect(getAllRulesSpy).toBeCalledTimes(0);
    expect(importProjectRuleTemplateSpy).toBeCalledTimes(0);
    fireEvent.change(
      screen.getByLabelText('ruleTemplate.importRuleTemplate.selectFile'),
      {
        target: { files: [sqlFile] },
      }
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(
      screen.getByText('ruleTemplate.importRuleTemplate.submitText')
    );

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('ruleTemplate.importRuleTemplate.importingFile')
    ).toBeInTheDocument();
    expect(importProjectRuleTemplateSpy).toBeCalledTimes(1);
    expect(importProjectRuleTemplateSpy).toBeCalledWith({
      rule_template_file: sqlFile,
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.queryByText('ruleTemplate.importRuleTemplate.importingFile')
    ).not.toBeInTheDocument();
    expect(getAllRulesSpy).toBeCalledTimes(1);
    expect(getAllRulesSpy).toBeCalledWith({
      filter_db_type: parseFileData.db_type,
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue(parseFileData.name);
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).not.toBeDisabled();
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc')
    ).toHaveValue(parseFileData.desc);
    expect(
      screen.getByText(parseFileData.db_type).parentNode?.parentNode
    ).toHaveClass('ant-select-selection-item');

    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    expect(screen.getByTestId('rule-list')).toMatchSnapshot();

    fireEvent.click(screen.getByText('common.submit'));

    expect(createTemplateSpy).toBeCalledTimes(1);
    expect(createTemplateSpy).toBeCalledWith({
      db_type: parseFileData.db_type,
      desc: parseFileData.desc,
      rule_template_name: parseFileData.name,
      project_name: projectName,
      rule_list: [
        {
          name: allRulesWithType[0].rule_name,
          level: allRulesWithType[0].level,
          params: allRulesWithType[0].params.map((v) => ({
            key: v.key,
            value: v.value,
          })),
        },
      ],
    });

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('ruleTemplate.importRuleTemplate.successTitle')
    ).toBeInTheDocument();

    expect(screen.getByText('ruleTemplate.backToList')).toBeInTheDocument();

    fireEvent.click(
      screen.getByText('ruleTemplate.importRuleTemplate.importNew')
    );

    expect(
      screen.getByText('ruleTemplate.importRuleTemplate.selectFile')
    ).toBeInTheDocument();
  });
});
