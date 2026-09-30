import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../services/api.js';
import { Toast } from '../components/ui.jsx';

export default function TicketCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM'
  });

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
        priority: form.priority || null
      };
      const res = await ticketService.create(payload);
      navigate(`/tickets/${res.data.id}`);
    } catch (err) {
      const serverErrors = err.response?.data;
      if (serverErrors && typeof serverErrors === 'object' && !serverErrors.message) {
        setErrors(serverErrors);
      } else {
        setToast({ message: serverErrors?.message || 'Failed to create ticket', type: 'error' });
      }
    }
    setSubmitting(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-2 text-sm text-black mb-6 font-bold uppercase tracking-wider animate-slide-up">
        <Link to="/tickets" className="hover:underline">Tickets</Link>
        <span>/</span>
        <span className="text-accent-500 font-extrabold">New Ticket</span>
      </div>

      <div className="max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h1 className="text-4xl font-extrabold text-black mb-8 uppercase tracking-tight">Create New Ticket</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              className={`w-full px-4 py-3 border-2 border-black rounded bg-white text-black font-bold outline-none transition-shadow focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                errors.title ? 'bg-red-50' : ''
              }`}
            />
            {errors.title && <p className="text-red-600 text-sm font-bold mt-2 bg-red-100 border-2 border-black p-2 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-extrabold text-black uppercase tracking-wider mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              rows={5}
              className={`w-full px-4 py-3 border-2 border-black rounded bg-white text-black font-bold outline-none resize-none transition-shadow focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                errors.description ? 'bg-red-50' : ''
              }`}
            />
            {errors.description && <p className="text-red-600 text-sm font-bold mt-2 bg-red-100 border-2 border-black p-2 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-extrabold text-black uppercase tracking-wider mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 border-black rounded bg-white text-black font-bold outline-none transition-shadow focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  errors.category ? 'bg-red-50' : ''
                }`}
              >
                <option value="">Select category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-600 text-sm font-bold mt-2 bg-red-100 border-2 border-black p-2 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-extrabold text-black uppercase tracking-wider mb-2">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black rounded bg-white text-black font-bold outline-none transition-shadow focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t-[3px] border-black">
            <button
              type="submit"
              disabled={submitting}
              className="bg-accent-500 hover:bg-accent-400 text-white px-8 py-3 rounded border-2 border-black font-extrabold uppercase tracking-wider transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
            <Link
              to="/tickets"
              className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded border-2 border-black font-extrabold uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-1 active:translate-x-1 active:shadow-none inline-flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
