import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/api.js';
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

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium text-lg mb-4">{error}</p>
        <Link to="/tickets" className="text-indigo-600 hover:text-indigo-700 font-medium">← Back to tickets</Link>
      </div>
    );
  }

  const availableTransitions = statusTransitions[ticket.status] || [];

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/tickets" className="hover:text-indigo-600 transition-colors">Tickets</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">#{ticket.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{ticket.title}</h1>
                <p className="text-gray-400 text-xs mt-1 font-mono">Ticket #{ticket.id}</p>
              </div>
              <Link
                to={`/tickets/${ticket.id}/edit`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Edit
              </Link>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {ticket.resolutionNotes && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-semibold text-green-800 mb-1">Resolution Notes</h3>
                <p className="text-green-700 text-sm whitespace-pre-wrap">{ticket.resolutionNotes}</p>
              </div>
            )}
          </div>

          {/* Status Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Update Status</h3>

            {showResolutionInput ? (
              <div className="space-y-3">
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter resolution notes (required)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleResolve}
                    disabled={statusUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {statusUpdating ? 'Updating...' : 'Confirm Resolve'}
                  </button>
                  <button
                    onClick={() => { setShowResolutionInput(false); setResolutionNotes(''); }}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : availableTransitions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTransitions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusUpdating}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {statusUpdating ? '...' : `Move to ${status.replace('_', ' ')}`}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No status transitions available</p>
            )}
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Details</h3>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Status</label>
              <StatusBadge status={ticket.status} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Priority</label>
              {ticket.priority ? <PriorityBadge priority={ticket.priority} /> : <span className="text-gray-400 text-sm">—</span>}
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category</label>
              <span className="text-sm text-gray-800 font-medium">{ticket.category}</span>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Created By</label>
              <span className="text-sm text-gray-800">{ticket.createdBy ? `User #${ticket.createdBy}` : '—'}</span>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Assigned To</label>
              <span className="text-sm text-gray-800">{ticket.assignedTo ? `User #${ticket.assignedTo}` : '—'}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Timestamps</h3>
            <div>
              <label className="text-xs text-gray-400 block mb-0.5">Created</label>
              <span className="text-sm text-gray-700">{ticket.createdDate ? new Date(ticket.createdDate).toLocaleString() : '—'}</span>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-0.5">Last Updated</label>
              <span className="text-sm text-gray-700">{ticket.updatedDate ? new Date(ticket.updatedDate).toLocaleString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
