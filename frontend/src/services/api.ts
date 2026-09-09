const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  async getRooms() {
    const res = await fetch(`${API_URL}/rooms`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur de chargement des chambres');
    return res.json();
  },

  async createRoom(data: { number: string; type: string; pricePerNight: number }) {
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur lors de la création de la chambre');
    return res.json();
  },

  async getBookings() {
    const res = await fetch(`${API_URL}/bookings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erreur de chargement des réservations');
    return res.json();
  },
};