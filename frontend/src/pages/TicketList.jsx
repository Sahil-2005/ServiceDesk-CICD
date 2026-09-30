import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import AuthService from '../services/AuthService.js';
import { StatusBadge, PriorityBadge, Spinner, EmptyState } from '../components/ui.jsx';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');

  const currentUser = AuthService.getCurrentUser();
  const isAdminOrAgent = currentUser?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_AGENT');

  const fetchTickets = () => {
    setLoading(true);
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;

    ticketService.getAll(params)
      .then(res => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tickets');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (keyword.trim()) params.keyword = keyword.trim();
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    setSearchParams(params);
    fetchTickets();
  };

  const clearFilters = () => {
    setKeyword('');
    setStatusFilter('');
    setCategoryFilter('');
    setSearchParams({});
  };

  if (error) {
    return (
      <div className="bg-red-200 border-2 border-black text-black font-bold px-4 py-3 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{error}</div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-5 animate-slide-up">
        <div>
          <h1 className="text-4xl font-extrabold text-black uppercase tracking-tight">Tickets</h1>
          <p className="text-black mt-2 font-bold border-l-4 border-black pl-3">{isAdminOrAgent ? 'Manage and track IT support tickets' : 'Manage and track your support tickets'}</p>
        </div>
        <Link
          to="/tickets/new"
          className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white px-5 py-3 border-[3px] border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          NEW TICKET
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search tickets..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-md font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black placeholder-gray-500 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-black rounded-md font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-black transition-all"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md font-bold transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-none active:translate-y-1 active:translate-x-1"
          >
            Search
          </button>
          {(keyword || statusFilter || categoryFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-black bg-white hover:bg-gray-100 px-5 py-3 rounded-md font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-none active:translate-y-1 active:translate-x-1 transition-all"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Ticket Table */}
      {loading ? (
        <Spinner />
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          message={keyword || statusFilter ? "Try adjusting your search or filters" : "Create your first ticket to get started"}
          action={
            !keyword && !statusFilter && (
              <Link to="/tickets/new" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white px-5 py-3 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold transition-all hover:translate-y-[-2px] hover:translate-x-[-2px] active:translate-y-1 active:translate-x-1 active:shadow-none">
                Create Ticket
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-yellow-100 text-left border-b-[3px] border-black">
                  <th className="px-6 py-4 font-extrabold text-black uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 font-extrabold text-black uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 font-extrabold text-black uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 font-extrabold text-black uppercase tracking-wider hidden sm:table-cell">Priority</th>
                  <th className="px-6 py-4 font-extrabold text-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-extrabold text-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-100 transition-colors group">
                    <td className="px-6 py-4 text-black font-mono text-sm font-bold">#{ticket.id}</td>
                    <td className="px-6 py-4">
                      <Link to={`/tickets/${ticket.id}`} className="text-black font-extrabold text-base hover:text-accent-500 hover:underline transition-colors">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-black font-semibold hidden md:table-cell">{ticket.category}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {ticket.priority && <PriorityBadge priority={ticket.priority} />}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-white bg-black hover:bg-gray-800 font-bold text-xs uppercase px-3 py-2 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 active:translate-x-0.5 opacity-0 group-hover:opacity-100 transition-all inline-block"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t-[3px] border-black bg-gray-100 text-xs font-bold tracking-widest text-black uppercase">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
