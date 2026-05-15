import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AppContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.data.user, data.data.token);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">🎮</p>
          <h1 className="text-2xl font-black">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-gray-400 text-sm mt-1">{isRegister ? 'Join GameStore today' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</p>}

          <button type="submit" disabled={loading} className="btn-neon w-full py-2.5">
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-neon hover:underline">
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}
