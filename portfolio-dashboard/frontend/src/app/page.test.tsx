import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

jest.mock('@/components/landing/landing-constellation', () => ({ LandingConstellation: () => <div>Landing Constellation</div> }));
jest.mock('@/components/dashboard/dashboard-vault', () => ({ DashboardVault: () => <div>Dashboard Vault</div> }));
jest.mock('@/components/profile/dynamic-profile-hub', () => ({ DynamicProfileHub: () => <div>Dynamic Profile Hub</div> }));
jest.mock('@/components/discovery/discovery-client-module', () => ({ DiscoveryClientModule: () => <div>Discovery</div> }));
jest.mock('@/components/animation/animation-suite', () => ({ AnimationSuite: () => <div>Animation Suite</div> }));
jest.mock('@/components/automation/automation-personalization', () => ({ AutomationPersonalization: () => <div>Automation</div> }));

describe('HomePage', () => {
  it('renders nonlinear navigation anchors', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /discover/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /automate/i })).toBeInTheDocument();
  });
});