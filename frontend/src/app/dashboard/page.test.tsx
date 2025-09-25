import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import { Providers } from '../providers';

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

describe('DashboardPage', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders the unified header and module sections', () => {
    render(
      <Providers>
        <DashboardPage />
      </Providers>
    );

    expect(
      screen.getByRole('heading', {
        name: /Premium Multi-Category Dashboard/i,
        level: 1,
      })
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Experience controls')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SaaS Reliability & Growth' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'E-commerce Growth & Logistics' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Export Module CSV' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Automation Builder/)).toBeInTheDocument();
    expect(screen.getByText(/Data Export & Audit Trail/)).toBeInTheDocument();
  });
});
