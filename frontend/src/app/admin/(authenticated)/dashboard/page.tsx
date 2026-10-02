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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

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

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full">
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

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          Chargement des données en cours...
        </div>
      ) : (
        <>
          {/* Grille de statistiques */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-10">
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stats?.totalRooms ?? 0}</h3>
                <p className="text-sm font-bold text-slate-700 mt-1">Chambres</p>
                <p className="text-xs text-slate-400 mt-1">{stats?.occupiedRooms ?? 0} occupées</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stats?.activeReservations ?? 0}</h3>
                <p className="text-sm font-bold text-slate-700 mt-1">Réservations</p>
                <p className="text-xs text-slate-400 mt-1">Actives et validées</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stats?.monthlyRevenue?.toLocaleString('fr-FR') ?? 0} €</h3>
                <p className="text-sm font-bold text-slate-700 mt-1">Revenus (Mois)</p>
                <p className="text-xs text-slate-400 mt-1">Chiffre d'affaires</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stats?.occupancyRate ?? 0} %</h3>
                <p className="text-sm font-bold text-slate-700 mt-1">Occupation</p>
                <p className="text-xs text-slate-400 mt-1">Taux de remplissage</p>
              </div>
            </div>
          </div>

          {/* Tableau des réservations récentes */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-50 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Dernières Réservations</h2>
                <p className="text-xs text-slate-500 mt-1">Les transactions les plus récentes de l'établissement.</p>
              </div>
            </div>

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
        </>
      )}
    </div>
  );
}