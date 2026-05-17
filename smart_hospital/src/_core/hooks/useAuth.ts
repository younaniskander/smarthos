import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ name: string; id: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading and user
    setTimeout(() => {
      setUser({ name: 'Dr. Smith', id: 1 });
      setLoading(false);
    }, 500);
  }, []);

  return { user, loading };
}
