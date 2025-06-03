'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';

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
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-2">Reservasi Ruangan</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-400">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded border border-green-400">
          {message}
        </div>
      )}

      <div className="flex gap-4 flex-wrap items-center">
        <div>
          <label className="block text-sm font-medium">Tanggal</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sesi</label>
          <select
            className="border p-2 rounded"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="1">Sesi 1</option>
            <option value="2">Sesi 2</option>
            <option value="3">Sesi 3</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{room.name}</h2>
            <p>Kapasitas: {room.capacity}</p>
            <p>{room.description}</p>
            <button
              onClick={() => handleReserve(room.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
