// Mock environment variables first
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://cradzbdfhvrzcmlpumrn.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyYWR6YmRmaHZyemNtbHB1bXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA1MTksImV4cCI6MjA2NDE2NjUxOX0.qCJgJ1kuk0RTTw7ACL3AWC9AccOEer6hj8FegmYac4k';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Create mock supabase object
const mockSignInWithPassword = jest.fn();
const mockSupabase = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
  },
};

// Mock dependencies BEFORE importing the component
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock the supabase module completely
jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase,
}));

// Import component AFTER mocking
import LoginPage from './page';

describe('LoginPage', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Masuk Akun')).toBeInTheDocument();
    expect(screen.getByText('Selamat datang kembali!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan password')).toBeInTheDocument();
    expect(screen.getByText('Masuk Sekarang')).toBeInTheDocument();
  });

  it('renders navigation links correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Belum punya akun?')).toBeInTheDocument();
    expect(screen.getByText('Daftar di sini')).toBeInTheDocument();
    expect(screen.getByText('← Kembali ke Beranda')).toBeInTheDocument();
  });

  it('updates email and password input values', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows loading state when form is submitted', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    const submitButton = screen.getByText('Masuk Sekarang');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check if loading spinner is shown
    expect(screen.getByRole('button')).toBeDisabled();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    const submitButton = screen.getByText('Masuk Sekarang');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/client/reserve');
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid email or password';
    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    const submitButton = screen.getByText('Masuk Sekarang');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('clears error message when form is resubmitted', async () => {
    // First submission with error
    mockSignInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    const submitButton = screen.getByText('Masuk Sekarang');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Second submission should clear error
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '1' } },
      error: null,
    });

    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  it('prevents form submission when loading', async () => {
    mockSignInWithPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 1000))
    );

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    const submitButton = screen.getByText('Masuk Sekarang');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
    
    // Try to click again - should not call signInWithPassword again
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledTimes(1);
    });
  });

  it('validates required fields', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Masukkan email');
    const passwordInput = screen.getByPlaceholderText('Masukkan password');
    
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders icons correctly', () => {
    render(<LoginPage />);
    
    // Check if Lucide icons are rendered (they should be in the DOM)
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('has correct link hrefs', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByText('Daftar di sini').closest('a');
    const homeLink = screen.getByText('← Kembali ke Beranda').closest('a');
    
    expect(registerLink).toHaveAttribute('href', '/register');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
