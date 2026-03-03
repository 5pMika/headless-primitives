import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Form } from './form';

function BasicForm() {
  return (
    <Form.Root>
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" required placeholder="Enter email" />
        <Form.Message match="valueMissing">Email is required</Form.Message>
      </Form.Field>
      <Form.Submit>Submit</Form.Submit>
    </Form.Root>
  );
}

describe('Form', () => {
  it('renders Root + Field + Label + Control + Message + Submit', () => {
    render(<BasicForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('associates label with control via htmlFor', () => {
    render(<BasicForm />);
    const label = screen.getByText('Email');
    const control = screen.getByLabelText('Email');
    expect(label).toHaveAttribute('for', control.id);
  });

  it('shows validation message on submit when required field is empty', async () => {
    render(<BasicForm />);
    const submit = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submit);
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('calls onClearServerErrors on reset', () => {
    const onClearServerErrors = vi.fn();
    render(
      <Form.Root onClearServerErrors={onClearServerErrors}>
        <Form.Field name="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" />
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
        <button type="reset">Reset</button>
      </Form.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClearServerErrors).toHaveBeenCalled();
  });

  it('shows message when serverInvalid is true with forceMatch', () => {
    render(
      <Form.Root>
        <Form.Field name="email" serverInvalid>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" />
          <Form.Message forceMatch>Server error: invalid email</Form.Message>
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form.Root>
    );
    expect(screen.getByText('Server error: invalid email')).toBeInTheDocument();
  });

  it('Form.Submit renders button with type submit', () => {
    render(<BasicForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('Form.Control receives aria-describedby from field message', () => {
    render(<BasicForm />);
    const control = screen.getByLabelText('Email');
    const message = screen.getByText('Email is required');
    expect(control).toHaveAttribute('aria-describedby', message.id);
  });

  it('has no a11y violations for basic render', async () => {
    const { container } = render(<BasicForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations after validation', async () => {
    const { container } = render(<BasicForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await screen.findByText('Email is required');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports asChild on Form.Submit', () => {
    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" />
        </Form.Field>
        <Form.Submit asChild>
          <button type="button">Custom Submit</button>
        </Form.Submit>
      </Form.Root>
    );
    const btn = screen.getByRole('button', { name: 'Custom Submit' });
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('Form.ValidityState provides validity to children', async () => {
    let validityValue: ValidityState | undefined;
    render(
      <Form.Root>
        <Form.Field name="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required />
          <Form.ValidityState>
            {(validity) => {
              validityValue = validity;
              return null;
            }}
          </Form.ValidityState>
        </Form.Field>
        <Form.Submit>Submit</Form.Submit>
      </Form.Root>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await vi.waitFor(() => {
      expect(validityValue).toBeDefined();
      expect(validityValue?.valid).toBe(false);
      expect(validityValue?.valueMissing).toBe(true);
    });
  });
});
