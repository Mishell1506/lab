export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Inicio · SoporteApp',
  description: 'Página de inicio de SoporteApp',
};

export default async function HomePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="dashboard-page">
      <BackgroundBlobs />
      <Navbar showLogout={false} />

      <div className="dashboard-container">
        <div className="user-minimal-card">
          <div className="user-minimal-details">
            <span className="user-minimal-label">Usuario Conectado</span>
            <h2 className="user-minimal-username">{user.username}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
