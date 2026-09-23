import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import { Spinner, Toast, StatusBadge } from '../components/ui.jsx';

export default function TicketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentStatus, setCurrentStatus] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    assignedTo: '',
    resolutionNotes: '',
  });

  useEffect(() => {
    ticketService.getById(id)
      .then(res => {
        const t = res.data;
        setForm({
          title: t.title || '',
          description: t.description || '',
          category: t.category || '',
          priority: t.priority || '',
          assignedTo: t.assignedTo != null ? String(t.assignedTo) : '',
          resolutionNotes: t.resolutionNotes || '',
        });
        setCurrentStatus(t.status);
        setLoading(false);
      })
      .catch(() => {
        setToast({ message: 'Failed to load ticket', type: 'error' });
        setLoading(false);
      });
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        priority: form.priority || null,
        assignedTo: form.assignedTo ? parseInt(form.assignedTo) : null,
        resolutionNotes: form.resolutionNotes.trim() || null,
      };
      // PUT does NOT send status — backend preserves existing status
      await ticketService.update(id, payload);
      navigate(`/tickets/${id}`);
    } catch (err) {
      const serverErrors = err.response?.data;
      if (serverErrors && typeof serverErrors === 'object' && !serverErrors.message) {
        setErrors(serverErrors);
      } else {
        setToast({ message: serverErrors?.message || 'Failed to update ticket', type: 'error' });
      }
    }
    setSubmitting(false);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/tickets" className="hover:text-indigo-600 transition-colors">Tickets</Link>
        <span>/</span>
        <Link to={`/tickets/${id}`} className="hover:text-indigo-600 transition-colors">#{id}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Ticket #{id}</h1>
          {currentStatus && <StatusBadge status={currentStatus} />}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 text-sm text-amber-800">
          <strong>Note:</strong> Status cannot be changed here. Use the ticket detail page to update status through the proper workflow.
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              } focus:ring-2`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none resize-none transition-colors ${
                errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              } focus:ring-2`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none bg-white transition-colors ${
                  errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } focus:ring-2`}
              >
                <option value="">Select category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">None</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1.5">Assigned To (User ID)</label>
            <input
              id="assignedTo"
              name="assignedTo"
              type="number"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="e.g. 1"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="resolutionNotes" className="block text-sm font-medium text-gray-700 mb-1.5">Resolution Notes</label>
            <textarea
              id="resolutionNotes"
              name="resolutionNotes"
              value={form.resolutionNotes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to={`/tickets/${id}`}
              className="text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
