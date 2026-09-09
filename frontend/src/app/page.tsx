'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Footer from '@/components/Footer';
interface Room {
  id: string;
  number: string;
  type: string;
  pricePerNight: number;
  isAvailable: boolean;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'chambres' | 'offres' | 'activites' | 'services'>('chambres');
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulaire d'ajout
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Chambre Simple');
  const [pricePerNight, setPricePerNight] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || !pricePerNight) return;
    setLoading(true);

    try {
      await api.createRoom({
        number,
        type,
        pricePerNight: Number(pricePerNight),
      });
      setNumber('');
      setPricePerNight('');
      setShowAddModal(false);
      await fetchRooms();
    } catch (err) {
      alert('Erreur lors de la création de la chambre');
    } finally {
      setLoading(false);
    }
  };

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

          {/* Actions Utilisateur */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg text-sm border border-blue-200 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une chambre
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-blue-600 flex items-center justify-center font-bold text-slate-700">
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

          {/* Barre de Recherche Conforme au Cahier des Charges */}
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
              {rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition group">
                  
                  {/* Photo indicative */}
                  <div className="h-52 bg-slate-200 relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80`}
                      alt={room.type}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        room.isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {room.isAvailable ? 'Disponible' : 'Occupée'}
                      </span>
                    </div>
                  </div>

                  {/* Contenu Carte */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Chambre n°{room.number}</h3>
                        <p className="text-sm font-medium text-blue-600">{room.type}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">{room.pricePerNight} €</span>
                        <span className="text-xs text-slate-500 block">/ nuit</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
                      Wi-Fi Haut Débit • Lit King Size • Climatisation • Room Service
                    </p>

                    <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-sm">
                      Réserver cette chambre
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {rooms.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">Aucune chambre trouvée dans la base de données.</p>
              </div>
            )}
          </section>
        )}

        {/* Section Offres Tarifaires Conformes */}
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
                <div key={idx} className={`p-6 rounded-2xl border ${offre.color} shadow-sm space-y-4 flex flex-col justify-between`}>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{offre.tag}</span>
                    <h3 className="text-2xl font-black mt-1">{offre.title}</h3>
                    <p className="text-sm opacity-80 mt-2">{offre.desc}</p>
                  </div>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition">
                    Découvrir la formule
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal de création de chambre */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Ajouter une chambre</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Numéro de chambre</label>
                <input
                  type="text"
                  placeholder="Ex: 102"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type de chambre</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-white"
                >
                  <option value="Chambre Simple">Chambre Simple</option>
                  <option value="Chambre Double">Chambre Double</option>
                  <option value="Chambre Familiale">Chambre Familiale</option>
                  <option value="Suite">Suite</option>
                  <option value="Suite Premium">Suite Premium</option>
                  <option value="Suite VIP">Suite VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prix par nuit (€)</label>
                <input
                  type="number"
                  placeholder="Ex: 120"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
}