import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../services/AuthService';

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon },
  { to: '/tickets', label: 'All Tickets', icon: TicketIcon },
  { to: '/tickets/new', label: 'New Ticket', icon: PlusIcon },
];

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M15 5v2m0 4v2m0 4v2M5 5h14v14H5z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-100 flex font-sans text-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r-[3px] border-black flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b-[3px] border-black bg-accent-500 text-white">
          <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-white text-black border-2 border-black rounded p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </span>
            <span className="uppercase tracking-widest text-lg">Desk</span>
          </h1>
          <p className="text-white text-xs mt-3 font-bold tracking-widest uppercase">IT Support Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-3 bg-white">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded border-2 border-black font-bold transition-all duration-100 ${
                  isActive
                    ? 'bg-accent-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-white text-black hover:bg-gray-100 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t-[3px] border-black bg-white">
          <div className="border-2 border-black rounded p-3 flex items-center justify-between bg-yellow-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-black text-xs font-bold uppercase">System Online</p>
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-black"></div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b-[3px] border-black px-4 lg:px-8 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-black hover:bg-gray-100 border-2 border-black rounded p-1"
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-7 h-7 rounded bg-accent-500 border-2 border-black flex items-center justify-center text-white font-extrabold text-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-bold text-black uppercase pr-1">{user.username}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-black bg-white hover:bg-red-500 hover:text-white border-2 border-black px-4 py-2 rounded font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors active:shadow-none active:translate-y-0.5 active:translate-x-0.5"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto animate-fade-in bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
