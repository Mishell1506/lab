'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundBlobs from '@/components/BackgroundBlobs';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Trap back button if user just logged out
  useEffect(() => {
    if (sessionStorage.getItem('loggedOut') === 'true') {
      // Push a dummy state so the back button just goes to this same page
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = () => {
        // When they press back, push it forward again to trap them on the login page
        window.history.pushState(null, '', window.location.href);
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      sessionStorage.removeItem('loggedOut');
      router.push('/home');
      router.refresh();
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if (!username || !password || !passwordConfirm) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, passwordConfirm }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar usuario');
        setLoading(false);
        return;
      }

      setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      setActiveTab('login');
      setLoading(false);
      e.target.reset();
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <BackgroundBlobs />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <h1>Gestor de Tickets</h1>
            </div>
            <p className="auth-subtitle">Accede o crea una cuenta para gestionar incidencias</p>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Registrarse
            </button>
          </div>

          {/* Alerts */}
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

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className={`auth-form ${activeTab === 'login' ? 'active' : ''}`}
          >
            <div className="form-group">
              <label htmlFor="loginUsername">Usuario</label>
              <div className="input-container">
                <input
                  type="text"
                  id="loginUsername"
                  name="username"
                  placeholder="Ingresa tu usuario"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Contraseña</label>
              <div className="input-container">
                <input
                  type="password"
                  id="loginPassword"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
              {!loading && (
                <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </form>

          {/* Register Form */}
          <form
            onSubmit={handleRegister}
            className={`auth-form ${activeTab === 'register' ? 'active' : ''}`}
          >
            <div className="form-group">
              <label htmlFor="registerUsername">Usuario</label>
              <div className="input-container">
                <input
                  type="text"
                  id="registerUsername"
                  name="username"
                  placeholder="Elige un nombre de usuario"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registerPassword">Contraseña</label>
              <div className="input-container">
                <input
                  type="password"
                  id="registerPassword"
                  name="password"
                  placeholder="Crea una contraseña segura"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registerPasswordConfirm">Confirmar Contraseña</label>
              <div className="input-container">
                <input
                  type="password"
                  id="registerPasswordConfirm"
                  name="passwordConfirm"
                  placeholder="Repite la contraseña"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              {!loading && (
                <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </form>
        </div>

        <footer className="app-footer">
          <p>Next.js + Supabase &mdash; <span className="footer-highlight">PostgreSQL</span></p>
        </footer>
      </div>
    </div>
  );
}
