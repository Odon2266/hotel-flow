'use client';

import { useState, useEffect } from 'react';

interface Room {
  id: string;
  number: string;
  type: string;
  price?: number;
  pricePerNight?: number;
  imageUrl?: string;
  status: string;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États du formulaire
  const [editingId, setEditingId] = useState<string | null>(null);
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Chambre Double');
  const [pricePerNight, setPricePerNight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  
  // États pour la modale de suppression
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  // Gestion de l'upload d'image depuis le PC local (conversion en Base64)
  const handleLocalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Préparer le formulaire pour la modification
  const handleEditClick = (room: Room) => {
    setEditingId(room.id);
    setNumber(room.number);
    setType(room.type);
    const roomPrice = room.pricePerNight ?? room.price ?? '';
    setPricePerNight(roomPrice.toString());
    setImageUrl(room.imageUrl || '');
    setStatus(room.status || 'AVAILABLE');
    setError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Annuler la modification
  const handleCancelEdit = () => {
    setEditingId(null);
    setNumber('');
    setType('Chambre Double');
    setPricePerNight('');
    setImageUrl('');
    setStatus('AVAILABLE');
    setError('');
    setSuccessMessage('');
  };

  // Exécuter la suppression après confirmation dans la modale
  const confirmDelete = async () => {
    if (!roomToDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/rooms/${roomToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression de la chambre.');
      }

      setSuccessMessage('Chambre supprimée avec succès !');
      setRoomToDelete(null);
      fetchRooms();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la suppression');
      setRoomToDelete(null);
    }
  };

  // Soumission (Création ou Mise à jour)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const url = editingId 
        ? `http://localhost:3001/api/rooms/${editingId}`
        : 'http://localhost:3001/api/rooms';
      
      const method = editingId ? 'PATCH' : 'POST';
      const parsedPrice = Number(pricePerNight);

      // On envoie le statut à chaque fois (AVAILABLE ou OCCUPIED)
      const payload: any = {
        number: number.trim(),
        type: type.trim(),
        pricePerNight: parsedPrice,
        imageUrl: imageUrl.trim() || undefined,
        status: status,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const errorMsg = Array.isArray(errData?.message) 
          ? errData.message.join(', ') 
          : errData?.message || (editingId ? "Erreur lors de la mise à jour." : "Erreur lors de la création.");
        throw new Error(errorMsg);
      }

      setSuccessMessage(editingId ? 'Chambre mise à jour avec succès !' : 'Chambre ajoutée avec succès !');
      handleCancelEdit();
      fetchRooms();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full min-h-screen bg-[#f8fafc] text-slate-800 relative">
      
      {/* Modale de confirmation de suppression */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-5 mx-auto">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Êtes-vous sûr de vouloir supprimer la <span className="font-bold text-slate-800">Chambre n°{roomToDelete.number}</span> ({roomToDelete.type}) ? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setRoomToDelete(null)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Chambres</h1>
          <p className="text-sm text-slate-500 mt-1">Ajoutez, modifiez et visualisez les chambres de votre établissement.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-2 w-fit">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-sm font-bold text-slate-700">{rooms.length} chambre{rooms.length > 1 ? 's' : ''} au total</span>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100 flex items-center shadow-sm">
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-2xl border border-emerald-100 flex items-center shadow-sm">
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulaire */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
              </svg>
              {editingId ? `Modifier n°${number}` : 'Ajouter une chambre'}
            </h2>
            {editingId && (
              <button 
                onClick={handleCancelEdit}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2.5 py-1 bg-slate-100 rounded-xl transition-colors"
              >
                Annuler
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Numéro de chambre</label>
              <input 
                type="text" 
                value={number} 
                onChange={(e) => setNumber(e.target.value)} 
                required
                placeholder="Ex: 102"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Type de chambre</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              >
                <option value="Chambre Simple">Chambre Simple</option>
                <option value="Chambre Double">Chambre Double</option>
                <option value="Suite Deluxe">Suite Deluxe</option>
                <option value="Suite Présidentielle">Suite Présidentielle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Prix par nuit ($)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={pricePerNight} 
                  onChange={(e) => setPricePerNight(e.target.value)} 
                  required
                  placeholder="150"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 pl-8 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <span className="absolute left-3 top-3.5 text-slate-400 font-bold">$</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="OCCUPIED">Occupée</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Photo de la chambre</label>
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-blue-500 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <svg className="w-6 h-6 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-slate-500 font-medium text-center">Cliquez pour choisir une image de votre PC</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleLocalImageChange} className="hidden" />
                </label>
              </div>

              {imageUrl && (
                <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={imageUrl} alt="Aperçu" className="h-full w-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-slate-900/70 hover:bg-red-600 text-white rounded-full p-1.5 text-xs transition-colors"
                    title="Supprimer l'image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] ${
                editingId 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              {editingId ? 'Mettre à jour la chambre' : 'Enregistrer la chambre'}
            </button>
          </form>
        </div>

        {/* Liste des chambres */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Chambres existantes</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-slate-100">
              <div className="flex items-center space-x-3 text-slate-500">
                <svg className="h-6 w-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span className="text-sm font-medium">Chargement des chambres...</span>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4"/></svg>
              </div>
              <p className="font-bold text-slate-700">Aucune chambre enregistrée</p>
              <p className="text-xs text-slate-400 mt-1">Utilisez le formulaire à gauche pour ajouter votre première chambre.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rooms.map((room) => {
                const displayPrice = room.pricePerNight ?? room.price ?? 0;
                const isAvailable = room.status === 'AVAILABLE' || room.status === 'DISPONIBLE';
                return (
                  <div key={room.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                    
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={room.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} 
                        alt={`Chambre ${room.number}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                        {room.type}
                      </div>

                      <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(room)}
                          className="bg-white/95 hover:bg-white text-slate-800 p-2 rounded-xl shadow-md transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setRoomToDelete(room)}
                          className="bg-white/95 hover:bg-white text-slate-800 p-2 rounded-xl shadow-md transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5 flex justify-between items-center bg-white">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">Chambre n°{room.number}</h3>
                        <p className="text-sm font-bold text-blue-600 mt-0.5">{displayPrice} $ <span className="text-xs font-normal text-slate-400">/ nuit</span></p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                          isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {isAvailable ? 'DISPONIBLE' : 'OCCUPÉE'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}