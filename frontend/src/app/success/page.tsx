'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Paiement réussi !</h1>
          <p className="text-slate-500 text-sm">
            Votre réservation a été payée et confirmée avec succès.
          </p>
          {bookingId && (
            <p className="text-xs text-slate-400 font-mono bg-slate-100 p-2 rounded-lg break-all">
              ID : {bookingId}
            </p>
          )}
        </div>

        <Link
          href="/"
          className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm transition shadow-lg shadow-blue-600/20"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}