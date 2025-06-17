'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';
import React from 'react';


export default function Page() {
  return (
    <ProtectedPageWrapper>
      <ReserveRoom />
    </ProtectedPageWrapper>
  );
}

function ReserveRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [session, setSession] = useState('1');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from('rooms').select('*');
      if (!error) setRooms(data);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

   const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect atau refresh halaman setelah logout
    window.location.reload();
  };

  const handleReserve = async (roomId) => {
    setError('');
    setMessage('');

    const {
      data: { session: userSession },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !userSession) {
      setError('Anda harus login terlebih dahulu.');
      return;
    }

    const clientName = userSession.user.email;
    const userId = userSession.user.id;

    if (!date || !session) {
      setError('Tanggal dan sesi harus dipilih.');
      return;
    }

    const { data: existing } = await supabase
      .from('reservations')
      .select('*')
      .eq('room_id', roomId)
      .eq('date', date)
      .eq('session', parseInt(session));

    if (existing && existing.length > 0) {
      setError('Ruangan sudah dipesan pada tanggal dan sesi tersebut.');
      return;
    }

    const { error: insertError } = await supabase.from('reservations').insert({
      room_id: roomId,
      client_name: clientName,
      user_id: userId, // 👈 tambahkan ini
      date,
      session: parseInt(session),
    });

    if (insertError) {
      setError('Terjadi kesalahan saat reservasi.');
    } else {
      setMessage('Reservasi berhasil!');
    }
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
              <a href="../client/history" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Riwayat Reservasi
              </a>
              <a href="../client/reserve" className="text-gray-900 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
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
              >
                <a href="../../app">
                Logout
                 </a>
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
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Reservasi Ruangan</h2>
            
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded border border-red-400 mb-6">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded border border-green-400 mb-6">
                {message}
              </div>
            )}
            
            <div className="flex gap-4 flex-wrap items-end mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sesi</label>
                <select
                  className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                >
                  <option value="1">Sesi 1 (08:00 - 12:00)</option>
                  <option value="2">Sesi 2 (13:00 - 17:00)</option>
                  <option value="3">Sesi 3 (18:00 - 22:00)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {room.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Tersedia
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Kapasitas:</span> {room.capacity} orang
                    </div>
                    <div className="flex items-start">
                      <svg className="h-4 w-4 mr-2 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{room.description}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReserve(room.id)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Reserve Ruangan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div> 
   
  );
}
