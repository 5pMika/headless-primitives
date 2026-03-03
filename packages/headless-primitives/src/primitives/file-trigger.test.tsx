import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { FileTrigger } from './file-trigger';

describe('FileTrigger', () => {
  it('renders hidden input and trigger button', () => {
    render(<FileTrigger>Choose file</FileTrigger>);
    const trigger = screen.getByRole('button', { name: 'Choose file' });
    expect(trigger).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-hidden', 'true');
  });

  it('trigger click programmatically clicks input', () => {
    const inputClickSpy = vi.fn();
    render(<FileTrigger>Choose file</FileTrigger>);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input.click = inputClickSpy;
    const trigger = screen.getByRole('button', { name: 'Choose file' });
    fireEvent.click(trigger);
    expect(inputClickSpy).toHaveBeenCalled();
  });

  it('applies disabled to both input and trigger', () => {
    render(<FileTrigger disabled>Choose file</FileTrigger>);
    const trigger = screen.getByRole('button', { name: 'Choose file' });
    const input = document.querySelector('input[type="file"]');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-disabled', '');
    expect(input).toBeDisabled();
  });

  it('merges props onto child when asChild', () => {
    render(
      <FileTrigger asChild data-testid="file-trigger">
        <button type="button">Custom trigger</button>
      </FileTrigger>
    );
    const trigger = screen.getByRole('button', { name: 'Custom trigger' });
    expect(trigger).toHaveAttribute('data-testid', 'file-trigger');
  });

  it('forwards ref to trigger', () => {
    let refValue: HTMLButtonElement | null = null;
    render(
      <FileTrigger
        ref={(el) => {
          refValue = el;
        }}
      >
        Choose file
      </FileTrigger>
    );
    const trigger = screen.getByRole('button', { name: 'Choose file' });
    expect(refValue).toBe(trigger);
  });

  it('passes accept, multiple, capture, name to input', () => {
    render(
      <FileTrigger accept="image/*" multiple capture="environment" name="upload">
        Choose file
      </FileTrigger>
    );
    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('multiple');
    expect(input).toHaveAttribute('capture', 'environment');
    expect(input).toHaveAttribute('name', 'upload');
  });

  it('calls onChange when input changes', () => {
    const onChange = vi.fn();
    render(<FileTrigger onChange={onChange}>Choose file</FileTrigger>);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalled();
  });

  it('has no a11y violations for basic render', async () => {
    const { container } = render(<FileTrigger>Choose file</FileTrigger>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
