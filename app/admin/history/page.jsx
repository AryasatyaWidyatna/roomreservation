'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';

export default function Page() {
  return (
    <ProtectedPageWrapper>
      <AdminHistory />
    </ProtectedPageWrapper>
  );
}

function AdminHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('id, client_name, date, session, rooms(name)')
        .order('date', { ascending: false });

      if (error) {
        setError('Gagal mengambil data reservasi.');
      } else {
        setReservations(data);
      }
      setLoading(false);
    };
    fetchReservations();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Riwayat Reservasi (Admin)</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-400">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <p>Tidak ada data reservasi.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => (
            <div key={res.id} className="border p-4 rounded shadow bg-white hover:shadow-lg transition">
              <h2 className="font-semibold text-lg">ID Reservasi: {res.id}</h2>
              <p>Client: {res.client_name}</p>
              <p>Tanggal: {res.date}</p>
              <p>Sesi: {res.session}</p>
              <p>Ruangan: {res.rooms?.name || 'Tidak diketahui'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
