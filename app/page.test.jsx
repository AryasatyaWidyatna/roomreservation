/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page'; // sesuaikan path jika berbeda
import '@testing-library/jest-dom';
import React from 'react';


describe('HomePage Component', () => {
  test('renders main heading and subheading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /CCWS Reservation/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Silakan masuk sebagai/i)).toBeInTheDocument();
  });

  test('renders Daftar dan Login button', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('button', { name: /Regist sebagai Client/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Login sebagai Client/i })
    ).toBeInTheDocument();
  });

  test('renders features section', () => {
    render(<HomePage />);

    expect(screen.getByText('Booking Mudah')).toBeInTheDocument();
    expect(screen.getByText('24/7 Available')).toBeInTheDocument();
    expect(screen.getByText('Lokasi Strategis')).toBeInTheDocument();
    expect(screen.getByText('Tim Support')).toBeInTheDocument();
  });

  test('renders amenities section', () => {
    render(<HomePage />);

    expect(screen.getByText('High-Speed WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking Area')).toBeInTheDocument();
    expect(screen.getByText('Refreshments')).toBeInTheDocument();
    expect(screen.getByText('Modern Facilities')).toBeInTheDocument();
  });

  test('renders footer content', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Room Reservation App')).toBeInTheDocument();
    expect(screen.getByText(/Reserve Ruangan CCWS Terpercaya/i)).toBeInTheDocument();
  });
});
