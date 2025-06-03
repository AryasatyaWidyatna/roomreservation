// File: app/admin/rooms/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedPageWrapper from '@/components/ProtectedPageWrapper';

export default function Page() {
  return (
    <ProtectedPageWrapper>
      <AdminRooms />
    </ProtectedPageWrapper>
  );
}

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) {
        setMessage('Gagal mengambil data ruangan.');
      } else {
        setRooms(data);
      }
    };
    fetchRooms();
  }, [message]);

  const handleAddRoom = async () => {
    if (!name || !capacity) {
      setMessage('Nama dan kapasitas wajib diisi.');
      return;
    }

    const { error } = await supabase.from('rooms').insert({
      name,
      capacity: parseInt(capacity),
      description,
    });

    if (!error) {
      setMessage('Ruangan berhasil ditambahkan.');
      setName('');
      setCapacity('');
      setDescription('');
    } else {
      setMessage('Gagal menambahkan ruangan.');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Kelola Ruangan</h1>

      <div className="space-y-2 max-w-md">
        <input
          className="border p-2 w-full rounded"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          type="number"
          placeholder="Kapasitas"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddRoom}
        >
          Tambah Ruangan
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold">{room.name}</h2>
            <p>Kapasitas: {room.capacity}</p>
            <p>{room.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
