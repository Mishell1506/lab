export default function TicketCard({ ticket }) {
  const priorityClass = ticket.priority
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const formattedDate = new Date(ticket.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="pet-card">
      <div className="pet-card-header">
        <div className="pet-card-title-details">
          <h3 className="pet-card-name">{ticket.title}</h3>
          <span className="pet-card-species">{ticket.category}</span>
        </div>
        <span className={`ticket-priority-badge badge-${priorityClass}`}>
          {ticket.priority}
        </span>
      </div>
      <div className="pet-card-body">
        {ticket.description && (
          <p className="ticket-card-desc">{ticket.description}</p>
        )}
        <div
          className="pet-detail-item"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '4px' }}
        >
          <span className="detail-label">Registrado:</span>
          <span className="detail-value">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
