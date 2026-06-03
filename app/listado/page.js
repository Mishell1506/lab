export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import supabase from '@/lib/supabase';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import Navbar from '@/components/Navbar';
import TicketCard from '@/components/TicketCard';

export const metadata = {
  title: 'Ver Tickets · SoporteApp',
  description: 'Listado de tickets de soporte',
};

export default async function ListadoPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/');
  }

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const ticketList = tickets || [];

  return (
    <div className="dashboard-page">
      <BackgroundBlobs />
      <Navbar showLogout={false} />

      <div className="dashboard-container">
        <div className="page-title-section">
          <h1 className="page-title">Tickets de Soporte Registrados</h1>
          <p className="page-subtitle">Listado completo de incidencias y consultas enviadas</p>
        </div>

        <section className="pets-list-section">
          <div className="pets-grid" id="ticketsGrid">
            {ticketList.length === 0 ? (
              <div className="empty-state">
                <p>No tienes tickets de soporte registrados aún</p>
                <span>Ve a la sección &quot;Registrar Ticket&quot; para crear uno nuevo</span>
              </div>
            ) : (
              ticketList.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
