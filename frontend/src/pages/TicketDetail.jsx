import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import AuthService from '../services/AuthService.js';
import { StatusBadge, PriorityBadge, Spinner, Toast } from '../components/ui.jsx';

const statusTransitions = {
  OPEN: ['ASSIGNED'],
  ASSIGNED: ['IN_PROGRESS', 'ASSIGNED'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['CLOSED', 'ASSIGNED'],
  CLOSED: ['ASSIGNED'],
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showResolutionInput, setShowResolutionInput] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const currentUser = AuthService.getCurrentUser();
  const isAdminOrAgent = currentUser?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_AGENT');
  const isAdmin = currentUser?.roles?.some(r => r === 'ROLE_ADMIN');

  useEffect(() => {
    ticketService.getById(id)
      .then(res => {
        setTicket(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setError('Ticket not found');
        } else {
          setError('Failed to load ticket');
        }
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'RESOLVED' && ticket.status === 'IN_PROGRESS') {
      setShowResolutionInput(true);
      return;
    }

    setStatusUpdating(true);
    try {
      const res = await ticketService.updateStatus(id, newStatus);
      setTicket(res.data);
      setToast({ message: `Status updated to ${newStatus.replace('_', ' ')}`, type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status';
      setToast({ message: msg, type: 'error' });
    }
    setStatusUpdating(false);
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      setToast({ message: 'Resolution notes are required', type: 'error' });
      return;
    }
    setStatusUpdating(true);
    try {
      const res = await ticketService.updateStatus(id, 'RESOLVED', resolutionNotes);
      setTicket(res.data);
      setShowResolutionInput(false);
      setResolutionNotes('');
      setToast({ message: 'Ticket resolved', type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resolve ticket';
      setToast({ message: msg, type: 'error' });
    }
    setStatusUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }
    setStatusUpdating(true);
    try {
      await ticketService.delete(id);
      navigate('/tickets');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete ticket';
      setToast({ message: msg, type: 'error' });
      setStatusUpdating(false);
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-extrabold text-xl mb-4 bg-red-100 border-2 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{error}</p>
        <br/>
        <Link to="/tickets" className="text-black font-extrabold uppercase hover:underline">← Back to tickets</Link>
      </div>
    );
  }

  const availableTransitions = statusTransitions[ticket.status] || [];

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-black mb-6 font-bold uppercase tracking-wider animate-slide-up">
        <Link to="/tickets" className="hover:underline">Tickets</Link>
        <span>/</span>
        <span className="text-accent-500 font-extrabold">#{ticket.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-black tracking-tight">{ticket.title}</h1>
                <p className="text-black text-sm mt-1.5 font-mono font-bold uppercase">Ticket #{ticket.id}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/tickets/${ticket.id}/edit`}
                  className="text-sm text-black bg-white hover:bg-gray-100 font-extrabold uppercase px-4 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                >
                  Edit
                </Link>
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    disabled={statusUpdating}
                    className="text-sm text-white bg-red-500 hover:bg-red-400 font-extrabold uppercase px-4 py-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-sm font-extrabold text-black uppercase tracking-widest mb-3 border-b-2 border-black pb-2">Description</h3>
              <p className="text-black whitespace-pre-wrap leading-relaxed font-bold">{ticket.description}</p>
            </div>

            {ticket.resolutionNotes && (
              <div className="mt-8 p-5 bg-green-200 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-sm font-extrabold text-black uppercase tracking-widest mb-2">Resolution Notes</h3>
                <p className="text-black text-sm whitespace-pre-wrap font-bold">{ticket.resolutionNotes}</p>
              </div>
            )}
          </div>

          {/* Status Actions */}
          {isAdminOrAgent && (
          <div className="bg-white rounded-xl border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h3 className="text-sm font-extrabold text-black uppercase tracking-widest mb-5 border-b-2 border-black pb-2">Update Status</h3>

            {showResolutionInput ? (
              <div className="space-y-4 animate-fade-in">
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter resolution notes (required)..."
                  className="w-full px-4 py-3 border-2 border-black rounded font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none bg-white text-black transition-all"
                  rows={4}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleResolve}
                    disabled={statusUpdating}
                    className="bg-green-500 hover:bg-green-400 text-white px-5 py-2.5 rounded border-2 border-black font-extrabold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1 disabled:opacity-50"
                  >
                    {statusUpdating ? 'Updating...' : 'Confirm Resolve'}
                  </button>
                  <button
                    onClick={() => { setShowResolutionInput(false); setResolutionNotes(''); }}
                    className="bg-white hover:bg-gray-100 text-black px-5 py-2.5 rounded border-2 border-black font-extrabold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : availableTransitions.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {availableTransitions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusUpdating}
                    className="bg-white hover:bg-accent-500 text-black hover:text-white border-2 border-black px-5 py-2.5 rounded font-extrabold uppercase transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
                  >
                    {statusUpdating ? '...' : `Move to ${status.replace('_', ' ')}`}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-black text-sm font-bold bg-gray-100 p-3 border-2 border-black rounded inline-block">No status transitions available</p>
            )}
          </div>
          )}
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-extrabold text-black uppercase tracking-widest mb-5 border-b-2 border-black pb-2">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Status</label>
                <StatusBadge status={ticket.status} />
              </div>
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Priority</label>
                {ticket.priority ? <PriorityBadge priority={ticket.priority} /> : <span className="text-black text-sm font-bold">—</span>}
              </div>
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Category</label>
                <span className="text-sm text-black font-bold bg-gray-100 px-2 py-1 border-2 border-black rounded inline-block">{ticket.category}</span>
              </div>
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Created By</label>
                <span className="text-sm text-black font-bold">{ticket.createdBy ? `User #${ticket.createdBy}` : '—'}</span>
              </div>
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Assigned To</label>
                <span className="text-sm text-black font-bold">{ticket.assignedTo ? `User #${ticket.assignedTo}` : '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up" style={{ animationDelay: '250ms' }}>
            <h3 className="text-sm font-extrabold text-black uppercase tracking-widest mb-5 border-b-2 border-black pb-2">Timestamps</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Created</label>
                <span className="text-sm text-black font-bold">{ticket.createdDate ? new Date(ticket.createdDate).toLocaleString() : '—'}</span>
              </div>
              <div>
                <label className="text-xs font-extrabold text-black block mb-1 uppercase tracking-wider">Last Updated</label>
                <span className="text-sm text-black font-bold">{ticket.updatedDate ? new Date(ticket.updatedDate).toLocaleString() : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
