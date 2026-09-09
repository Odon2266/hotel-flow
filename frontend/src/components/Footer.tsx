import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Colonne 1 : Brand & Présentation */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              HF
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Hôtel <span className="text-blue-500">Flow</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Plateforme complète de réservation hôtelière. Réservez vos chambres, activités et services sur mesure en toute simplicité.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-blue-400 font-medium">
              Paiement Sécurisé
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-medium">
              SSL 256-bit
            </span>
          </div>
        </div>

        {/* Colonne 2 : Navigation Rapide */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#chambres" className="hover:text-blue-400 transition">
                Nos Chambres & Suites
              </a>
            </li>
            <li>
              <a href="#offres" className="hover:text-blue-400 transition">
                Offres Commerciales
              </a>
            </li>
            <li>
              <a href="#activites" className="hover:text-blue-400 transition">
                Activités & Excursions
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-400 transition">
                Services & Restauration
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Contact & Info Hôtel */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              123 Avenue de l'Hôtel, Saint-Denis
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h32a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18M3 18h18" />
              </svg>
              +261 34 00 000 00
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@hotelflow.com
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Moyens de Paiement Stripe */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
            Paiement en ligne
          </h4>
          <p className="text-xs text-slate-400">
            Toutes les transactions sont sécurisées et traitées directement via Stripe Checkout.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <div className="px-3 py-1.5 bg-slate-800 rounded border border-slate-700 text-xs font-bold text-slate-200">
              Stripe
            </div>
            <div className="px-3 py-1.5 bg-slate-800 rounded border border-slate-700 text-xs font-bold text-slate-200">
              VISA
            </div>
            <div className="px-3 py-1.5 bg-slate-800 rounded border border-slate-700 text-xs font-bold text-slate-200">
              Mastercard
            </div>
          </div>
        </div>

      </div>

      {/* Barre inférieure de Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 Hôtel Flow. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition">Mentions Légales</a>
          <a href="#" className="hover:text-slate-300 transition">Politique de Confidentialité</a>
          <a href="#" className="hover:text-slate-300 transition">CGV / CGU</a>
        </div>
      </div>
    </footer>
  );
}