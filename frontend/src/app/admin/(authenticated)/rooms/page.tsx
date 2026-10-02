'use client';

import { useState, useEffect } from 'react';

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  imageUrl?: string;
  status: string;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Chambre Double');
  const [pricePerNight, setPricePerNight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/rooms');
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des chambres', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number,
          type,
          pricePerNight: Number(pricePerNight),
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la création de la chambre");
      }

      setNumber('');
      setType('Chambre Double');
      setPricePerNight('');
      setImageUrl('');
      fetchRooms();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8">Gestion des Chambres</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire d'ajout */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Ajouter une chambre</h2>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Numéro</label>
                <input 
                  type="text" 
                  value={number} 
                  onChange={(e) => setNumber(e.target.value)} 
                  required
                  placeholder="Ex: 102"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Type</label>
                <input 
                  type="text" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  required
                  placeholder="Ex: Suite Deluxe"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Prix par nuit ($)</label>
                <input 
                  type="number" 
                  value={pricePerNight} 
                  onChange={(e) => setPricePerNight(e.target.value)} 
                  required
                  placeholder="150"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">URL de la photo</label>
                <input 
                  type="url" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
              >
                Enregistrer la chambre
              </button>
            </form>
          </div>

          {/* Liste des chambres */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Chambres existantes</h2>
            
            {loading ? (
              <p className="text-slate-500">Chargement...</p>
            ) : rooms.length === 0 ? (
              <p className="text-slate-500 bg-white p-6 rounded-3xl border border-slate-100">Aucune chambre enregistrée pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={room.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                        alt={`Chambre ${room.number}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                        {room.type}
                      </div>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">Chambre n°{room.number}</h3>
                        <p className="text-sm font-semibold text-blue-600">{room.price} $ / nuit</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {room.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}