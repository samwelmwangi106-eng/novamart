'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed');
      setLoading(false);
    } else {
      login(data);
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-black mb-6 text-center">Create account</h1>
      {error && <p className="bg-rose-500/10 text-rose-400 text-xs p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border rounded-xl p-3 text-sm" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl p-3 text-sm" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)" className="w-full border rounded-xl p-3 text-sm" />
        <button disabled={loading} className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">
          {loading ? 'Saving...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-xs text-zinc-500 mt-4">
        Already have an account? <Link href="/login" className="text-amber-500 font-bold">Sign in</Link>
      </p>
    </div>
  );
}
