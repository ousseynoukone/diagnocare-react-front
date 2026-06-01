import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  Clock, 
  FileText, 
  ClipboardList, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SideBar() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out from server, clearing local session:", error);
      // Fallback: clear the local user state manually
      useUserStore.getState().clearUser();
    } finally {
      setIsOpen(false);
      navigate('/');
    }
  };

  const menuItems = [
    { label: t('dashboard.sidebar.accueil', 'Accueil'), path: '/dashboard', icon: Home, end: true },
    { label: t('dashboard.sidebar.evaluation', 'Évaluation'), path: '/dashboard/evaluation', icon: Activity },
    { label: t('dashboard.sidebar.suivis', 'Suivis'), path: '/dashboard/suivis', icon: Clock },
    { label: t('dashboard.sidebar.historique', 'Historique'), path: '/dashboard/historique', icon: FileText },
    { label: t('dashboard.sidebar.resume', 'Résumé'), path: '/dashboard/resume', icon: ClipboardList },
    { label: t('dashboard.sidebar.profil', 'Profil médical'), path: '/dashboard/profil', icon: User },
    { label: t('dashboard.sidebar.parametres', 'Paramètres'), path: '/dashboard/parametres', icon: Settings },
  ];


  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return 'JD';
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return 'Jean Dupont';
    return `${user.firstName} ${user.lastName}`;
  };

  const getEmail = () => {
    if (!user) return 'jean.dupont@email.com';
    return user.email;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-background-900 dark:bg-background-900  p-6 shadow-2xl border-r border-slate-800 text-white">
      {/* Top Part: Logo & Menu */}
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-2 rounded-xl text-white flex items-center justify-center shadow-lg shadow-primary/30">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DiagnoCare</span>
        </div>

        {/* Navigation Items */}
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
                      ? 'bg-primary text-white shadow-md shadow-primary/30 font-semibold'
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
      </div>

      {/* Bottom Part: Profile & Logout */}
      <div className="space-y-6 pt-6 border-t border-slate-800/60">
        {/* Profile Card */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-primary-700 border border-primary/30 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-900/40 flex-shrink-0">
            {getInitials()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{getFullName()}</span>
            <span className="text-xs text-slate-400 truncate">{getEmail()}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all duration-200 group cursor-pointer text-left"
        >
          <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          <span className="text-sm font-semibold">{t('dashboard.sidebar.logout', 'Déconnexion')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header (only visible on mobile screens) */}
      <div className="md:hidden flex items-center justify-between bg-[#0B0F19] text-white px-4 py-3 sticky top-0 z-40 border-b border-slate-800 w-full">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white flex items-center justify-center">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="font-bold tracking-tight">DiagnoCare</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer (Drawer container and Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-[#0B0F19] shadow-2xl transform transition-transform duration-300">
            {/* Close button inside drawer */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white transition-colors z-50 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile, visible on medium screens and up) */}
      <aside className="hidden md:block w-72 h-screen sticky top-0 flex-shrink-0 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
