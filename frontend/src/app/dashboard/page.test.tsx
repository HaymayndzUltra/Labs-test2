import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/lib/design-system/theme-context';
import DashboardPage from './page';

function renderDashboard() {
  return render(
    <ThemeProvider>
      <DashboardPage />
    </ThemeProvider>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders the premium dashboard header and module controls', () => {
    renderDashboard();

    expect(
      screen.getAllByRole('heading', {
        name: /Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches/i,
      }).length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByRole('button', { name: /SaaS Lifecycle Orchestration/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Theme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Direction/i)).toBeInTheDocument();
  });

  it('records an export in the audit log and shows a toast', () => {
    renderDashboard();

    const exportButton = screen.getByRole('button', { name: /Export CSV/i });
    act(() => {
      exportButton.click();
    });

    expect(screen.getByText(/Exported CSV for SaaS Lifecycle Orchestration/i)).toBeInTheDocument();
    expect(screen.getAllByText('CSV').length).toBeGreaterThan(0);
  });
});
