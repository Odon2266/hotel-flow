'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Footer from '@/components/Footer';

interface Room {
  id: string;
  number: string;
  type: string;
  pricePerNight?: number;
  price?: number;
  imageUrl?: string;
  status?: string;
  isAvailable?: boolean;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'chambres' | 'offres' | 'activites' | 'services'>('chambres');

  const fetchRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (err) {
      console.error('Erreur lors du chargement des chambres', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* En-tête Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
              HF
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Hôtel <span className="text-blue-600">Flow</span>
            </span>
          </div>

          {/* Navigation Principale */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => setActiveTab('chambres')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === 'chambres' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chambres
            </button>
            <button
              onClick={() => setActiveTab('offres')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === 'offres' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Offres Tarifaires
            </button>
            <button
              onClick={() => setActiveTab('activites')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === 'activites' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Activités
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === 'services' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Services
            </button>
          </nav>

          {/* Actions Utilisateur (Profil) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-blue-600 flex items-center justify-center font-bold text-slate-700 shadow-sm">
              OF
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section & Recherche */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Réservez votre séjour sur mesure
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Découvrez nos chambres, profitez d'activités exclusives et sélectionnez vos services en ligne.
          </p>

          {/* Barre de Recherche */}
          <div className="pt-6">
            <div className="bg-white p-3 rounded-2xl shadow-2xl text-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 border border-slate-100">
              <div className="p-3 text-left border-r border-slate-100">
                <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">Arrivée - Départ</label>
                <input type="date" className="w-full text-sm font-semibold focus:outline-none mt-1 text-slate-700" />
              </div>
              <div className="p-3 text-left border-r border-slate-100">
                <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">Voyageurs</label>
                <select className="w-full text-sm font-semibold focus:outline-none mt-1 bg-transparent text-slate-700">
                  <option>1 Adulte</option>
                  <option>2 Adultes</option>
                  <option>2 Adultes + Enfants</option>
                  <option>Famille (4+)</option>
                </select>
              </div>
              <div className="p-3 text-left border-r border-slate-100">
                <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">Type de chambre</label>
                <select className="w-full text-sm font-semibold focus:outline-none mt-1 bg-transparent text-slate-700">
                  <option>Toutes les catégories</option>
                  <option>Chambre Simple</option>
                  <option>Chambre Double</option>
                  <option>Suite VIP</option>
                </select>
              </div>
              <div className="flex items-center justify-center p-1">
                <button className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition py-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zone de Contenu Principal */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Section Chambres */}
        {activeTab === 'chambres' && (
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Nos Chambres & Suites</h2>
                <p className="text-slate-500 text-sm">Sélectionnez la chambre adaptée à vos besoins</p>
              </div>
              <span className="text-sm font-semibold text-blue-600">{rooms.length} hébergement(s) disponible(s)</span>
            </div>

            {/* Grille de Cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => {
                const price = room.pricePerNight ?? room.price ?? 0;
                const isAvailable = room.status === 'AVAILABLE' || room.isAvailable === true;
                const imageUrl = room.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

                return (
                  <div key={room.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col justify-between">
                    
                    {/* Photo de la chambre */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Chambre ${room.number}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}>
                          {isAvailable ? 'Disponible' : 'Occupée'}
                        </span>
                      </div>
                      <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                        {room.type}
                      </div>
                    </div>

                    {/* Contenu Carte */}
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Chambre n°{room.number}</h3>
                          <p className="text-sm font-semibold text-blue-600 mt-0.5">{room.type}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900">{price} $</span>
                          <span className="text-xs text-slate-400 block">/ nuit</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                        Wi-Fi Haut Débit • Lit King Size • Climatisation • Room Service
                      </p>

                      <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                        Réserver cette chambre
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {rooms.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">Aucune chambre disponible pour le moment.</p>
              </div>
            )}
          </section>
        )}

        {/* Section Offres Tarifaires */}
        {activeTab === 'offres' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Formules & Offres Commerciales</h2>
              <p className="text-slate-500 text-sm">Définies selon le cahier des charges Hotel Flow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Basic', tag: 'Économique', desc: 'Chambre standard, Wi-Fi, prestations essentielles.', color: 'border-slate-200' },
                { title: 'Medium', tag: 'Confort', desc: 'Chambre confortable, petit déjeuner, accès piscine.', color: 'border-blue-300 bg-blue-50/30' },
                { title: 'Premium', tag: 'Haut de gamme', desc: 'Suite Premium, spa inclus et service prioritaire.', color: 'border-blue-500' },
                { title: 'VIP', tag: 'Prestige', desc: 'Suite VIP, accueil personnalisé, transport & spa.', color: 'border-blue-700 bg-blue-900 text-white' },
              ].map((offre, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border ${offre.color} shadow-sm space-y-4 flex flex-col justify-between`}>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{offre.tag}</span>
                    <h3 className="text-2xl font-black mt-1">{offre.title}</h3>
                    <p className="text-sm opacity-80 mt-2">{offre.desc}</p>
                  </div>
                  <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-sm">
                    Découvrir la formule
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Activités */}
        {activeTab === 'activites' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Activités & Loisirs</h2>
              <p className="text-slate-500 text-sm">Profitez de nos excursions et activités sur place</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center py-16">
              <p className="text-slate-500 font-medium">Les activités disponibles seront affichées ici prochainement.</p>
            </div>
          </section>
        )}

        {/* Section Services */}
        {activeTab === 'services' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Services de l'Hôtel</h2>
              <p className="text-slate-500 text-sm">Spa, restauration, navette et bien plus encore</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center py-16">
              <p className="text-slate-500 font-medium">Les services de l'hôtel seront affichés ici prochainement.</p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}