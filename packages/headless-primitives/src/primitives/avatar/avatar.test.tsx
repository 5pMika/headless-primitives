import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders fallback when no image', () => {
    render(
      <Avatar.Root aria-label="User">
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Avatar.Root aria-label="User">
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
