import { render, screen } from '@testing-library/react';
import LoginPage from '../../app/login/page'; // sesuaikan path jika berbeda
import '@testing-library/jest-dom';
import React from 'react';

const SUPABASE_URL = 'https://cradzbdfhvrzcmlpumrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyYWR6YmRmaHZyemNtbHB1bXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA1MTksImV4cCI6MjA2NDE2NjUxOX0.qCJgJ1kuk0RTTw7ACL3AWC9AccOEer6hj8FegmYac4k';

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
