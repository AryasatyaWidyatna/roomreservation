import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from 'page.jsx'; // Sesuaikan path jika file ada di lokasi lain
import '@testing-library/jest-dom';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  return {
    Calendar: () => <div data-testid="icon-calendar" />,
    Clock: () => <div data-testid="icon-clock" />,
    MapPin: () => <div data-testid="icon-mappin" />,
    Users: () => <div data-testid="icon-users" />,
    Star: () => <div data-testid="icon-star" />,
    ArrowRight: () => <div data-testid="icon-arrowright" />,
    Building2: () => <div data-testid="icon-building2" />,
    Wifi: () => <div data-testid="icon-wifi" />,
    Car: () => <div data-testid="icon-car" />,
    Coffee: () => <div data-testid="icon-coffee" />,
    UserPlus: () => <div data-testid="icon-userplus" />,
  };
});

describe('HomePage', () => {
  it('renders main heading correctly', () => {
    render(<HomePage />);
    expect(screen.getByText(/Room Reservation/i)).toBeInTheDocument();
    expect(screen.getByText(/CCWS/i)).toBeInTheDocument();
  });

  it('shows registration and login buttons', () => {
    render(<HomePage />);
    expect(screen.getByText(/Daftar sebagai Client/i)).toBeInTheDocument();
    expect(screen.getByText(/Login sebagai Client/i)).toBeInTheDocument();
  });

  it('renders feature titles', () => {
    render(<HomePage />);
    expect(screen.getByText(/Booking Mudah/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Lokasi Strategis/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim Support/i)).toBeInTheDocument();
  });

  it('renders amenities labels', () => {
    render(<HomePage />);
    expect(screen.getByText(/High-Speed WiFi/i)).toBeInTheDocument();
    expect(screen.getByText(/Parking Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Refreshments/i)).toBeInTheDocument();
    expect(screen.getByText(/Modern Facilities/i)).toBeInTheDocument();
  });

  it('renders footer text', () => {
    render(<HomePage />);
    expect(screen.getByText(/Room Reservation App/i)).toBeInTheDocument();
    expect(screen.getByText(/Reservasi Ruangan CCWS Terpercaya/i)).toBeInTheDocument();
  });
});
