const statusConfig = {
  OPEN: { label: 'Open', bg: 'bg-blue-100 border-2 border-black', text: 'text-black', dot: 'bg-blue-500 border-2 border-black' },
  ASSIGNED: { label: 'Assigned', bg: 'bg-yellow-200 border-2 border-black', text: 'text-black', dot: 'bg-yellow-500 border-2 border-black' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-purple-200 border-2 border-black', text: 'text-black', dot: 'bg-purple-500 border-2 border-black' },
  RESOLVED: { label: 'Resolved', bg: 'bg-green-200 border-2 border-black', text: 'text-black', dot: 'bg-green-500 border-2 border-black' },
  CLOSED: { label: 'Closed', bg: 'bg-gray-200 border-2 border-black', text: 'text-black', dot: 'bg-gray-500 border-2 border-black' },
};

const priorityConfig = {
  HIGH: { label: 'High', bg: 'bg-red-200 border-2 border-black', text: 'text-black' },
  MEDIUM: { label: 'Medium', bg: 'bg-yellow-200 border-2 border-black', text: 'text-black' },
  LOW: { label: 'Low', bg: 'bg-green-200 border-2 border-black', text: 'text-black' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs uppercase tracking-wider font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${config.bg} ${config.text}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs uppercase tracking-wider font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 animate-fade-in">
      <div className="w-10 h-10 border-4 border-black border-t-accent-500 rounded-full animate-spin" />
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="text-center py-20 px-4 bg-white border-2 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-up">
      <div className="w-20 h-20 mx-auto mb-5 bg-yellow-200 border-2 border-black rounded-lg flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-black font-extrabold text-2xl tracking-tight uppercase">{title}</h3>
      <p className="text-black mt-2 text-sm font-bold">{message}</p>
      {action && <div className="mt-6 inline-block">{action}</div>}
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }) {
  const styles = {
    success: 'bg-green-200 border-2 border-black text-black',
    error: 'bg-red-200 border-2 border-black text-black',
  };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${styles[type]} animate-[slideIn_0.3s_ease-out]`}>
      <span className="text-sm font-bold tracking-wide">{message}</span>
      <button onClick={onClose} className="text-current border-2 border-black rounded-sm p-0.5 hover:bg-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
