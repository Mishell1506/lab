'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthGuard from './AuthGuard';

export default function Navbar({ showLogout = false }) {
  const pathname = usePathname();

  const links = [
    { href: '/home', label: 'Inicio', key: 'home' },
    { href: '/registro', label: 'Registrar Ticket', key: 'registro' },
    { href: '/listado', label: 'Ver Tickets', key: 'listado' },
    { href: '/buscar', label: 'Buscar', key: 'buscar' },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    
    // Wipe all local storage completely
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all service worker caches if any
    if (typeof caches !== 'undefined') {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      } catch (err) {}
    }
    
    // Use replace instead of href to overwrite the current history entry
    window.location.replace('/api/auth/logout');
  };

  return (
    <>
      <AuthGuard />
      <nav className="app-navbar">
        <div className="navbar-container">
          <div className="nav-logo">
            <span className="nav-logo-text">SoporteApp</span>
          </div>
          <div className="nav-links">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
            {showLogout && (
              <a href="/api/auth/logout" onClick={handleLogout} className="nav-link btn-nav-logout">
                <span>Salir</span>
              </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
