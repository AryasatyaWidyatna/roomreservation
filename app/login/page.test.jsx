import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page'; 
import '@testing-library/jest-dom';
import React from 'react';
import { supabase } from '../../lib/supabaseClient';


// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Supabase client
jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() =>
        Promise.resolve({ data: {}, error: null })
      ),
    },
  },
}));

describe('LoginPage', () => {
  test('renders form elements correctly', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk sekarang/i })).toBeInTheDocument();
  });

  test('can input email and password', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('user@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('calls Supabase login on form submit', async () => {
    const { supabase } = require('@/lib/supabaseClient');
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /masuk sekarang/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });
});
