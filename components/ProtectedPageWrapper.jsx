'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProtectedPageWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    });
  }, [router]); // ✅ tambahkan router di dependency array

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
}
