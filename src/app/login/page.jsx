'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Login failed');
      setLoading(false);
    } else {
      login(data);
      router.push(data.role === 'ADMIN' ? '/admin' : '/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-black mb-6 text-center">Sign in</h1>
      {error && <p className="bg-rose-500/10 text-rose-400 text-xs p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl p-3 text-sm" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl p-3 text-sm" />
        <button disabled={loading} className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">
          {loading ? 'Checking...' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-xs text-zinc-500 mt-4">
        New here? <Link href="/register" className="text-amber-500 font-bold">Register</Link>
      </p>
      <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs text-zinc-500 space-y-1">
        <p className="font-bold text-zinc-700 dark:text-zinc-300">Test logins</p>
        <p>admin@novamart.com / admin123</p>
        <p>john@example.com / user123</p>
      </div>
    </div>
  );
}
