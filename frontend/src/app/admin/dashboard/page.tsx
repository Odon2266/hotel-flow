'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Données de démonstration pour le tableau de bord (Phase 7 du CDC)
  const stats = [
    {
      title: 'Chambres Totales',
      value: '24',
      subtext: '18 occupées (75%)',
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
        </svg>
      ),
      bg: 'bg-blue-50',
    },
    {
      title: 'Réservations Actives',
      value: '42',
      subtext: '+12% ce mois',
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-emerald-50',
    },
    {
      title: 'Revenus du Mois',
      value: '14 850 €',
      subtext: 'Paiements Stripe validés',
      icon: (
        <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-violet-50',
    },
    {
      title: 'Taux d\'Occupation',
      value: '78 %',
      subtext: 'Objectif mensuel : 80%',
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: 'bg-amber-50',
    },
  ];

  const recentReservations = [
    { id: 'RES-1024', client: 'Jean Dupont', room: 'Suite VIP n°101', dates: '20 Sep - 24 Sep', status: 'Payé', amount: '600 €' },
    { id: 'RES-1025', client: 'Marie Curie', room: 'Chambre n°102', dates: '21 Sep - 23 Sep', status: 'En attente', amount: '240 €' },
    { id: 'RES-1026', client: 'Alexandre Martin', room: 'Suite Premium n°23', dates: '22 Sep - 28 Sep', status: 'Payé', amount: '1 800 €' },
    { id: 'RES-1027', client: 'Sophie Bernard', room: 'Chambre n°105', dates: '25 Sep - 27 Sep', status: 'Annulé', amount: '180 €' },
  ];

  useEffect(() => {
    // Vérification basique du token d'authentification
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3 text-slate-600">
          <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="text-sm font-medium">Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Barre latérale (Sidebar Nav) */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-slate-900 text-slate-300 shadow-xl">
        {/* Brand Header */}
        <div className="flex h-16 items-center space-x-3 px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white">
            HF
          </div>
          <span className="text-lg font-bold text-white tracking-wide">Hôtel Flow</span>
        </div>

        {/* Liens de navigation Admin (Sections du Cahier des Charges) */}
        <nav className="flex-1 space-y-1 px-4 py-6 text-sm font-medium">
          <a href="#" className="flex items-center space-x-3 rounded-xl bg-blue-600 px-4 py-3 text-white shadow-md shadow-blue-600/30">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Tableau de bord</span>
          </a>

          <a href="#" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
            </svg>
            <span>Chambres</span>
          </a>

          <a href="#" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Réservations</span>
          </a>

          <a href="#" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Clients</span>
          </a>

          <a href="#" className="flex items-center space-x-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Offres & Services</span>
          </a>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.email || 'Administrateur'}</p>
              <p className="text-[10px] text-slate-400">Rôle : Admin</p>
            </div>
            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-64 flex-1 p-8">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
            <p className="text-xs text-slate-500">Bienvenue dans l'espace de gestion de votre hôtel.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ajouter une réservation</span>
            </button>
          </div>
        </header>

        {/* Grid Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{stat.subtext}</p>
              </div>
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Section Table / Activités Récents */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dernières Réservations</h2>
              <p className="text-xs text-slate-500">Aperçu rapide des demandes de séjour récentes.</p>
            </div>
            <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Voir tout →</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Réf</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Chambre</th>
                  <th className="px-6 py-3">Dates</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{res.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{res.client}</td>
                    <td className="px-6 py-4">{res.room}</td>
                    <td className="px-6 py-4">{res.dates}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{res.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        res.status === 'Payé' ? 'bg-emerald-100 text-emerald-800' :
                        res.status === 'En attente' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}