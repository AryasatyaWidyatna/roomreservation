import { render, screen } from '@testing-library/react';
import LoginPage from '../../app/login/page'; // sesuaikan path jika berbeda
import '@testing-library/jest-dom';
import React from 'react';

describe('LoginPage', () => {
  test('renders login heading and form elements', () => {
    render(<LoginPage />);

    // Judul halaman
    expect(screen.getByRole('heading', { name: /masuk akun/i })).toBeInTheDocument();

    // Input Email
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    // Input Password
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Tombol submit
    expect(screen.getByRole('button', { name: /masuk sekarang/i })).toBeInTheDocument();

    // Link ke register
    expect(screen.getByText(/daftar di sini/i)).toBeInTheDocument();

    // Link ke beranda
    expect(screen.getByText(/kembali ke beranda/i)).toBeInTheDocument();
  });
});
