import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import '@testing-library/jest-dom';

// Mock router supaya tidak error saat render
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Supabase supaya tidak dijalankan saat test
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('LoginPage UI', () => {
  it('renders heading and subheading correctly', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Masuk Akun/i })).toBeInTheDocument();
    expect(screen.getByText(/Selamat datang kembali!/i)).toBeInTheDocument();
  });

  it('renders email and password fields with correct labels and placeholders', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Masukkan email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Masukkan password/i)).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Masuk Sekarang/i })).toBeInTheDocument();
  });

  it('renders register and home links', () => {
    render(<LoginPage />);
    expect(screen.getByText(/Daftar di sini/i)).toBeInTheDocument();
    expect(screen.getByText(/Kembali ke Beranda/i)).toBeInTheDocument();
  });
});
