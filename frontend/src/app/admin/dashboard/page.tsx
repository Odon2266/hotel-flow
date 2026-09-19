'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  activeReservations: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

interface RecentBooking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  room: {
    number: string;
    type: string;
  };
  payment?: {
    status: string;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour gérer le menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const baseUrl = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;

        const [statsRes, bookingsRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/dashboard/stats`, { headers }),
          fetch(`${baseUrl}/api/admin/dashboard/recent`, { headers }),
        ]);

        if (!statsRes.ok || !bookingsRes.ok) {
          throw new Error('Erreur lors du chargement des données depuis le serveur.');
        }

        const statsData: DashboardStats = await statsRes.json();
        const bookingsData: RecentBooking[] = await bookingsRes.json();

        setStats(statsData);
        setRecentBookings(bookingsData);
      } catch (err: any) {
        console.error('Erreur dashboard:', err);
        setError(err.message || 'Impossible de se connecter au serveur backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
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

  const statCards = [
    {
      title: 'Chambres',
      value: stats ? stats.totalRooms.toString() : '0',
      subtext: stats ? `${stats.occupiedRooms} occupées` : '0 occupées',
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
        </svg>
      ),
      bg: 'bg-blue-50',
    },
    {
      title: 'Réservations',
      value: stats ? stats.activeReservations.toString() : '0',
      subtext: 'Actives et validées',
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'bg-emerald-50',
    },
    {
      title: 'Revenus (Mois)',
      value: stats ? `${stats.monthlyRevenue.toLocaleString('fr-FR')} €` : '0 €',
      subtext: 'Chiffre d\'affaires',
      icon: (
        <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-violet-50',
    },
    {
      title: "Occupation",
      value: stats ? `${stats.occupancyRate} %` : '0 %',
      subtext: 'Taux de remplissage',
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      
      {/* Overlay sombre pour mobile quand le menu est ouvert */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Barre latérale responsive : 
          - Cachée (translate-x-full) sur mobile par défaut 
          - Toujours visible (translate-x-0) sur desktop (lg)
      */}
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

        <nav className="flex-1 space-y-2 px-4 py-8 text-sm font-medium overflow-y-auto custom-scrollbar">
          <a href="/admin/dashboard" className="flex items-center space-x-3 rounded-2xl bg-blue-600 px-4 py-3.5 text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Tableau de bord</span>
          </a>
          <a href="/admin/chambres" className="flex items-center space-x-3 rounded-2xl px-4 py-3.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4" />
            </svg>
            <span>Chambres</span>
          </a>
          <a href="/admin/reservations" className="flex items-center space-x-3 rounded-2xl px-4 py-3.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all">
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

        {/* Zone de contenu */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Vue d'ensemble</h1>
            <p className="text-sm text-slate-500 mt-1">Gérez l'activité de votre hôtel en temps réel.</p>
          </header>

          {error && (
            <div className="mb-6 sm:mb-8 rounded-2xl bg-red-50 p-4 border border-red-100 text-sm text-red-600 flex items-center shadow-sm">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Grille responsive : 1 colonne (mobile) -> 2 col (tablette) -> 4 col (PC) */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-10">
            {statCards.map((stat, idx) => (
              <div key={idx} className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`rounded-2xl p-3 ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>{stat.icon}</div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-700 mt-1">{stat.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tableau des réservations (avec défilement horizontal sur mobile) */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-50 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Dernières Réservations</h2>
                <p className="text-xs text-slate-500 mt-1">Les transactions les plus récentes de l'établissement.</p>
              </div>
              <a href="/admin/reservations" className="text-sm font-semibold text-blue-600 hover:text-blue-700 self-start sm:self-auto">Voir tout &rarr;</a>
            </div>

            {/* Wrapper overflow-x-auto essentiel pour mobile */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
                <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                  <tr>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap">Client & Réf</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap">Chambre</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap">Période</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap">Montant</th>
                    <th className="px-4 sm:px-8 py-3 sm:py-4 whitespace-nowrap">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-8 py-12 text-center text-slate-400">
                        Aucune réservation récente.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <p className="font-bold text-slate-900 whitespace-nowrap">{booking.user?.name || booking.user?.email || 'Inconnu'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">#{booking.id.slice(0, 8)}</p>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <div className="flex items-center whitespace-nowrap">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 flex-shrink-0">
                              {booking.room?.number || '-'}
                            </div>
                            <span className="font-medium">{booking.room?.type || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5 text-slate-500 whitespace-nowrap">
                          {new Date(booking.checkIn).toLocaleDateString('fr-FR')} &rarr; {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5 font-bold text-slate-900 whitespace-nowrap">{booking.totalPrice} €</td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-bold ${
                            booking.payment?.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                            booking.payment?.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                              booking.payment?.status === 'PAID' ? 'bg-emerald-500' :
                              booking.payment?.status === 'PENDING' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}></span>
                            {booking.payment?.status === 'PAID' ? 'PAYÉ' : booking.payment?.status === 'PENDING' ? 'EN ATTENTE' : 'NON PAYÉ'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}