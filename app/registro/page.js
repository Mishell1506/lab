'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import Navbar from '@/components/Navbar';

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const category = formData.get('category');
    const priority = formData.get('priority');
    const description = formData.get('description');

    if (!title || !category || !priority) {
      setError('Título, categoría y prioridad son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, priority, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/');
          return;
        }
        setError(data.error || 'Error al registrar el ticket');
        setLoading(false);
        return;
      }

      setSuccess('Ticket registrado exitosamente');
      setLoading(false);
      e.target.reset();
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <BackgroundBlobs />
      <Navbar showLogout={true} />

      <div className="dashboard-container">
        <div className="page-title-section">
          <h1 className="page-title">Registrar Nuevo Ticket</h1>
          <p className="page-subtitle">Describe tu problema técnico o consulta para recibir soporte</p>
        </div>

        {error && (
          <div className="auth-alert alert-danger">
            <span className="alert-message">{error}</span>
          </div>
        )}
        {success && (
          <div className="auth-alert alert-success">
            <span className="alert-message">{success}</span>
          </div>
        )}

        <section className="form-card">
          <form onSubmit={handleSubmit} className="pet-register-form">
            <div className="form-group">
              <label htmlFor="ticketTitle">Asunto / Título de la Incidencia</label>
              <div className="input-container">
                <input
                  type="text"
                  id="ticketTitle"
                  name="title"
                  placeholder="Ej: No puedo iniciar sesión, Error de base de datos..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label htmlFor="ticketCategory">Categoría</label>
                <div className="input-container">
                  <select id="ticketCategory" name="category" required className="select-field" defaultValue="">
                    <option value="" disabled>Selecciona categoría</option>
                    <option value="Soporte Técnico">Soporte Técnico</option>
                    <option value="Facturación">Facturación</option>
                    <option value="Consultas">Consultas</option>
                    <option value="Cuentas y Acceso">Cuentas y Acceso</option>
                  </select>
                </div>
              </div>

              <div className="form-group col-half">
                <label htmlFor="ticketPriority">Prioridad</label>
                <div className="input-container">
                  <select id="ticketPriority" name="priority" required className="select-field" defaultValue="">
                    <option value="" disabled>Selecciona prioridad</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ticketDescription">Detalle / Descripción</label>
              <div className="input-container-textarea">
                <textarea
                  id="ticketDescription"
                  name="description"
                  placeholder="Escribe detalles del problema que estás experimentando..."
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Ticket'}
              {!loading && (
                <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
