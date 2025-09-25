import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from './page';

describe('DashboardPage', () => {
  it('renders dashboard header and module sections', async () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole('heading', {
        name: /premium multi-category dashboard/i,
      })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/SaaS Growth Ops/i)).toBeInTheDocument();
      expect(screen.getByText(/E-commerce Command Center/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Automation builder/i).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: /Export CSV/i }).length).toBeGreaterThan(0);
    });
  });
});
