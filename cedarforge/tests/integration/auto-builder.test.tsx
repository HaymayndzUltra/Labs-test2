import { render, screen, fireEvent } from '@testing-library/react';
import { AutoBuilder } from '../../src/shared/components/AutoBuilder';

describe('AutoBuilder', () => {
  it('submits automation with defaults', async () => {
    const handleSubmit = vi.fn();
    render(<AutoBuilder onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByText('Publish automation'));
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Untitled automation',
        trigger: 'threshold',
        dryRun: true
      })
    );
  });
});
