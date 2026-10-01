'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      
      {/* Overlay sombre pour mobile quand le menu est ouvert */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Barre latérale responsive (fixe sur desktop, glissante sur mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0B1120] text-slate-300 shadow-2xl transition-transform duration-300 ease-in-out lg:fixed lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white shadow-lg shadow-blue-600/20">
              HF
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Hôtel Flow</span>
          </div>
          {/* Bouton fermer sur mobile */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-8 text-sm font-medium overflow-y-auto">
          <a 
            href="/admin/dashboard" 
            className={`flex items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all ${
              pathname === '/admin/dashboard' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Tableau de bord</span>
          </a>

          <a 
            href="/admin/rooms" 
            className={`flex items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all ${
              pathname?.startsWith('/admin/rooms') 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
            </svg>
            <span>Chambres</span>
          </a>

          <a 
            href="/admin/reservations" 
            className={`flex items-center space-x-3 rounded-2xl px-4 py-3.5 transition-all ${
              pathname?.startsWith('/admin/reservations') 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Réservations</span>
          </a>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3">
            <div className="truncate pr-2">
              <p className="text-sm font-semibold text-white truncate">{user?.name || user?.email || 'Admin'}</p>
              <p className="text-[11px] text-slate-400">Administrateur</p>
            </div>
            <button onClick={handleLogout} title="Déconnexion" className="flex-shrink-0 rounded-xl p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Conteneur principal (avec marge à gauche sur desktop) */}
      <div className="flex flex-1 flex-col lg:pl-64 w-full min-w-0">
        
        {/* Header Mobile Uniquement */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 px-4 backdrop-blur-md border-b border-slate-200 lg:hidden shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs">HF</div>
            <span className="font-bold text-slate-900">Hôtel Flow</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* C'est ici que s'affichera le contenu de chaque page (Dashboard, Chambres, etc.) */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}