'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Identifiants incorrects.');
      }

      localStorage.setItem('token', data.access_token);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-slate-100">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            HF
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Connexion à Hotel Flow</h1>
          <p className="text-sm text-slate-500">Connectez-vous pour accéder aux réservations</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-sm p-3.5 rounded-2xl border border-rose-200 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800 text-sm"
              placeholder="exemple@domaine.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 text-sm"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-bold">ou</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm text-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continuer avec Google
        </button>
      </div>
    </div>
  );
}