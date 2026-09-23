const statusConfig = {
  OPEN: { label: 'Open', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  ASSIGNED: { label: 'Assigned', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  RESOLVED: { label: 'Resolved', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  CLOSED: { label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};

const priorityConfig = {
  HIGH: { label: 'High', bg: 'bg-red-100', text: 'text-red-700' },
  MEDIUM: { label: 'Medium', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  LOW: { label: 'Low', bg: 'bg-green-100', text: 'text-green-700' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-gray-900 font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 mt-1 text-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} animate-[slideIn_0.3s_ease-out]`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
