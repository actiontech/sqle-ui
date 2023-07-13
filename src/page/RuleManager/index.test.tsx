/* eslint-disable no-console */
import { cleanup, screen } from '@testing-library/react';
import RuleManager from '.';
import {
  renderLocationDisplay,
  renderWithMemoryRouter,
} from '../../testUtils/customRender';
import { MemoryRouter } from 'react-router-dom';
import { SQLE_BASE_URL } from '../../data/common';
import { fireEvent } from '@testing-library/react';

describe('test rule manager', () => {
  const warn = console.warn;
  beforeAll(() => {
    console.warn = jest.fn();
    (console.warn as any).mockImplementation((message: any) => {
      if (message.includes('No routes matched location')) {
        return;
      }
      warn(message);
    });
  });
  afterAll(() => {
    console.warn = warn;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  test('should match snapshot', () => {
    const { container, rerender } = renderWithMemoryRouter(
      <RuleManager />,
      undefined,
      {
        initialEntries: [`${SQLE_BASE_URL}rule/template`],
      }
    );

    expect(container).toMatchSnapshot();

    expect(
      screen.getByText('ruleTemplate.globalRuleTemplateListTitle').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    rerender(
      <MemoryRouter initialEntries={[`${SQLE_BASE_URL}rule/template/create`]}>
        <RuleManager />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
    expect(
      screen.getByText('ruleTemplate.globalRuleTemplateListTitle').parentNode
    ).toHaveClass('ant-tabs-tab-active');

    cleanup();
    const { container: container1 } = renderWithMemoryRouter(
      <RuleManager />,
      undefined,
      {
        initialEntries: [`/`],
      }
    );
    expect(container1).toMatchSnapshot();
  });

  test('should change location when click tabs tab btn', async () => {
    const [, LocationComponent] = renderLocationDisplay();
    renderWithMemoryRouter(
      <>
        <RuleManager />
        <LocationComponent />
      </>,
      undefined,
      {
        initialEntries: [`${SQLE_BASE_URL}rule/custom`],
      }
    );

    expect(screen.getByText('customRule.title').parentNode).toHaveClass(
      'ant-tabs-tab-active'
    );

    fireEvent.click(
      screen.getByText('ruleTemplate.globalRuleTemplateListTitle')
    );
    expect(
      screen.getByText('ruleTemplate.globalRuleTemplateListTitle').parentNode
    ).toHaveClass('ant-tabs-tab-active');
    expect(screen.getByTestId('location-display')).toHaveTextContent(
      `${SQLE_BASE_URL}rule/template`
    );
  });
});
