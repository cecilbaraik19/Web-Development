import React, { useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://certimail-forensic.onrender.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { passphrase });
      sessionStorage.setItem('certimail_token', res.data.token);
      onLoginSuccess(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 rounded-xl p-8 w-full max-w-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 text-cyan-400 justify-center mb-2">
          <Lock size={20} />
          <h1 className="text-lg font-bold">CertiMail Forensics</h1>
        </div>
        <p className="text-xs text-slate-400 text-center">Enter the analyst passphrase to continue.</p>
        <input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Passphrase"
          className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          autoFocus
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !passphrase}
          className="bg-cyan-600 hover:bg-cyan-500 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
}