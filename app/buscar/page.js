'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import Navbar from '@/components/Navbar';
import TicketCard from '@/components/TicketCard';

export default function BuscarPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [tickets, setTickets] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/tickets/search?q=${encodeURIComponent(q)}`);

      if (res.status === 401) {
        router.push('/');
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setTickets([]);
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-page">
      <BackgroundBlobs />
      <Navbar showLogout={false} />

      <div className="dashboard-container">
        <div className="page-title-section">
          <h1 className="page-title">Buscar Tickets</h1>
          <p className="page-subtitle">Busca incidencias por palabras clave en el asunto o descripción</p>
        </div>

        {/* Search Form */}
        <section className="form-card search-bar-card">
          <form onSubmit={handleSearch} className="pet-register-form">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div className="input-container" style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <input
                  type="text"
                  id="searchQuery"
                  name="q"
                  placeholder="Escribe el término a buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn-auth"
                  style={{ marginTop: 0, padding: '0 20px', width: 'auto', minWidth: '100px' }}
                  disabled={loading}
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Search Results */}
        {searched && (
          <>
            <div className="search-term-display">
              Resultados de búsqueda para: <strong>{query}</strong>
            </div>

            <section className="pets-list-section">
              <div className="pets-grid" id="searchResultsGrid">
                {tickets.length === 0 ? (
                  <div className="empty-state">
                    <p>No se encontraron tickets que coincidan con la búsqueda</p>
                    <span>Intenta con otras palabras clave</span>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
