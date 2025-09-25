import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import { Providers } from '../providers';

describe('DashboardPage', () => {
  it('renders the premium header and module controls', () => {
    render(
      <Providers>
        <DashboardPage />
      </Providers>
    );

    expect(
      screen.getByRole('heading', {
        name: /premium multi-category dashboard: saas, e-commerce, corporate, media, edtech, custom app, niches/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: /dashboard modules/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export json/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Theme:/i })).toBeInTheDocument();
  });
});
