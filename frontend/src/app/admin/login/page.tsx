'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
        throw new Error(data.message || 'Identifiants incorrects');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Panneau latéral gauche : Image plein écran (sans border-radius) */}
      <div className="relative hidden w-1/2 lg:block bg-blue-900 overflow-hidden">
        
        {/* Image de fond libre de droits */}
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Hall d'hôtel" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {/* Dégradé superposé (bas vers haut) pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/80 to-blue-900/40" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-extrabold text-blue-700 shadow-lg">
              HF
            </div>
            <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">Hôtel Flow</span>
          </div>

          {/* Texte de présentation */}
          <div className="space-y-6 max-w-lg">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-100 border border-white/20 backdrop-blur-md shadow-sm">
              Espace Administration
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
              Pilotez votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                établissement
              </span>
            </h1>
            <p className="text-base text-blue-50/90 leading-relaxed drop-shadow-md">
              Accédez à votre espace sécurisé pour gérer vos chambres, suivre vos réservations et optimiser vos services en temps réel.
            </p>
            
            {/* Puces de fonctionnalités */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <ul className="space-y-3">
                {['Gestion centralisée des chambres', 'Suivi des réservations en direct', 'Tableau de bord analytique'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-blue-50/90">
                    <svg className="w-5 h-5 mr-3 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-blue-200/70 drop-shadow-sm">
            © 2026 Hôtel Flow — Tous droits réservés
          </div>
        </div>
      </div>

      {/* Panneau droit : Formulaire d'authentification amélioré */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2 bg-slate-50 relative">
        
        {/* Lien de retour au site */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center text-xs sm:text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-slate-200/50 px-3 py-2 rounded-xl transition-all z-20"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au site
        </Link>

        {/* Carte du formulaire */}
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* En-tête du formulaire */}
          <div className="text-center mb-10">
            {/* Logo visible uniquement sur mobile */}
            <div className="flex lg:hidden justify-center items-center space-x-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-md">
                HF
              </div>
              <span className="text-2xl font-bold text-slate-900">Hôtel Flow</span>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bon retour !</h2>
            <p className="mt-3 text-sm text-slate-500">
              Connectez-vous pour accéder à votre tableau de bord.
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-start space-x-3 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@hotelflow.com"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Champ Mot de Passe */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mot de Passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none rounded-r-xl"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.007 10.007 0 012.33-.263c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Options : Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 group-hover:border-blue-400"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Se souvenir de moi</span>
              </label>
              
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Connexion en cours...</span>
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
          
          {/* Pied de page du formulaire */}
          <div className="text-center text-xs text-slate-400 pt-6 mt-6 border-t border-slate-100">
            En vous connectant, vous acceptez nos <a href="#" className="text-slate-500 hover:text-blue-600 underline transition-colors">Conditions d'utilisation</a>.
          </div>
        </div>
      </div>
    </div>
  );
}