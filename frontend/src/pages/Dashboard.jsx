import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import AuthService from '../services/AuthService.js';
import { StatusBadge, Spinner } from '../components/ui.jsx';

const statusOrder = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const cardConfig = {
  OPEN: { bg: 'bg-blue-100', icon: '📋' },
  ASSIGNED: { bg: 'bg-amber-100', icon: '👤' },
  IN_PROGRESS: { bg: 'bg-purple-100', icon: '⚙️' },
  RESOLVED: { bg: 'bg-green-100', icon: '✅' },
  CLOSED: { bg: 'bg-gray-200', icon: '🔒' },
};

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = AuthService.getCurrentUser();
  const isAdminOrAgent = currentUser?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_AGENT');

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
      <div className="bg-red-100 border-2 border-black text-black font-bold px-4 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-black font-bold mt-2 border-l-4 border-black pl-3">{isAdminOrAgent ? 'Overview of IT service desk tickets' : 'Overview of your support tickets'}</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
        {statusOrder.map((status, index) => {
          const config = cardConfig[status];
          return (
            <Link
              key={status}
              to={`/tickets?status=${status}`}
              className={`group relative overflow-hidden rounded-xl border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 animate-slide-up ${config.bg}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-3xl mb-3">{config.icon}</div>
              <p className="text-4xl font-extrabold text-black tracking-tight">{counts[status]}</p>
              <p className="text-sm font-bold text-black mt-1 uppercase">{status.replace('_', ' ')}</p>
            </Link>
          );
        })}
      </div>

      {/* Total */}
      <div className="relative overflow-hidden bg-accent-500 border-[3px] border-black rounded-xl p-8 mb-10 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up" style={{ animationDelay: '250ms' }}>
        <div className="relative flex items-center justify-between z-10">
          <div>
            <p className="text-white text-sm font-bold tracking-widest uppercase">Total Tickets</p>
            <p className="text-6xl font-extrabold mt-2 tracking-tight">{tickets.length}</p>
          </div>
          <Link
            to="/tickets/new"
            className="bg-white hover:bg-gray-100 text-black px-6 py-3 border-[3px] border-black rounded-lg text-sm font-bold transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1"
          >
            + New Ticket
          </Link>
        </div>
      </div>

      {/* Recent tickets table */}
      <div className="bg-white rounded-xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="px-6 py-5 border-b-[3px] border-black flex items-center justify-between bg-yellow-100">
          <h2 className="text-xl font-extrabold text-black uppercase">Recent Tickets</h2>
          <Link to="/tickets" className="text-sm text-black border-2 border-black bg-white px-3 py-1 rounded font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-transform">
            View all &rarr;
          </Link>
        </div>
        {recentTickets.length === 0 ? (
          <div className="p-8 text-center text-black font-bold">No tickets yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left border-b-2 border-black">
                  <th className="px-6 py-4 font-bold text-black uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 font-bold text-black uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 font-bold text-black uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold text-black uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {recentTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-black font-mono font-bold">#{ticket.id}</td>
                    <td className="px-6 py-4">
                      <Link to={`/tickets/${ticket.id}`} className="text-black font-bold hover:text-accent-500 hover:underline transition-colors text-base">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-black font-semibold">{ticket.category}</td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
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
