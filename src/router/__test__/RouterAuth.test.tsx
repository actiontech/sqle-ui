import { useSelector } from 'react-redux';
import { renderWithMemoryRouter } from '../../testUtils/customRender';
import RouterAuth from '../RouterAuth';
import { Route, Routes } from 'react-router-dom';
import { cleanup, screen } from '@testing-library/react';
import { SystemRole } from '../../data/common';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const Home = <>Home</>;
const ReportStatistics = <>ReportStatistics</>;
const OperationRecord = <>OperationRecord</>;
const Root = <>Root</>;

const Component = (
  <Routes>
    <Route path="/" element={Root} />
    <Route path="/home" element={Home} />
    <Route path="/reportStatistics" element={ReportStatistics} />
    <Route path="/operationRecord" element={OperationRecord} />
  </Routes>
);

describe('test RouterAuth', () => {
  const mockUseSelector = useSelector as jest.Mock;
  test('should render "/home" when the current page is admin privileged and the current user is not admin', () => {
    mockUseSelector.mockImplementation((e) =>
      e({
        user: {
          role: '',
        },
      })
    );
    renderWithMemoryRouter(<RouterAuth>{Component}</RouterAuth>, undefined, {
      initialEntries: ['/home'],
    });

    expect(screen.getByText('Home')).toBeInTheDocument();
    cleanup();

    renderWithMemoryRouter(<RouterAuth>{Component}</RouterAuth>, undefined, {
      initialEntries: ['/'],
    });
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    cleanup();

    renderWithMemoryRouter(<RouterAuth>{Component}</RouterAuth>, undefined, {
      initialEntries: ['/reportStatistics'],
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('ReportStatistics')).not.toBeInTheDocument();
    cleanup();

    renderWithMemoryRouter(<RouterAuth>{Component}</RouterAuth>, undefined, {
      initialEntries: ['/operationRecord'],
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('OperationRecord')).not.toBeInTheDocument();
    cleanup();

    mockUseSelector.mockImplementation((e) =>
      e({
        user: {
          role: SystemRole.admin,
        },
      })
    );

    renderWithMemoryRouter(<RouterAuth>{Component}</RouterAuth>, undefined, {
      initialEntries: ['/reportStatistics'],
    });
    expect(screen.getByText('ReportStatistics')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    cleanup();

    renderWithMemoryRouter(<RouterAuth>{Component}</RouterAuth>, undefined, {
      initialEntries: ['/operationRecord'],
    });
    expect(screen.getByText('OperationRecord')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    cleanup();
  });
});
