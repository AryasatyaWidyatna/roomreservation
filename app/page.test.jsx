import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from 'page.jsx';
import '@testing-library/jest-dom';

// Mock next/link
jest.mock('next/link', () => {
  return function Link({ children }) {
    return children;
  };
});

// Mock lucide-react icons using React.createElement instead of JSX
jest.mock('lucide-react', () => {
  const React = require('react');
  return {
    Calendar: () => React.createElement('div', { 'data-testid': 'icon-calendar' }),
    Clock: () => React.createElement('div', { 'data-testid': 'icon-clock' }),
    MapPin: () => React.createElement('div', { 'data-testid': 'icon-mappin' }),
    Users: () => React.createElement('div', { 'data-testid': 'icon-users' }),
    Star: () => React.createElement('div', { 'data-testid': 'icon-star' }),
    ArrowRight: () => React.createElement('div', { 'data-testid': 'icon-arrowright' }),
    Building2: () => React.createElement('div', { 'data-testid': 'icon-building2' }),
    Wifi: () => React.createElement('div', { 'data-testid': 'icon-wifi' }),
    Car: () => React.createElement('div', { 'data-testid': 'icon-car' }),
    Coffee: () => React.createElement('div', { 'data-testid': 'icon-coffee' }),
    UserPlus: () => React.createElement('div', { 'data-testid': 'icon-userplus' }),
  };
});

describe('HomePage', () => {
  it('renders main heading correctly', () => {
    render(React.createElement(HomePage));
    expect(screen.getByText(/Room Reservation/i)).toBeInTheDocument();
    expect(screen.getByText(/CCWS/i)).toBeInTheDocument();
  });

  it('shows registration and login buttons', () => {
    render(React.createElement(HomePage));
    expect(screen.getByText(/Daftar sebagai Client/i)).toBeInTheDocument();
    expect(screen.getByText(/Login sebagai Client/i)).toBeInTheDocument();
  });

  it('renders feature titles', () => {
    render(React.createElement(HomePage));
    expect(screen.getByText(/Booking Mudah/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Lokasi Strategis/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim Support/i)).toBeInTheDocument();
  });

  it('renders amenities labels', () => {
    render(React.createElement(HomePage));
    expect(screen.getByText(/High-Speed WiFi/i)).toBeInTheDocument();
    expect(screen.getByText(/Parking Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Refreshments/i)).toBeInTheDocument();
    expect(screen.getByText(/Modern Facilities/i)).toBeInTheDocument();
  });

  it('renders footer text', () => {
    render(React.createElement(HomePage));
    expect(screen.getByText(/Room Reservation App/i)).toBeInTheDocument();
    expect(screen.getByText(/Reservasi Ruangan CCWS Terpercaya/i)).toBeInTheDocument();
  });
});
