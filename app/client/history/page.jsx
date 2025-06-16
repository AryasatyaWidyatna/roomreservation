// File: app/client/history/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';
import React from 'react';


import Link from 'next/link';

export default function Page() {
  return (
    <ProtectedPageWrapper>
      <ClientHistory />
    </ProtectedPageWrapper>
  );
}


function ClientHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchClientHistory = async () => {
      const {
        data: { session: userSession },
        error: sessionError,
      } = await supabase.auth.getSession();
      
      if (sessionError || !userSession) {
        setError('Anda harus login terlebih dahulu.');
        setLoading(false);
        return;
      }

      const clientEmail = userSession.user.email;
      setUserEmail(clientEmail);

      const { data, error } = await supabase
        .from('reservations')
        .select('id, date, session, rooms(name)')
        .eq('client_name', clientEmail)
        .order('date', { ascending: false })
        .order('session', { ascending: true });

      if (error) {
        setError('Gagal mengambil data reservasi.');
      } else {
        setReservations(data);
      }
      setLoading(false);
    };

    fetchClientHistory();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect atau refresh halaman setelah logout
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Sistem Reservasi
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-900 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                Riwayat Reservasi
              </a>
              <a href="../client/reserve" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Buat Reservasi
              </a>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              > <a href="../login">
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Riwayat Reservasi Anda</h2>
            
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded border border-red-400 mb-6">
                {error}
              </div>
            )}

            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada reservasi</h3>
                <p className="mt-1 text-sm text-gray-500">Anda belum memiliki riwayat reservasi.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Buat Reservasi Baru
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        ID: {res.id}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Selesai
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Tanggal:</span> {res.date}
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Sesi:</span> {res.session}
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                        <span className="font-medium">Ruangan:</span> {res.rooms?.name || 'Tidak diketahui'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
