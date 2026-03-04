import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Select } from './select';

describe('Select', () => {
  it('renders and selects', () => {
    render(
      <Select.Root>
        <Select.Trigger>Select</Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Item value="a">Option A</Select.Item>
            <Select.Item value="b">Option B</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'Option B' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Select.Root defaultOpen defaultValue="a">
        <Select.Trigger>Select</Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Item value="a">Option A</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
