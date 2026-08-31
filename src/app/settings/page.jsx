'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { user, login, loading } = useAuth();
  const { theme, setThemeName } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user?.id) {
      fetch('/api/users/' + user.id)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) {
            setForm({
              name: data.name || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || ''
            });
            if (data.theme) setThemeName(data.theme);
          }
        });
    }
  }, [user, loading]);

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users/' + user.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, theme })
    });
    const data = await res.json();
    if (res.ok) {
      login({ ...user, name: data.name, theme: data.theme });
      setMessage('Profile saved.');
    } else {
      setMessage(data.error || 'Could not save');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users/' + user.id + '/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwords)
    });
    const data = await res.json();
    setMessage(data.error || 'Password updated.');
    setPasswords({ currentPassword: '', newPassword: '' });
  };

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Settings</h1>
      <p className="text-zinc-500 text-sm mb-8">Account, address, appearance.</p>
      {message && <p className="mb-4 text-xs bg-amber-500/10 text-amber-500 p-3 rounded-lg">{message}</p>}

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-6">
        <h2 className="font-bold mb-4">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setThemeName('dark')}
            className={'flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 ' + (theme === 'dark' ? 'border-amber-500 text-amber-500' : 'border-zinc-300 dark:border-zinc-700')}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
          <button
            onClick={() => setThemeName('light')}
            className={'flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 ' + (theme === 'light' ? 'border-amber-500 text-amber-500' : 'border-zinc-300 dark:border-zinc-700')}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
        </div>
      </div>

      <form onSubmit={saveProfile} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-6 space-y-3">
        <h2 className="font-bold mb-2">Profile</h2>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full border rounded-xl p-3 text-sm" />
        <input value={user?.email || ''} disabled className="w-full border rounded-xl p-3 text-sm opacity-60" />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded-xl p-3 text-sm" />
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" className="w-full border rounded-xl p-3 text-sm" />
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="w-full border rounded-xl p-3 text-sm" />
        <button className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">Save profile</button>
      </form>

      <form onSubmit={changePassword} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <h2 className="font-bold mb-2">Password</h2>
        <input type="password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Current password" className="w-full border rounded-xl p-3 text-sm" />
        <input type="password" required minLength={6} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="New password" className="w-full border rounded-xl p-3 text-sm" />
        <button className="w-full border border-zinc-300 dark:border-zinc-700 font-bold py-3 rounded-xl text-sm">Update password</button>
      </form>
    </div>
  );
}
