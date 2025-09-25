import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the premium dashboard header', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', {
        name: /premium multi-category dashboard: saas, e-commerce, corporate, media, edtech, custom app, niches/i,
      })
    ).toBeInTheDocument();
  });

  it('provides navigation to the dashboard and docs', () => {
    render(<HomePage />);
    expect(screen.getByText(/enter dashboard/i)).toBeInTheDocument();
    expect(screen.getAllByText(/design tokens/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/motion map/i)).toBeInTheDocument();
  });
});