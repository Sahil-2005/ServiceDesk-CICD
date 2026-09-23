import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import { StatusBadge, Spinner } from '../components/ui.jsx';

const statusOrder = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const cardConfig = {
  OPEN: { gradient: 'from-blue-500 to-blue-600', icon: '📋' },
  ASSIGNED: { gradient: 'from-amber-500 to-amber-600', icon: '👤' },
  IN_PROGRESS: { gradient: 'from-purple-500 to-purple-600', icon: '⚙️' },
  RESOLVED: { gradient: 'from-green-500 to-green-600', icon: '✅' },
  CLOSED: { gradient: 'from-gray-500 to-gray-600', icon: '🔒' },
};

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ticketService.getAll()
      .then(res => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load tickets');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const counts = {};
  statusOrder.forEach(s => counts[s] = 0);
  tickets.forEach(t => {
    if (counts[t.status] !== undefined) counts[t.status]++;
  });

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of IT service desk tickets</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statusOrder.map(status => {
          const config = cardConfig[status];
          return (
            <Link
              key={status}
              to={`/tickets?status=${status}`}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${config.gradient}`} />
              <div className="text-2xl mb-2">{config.icon}</div>
              <p className="text-3xl font-bold text-gray-900">{counts[status]}</p>
              <p className="text-sm text-gray-500 mt-1 capitalize">{status.replace('_', ' ').toLowerCase()}</p>
            </Link>
          );
        })}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Total Tickets</p>
            <p className="text-4xl font-bold mt-1">{tickets.length}</p>
          </div>
          <Link
            to="/tickets/new"
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            + New Ticket
          </Link>
        </div>
      </div>

      {/* Recent tickets table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
          <Link to="/tickets" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all →
          </Link>
        </div>
        {recentTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tickets yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Category</th>
                  <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">#{ticket.id}</td>
                    <td className="px-6 py-3">
                      <Link to={`/tickets/${ticket.id}`} className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{ticket.category}</td>
                    <td className="px-6 py-3"><StatusBadge status={ticket.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
