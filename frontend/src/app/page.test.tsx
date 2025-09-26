import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the guided tour CTA', () => {
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /launch guided tour/i })).toBeInTheDocument();
  });
});