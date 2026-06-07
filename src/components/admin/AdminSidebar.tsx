import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Brain, AlertTriangle, ShieldAlert, Settings, LogOut, Menu, X, ExternalLink
} from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import { useState } from 'react';
import logoBlue from '../../assets/logo-blue.svg';
import ToggleDarkMode from '../basics/ToggleDarkMode';

const menuItems = [
  { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Utilisateurs', path: '/admin/users', icon: Users },
  { label: 'Prédictions', path: '/admin/predictions', icon: Brain },
  { label: 'Signalements', path: '/admin/reports', icon: AlertTriangle },
  { label: 'Maladies urgentes', path: '/admin/urgent-diseases', icon: ShieldAlert },
  { label: 'Paramètres', path: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch { useUserStore.getState().clearUser(); }
    finally { setIsOpen(false); navigate('/login'); }
  };

  const initials = user
    ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || 'A'
    : 'A';

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-background-900 p-6 shadow-2xl border-r border-slate-800 text-white">
      <div className="space-y-8">
        {/* Logo + badge */}
        <div className="flex items-center gap-3 px-2">
          <img src={logoBlue} alt="DiagnoCare" className="h-10 w-auto" />
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">DiagnoCare</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-950/50 border border-violet-800/50 px-2 py-0.5 rounded-full">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Back to app */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition-all text-sm font-medium w-full cursor-pointer"
        >
          <ExternalLink className="h-4 w-4" />
          Retour à l'app
        </button>
      </div>

      {/* Bottom */}
      <div className="space-y-5 pt-6 border-t border-slate-800/60">
        <div className="flex items-center justify-between px-2">
          <ToggleDarkMode />
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-violet-700 border border-violet-600/40 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-slate-400 truncate">{user?.email}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all group cursor-pointer text-left"
        >
          <LogOut className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          <span className="text-sm font-semibold">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-[#0B0F19] text-white px-4 py-3 sticky top-0 z-40 border-b border-slate-800 w-full">
        <div className="flex items-center gap-2">
          <img src={logoBlue} alt="DiagnoCare" className="h-9 w-auto" />
          <span className="font-bold tracking-tight">Admin</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-[#0B0F19] shadow-2xl">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white z-50 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 h-screen sticky top-0 flex-shrink-0 z-30 overflow-y-auto">
        <SidebarContent />
      </aside>
    </>
  );
}
