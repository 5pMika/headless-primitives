import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Accordion } from './accordion';

describe('Accordion', () => {
  it('renders Root + Item + Header + Trigger + Content', () => {
    render(
      <Accordion.Root type="single" defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    expect(screen.getByRole('button', { name: 'Section 1' })).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('expands and collapses in single mode', () => {
    render(
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    const trigger = screen.getByRole('button', { name: 'Section 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows only one item open in single mode', () => {
    render(
      <Accordion.Root type="single">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>Section 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Section 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Section 2' }));
    expect(screen.getByRole('button', { name: 'Section 1' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: 'Section 2' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('allows multiple items open in multiple mode', () => {
    render(
      <Accordion.Root type="multiple">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>Section 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Section 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Section 2' }));
    expect(screen.getByRole('button', { name: 'Section 1' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Section 2' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('allows all items to close when collapsible', () => {
    render(
      <Accordion.Root type="single" collapsible defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    const trigger = screen.getByRole('button', { name: 'Section 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports controlled value', () => {
    const onValueChange = vi.fn();
    render(
      <Accordion.Root type="single" collapsible value="item-1" onValueChange={onValueChange}>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Section 1' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('applies disabled to item', () => {
    render(
      <Accordion.Root type="single">
        <Accordion.Item value="item-1" disabled>
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    const trigger = screen.getByRole('button', { name: 'Section 1' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-disabled', '');
  });

  it('has no a11y violations for basic render', async () => {
    const { container } = render(
      <Accordion.Root type="single">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>Section 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
