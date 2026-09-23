import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import { StatusBadge, PriorityBadge, Spinner, EmptyState } from '../components/ui.jsx';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');

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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and track IT support tickets</p>
        </div>
        <Link
          to="/tickets/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Ticket
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search tickets..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Search
          </button>
          {(keyword || statusFilter || categoryFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 px-3 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
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
              <Link to="/tickets/new" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Create Ticket
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-200">
                  <th className="px-6 py-3.5 font-semibold text-gray-600">ID</th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Priority</th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{ticket.id}</td>
                    <td className="px-6 py-4">
                      <Link to={`/tickets/${ticket.id}`} className="text-gray-900 font-medium hover:text-indigo-600 transition-colors">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{ticket.category}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {ticket.priority && <PriorityBadge priority={ticket.priority} />}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-xs"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
