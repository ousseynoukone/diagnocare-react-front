import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Brain, AlertTriangle, ShieldAlert, Settings, LogOut, Menu, X, ExternalLink, KeyRound, Eye, EyeOff
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUserStore } from '../../store/UserStore';
import { useState } from 'react';
import logoBlue from '../../assets/logo-blue.svg';
import ToggleDarkMode from '../basics/ToggleDarkMode';
import { ChangePasswordRequest } from '../../api-s/requests/AuthRequest';

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
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const changePwdMutation = useMutation({
    mutationFn: () => ChangePasswordRequest(user!.id, pwdForm.current, pwdForm.next),
    onSuccess: () => {
      toast.success('Mot de passe modifié');
      setShowChangePwd(false);
      setPwdForm({ current: '', next: '', confirm: '' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Impossible de modifier le mot de passe';
      toast.error(msg);
    },
  });

  const handleChangePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.next !== pwdForm.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    changePwdMutation.mutate();
  };

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
          onClick={() => { setShowChangePwd(true); setIsOpen(false); }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all cursor-pointer text-left"
        >
          <KeyRound className="h-5 w-5" />
          <span className="text-sm font-semibold">Changer le mot de passe</span>
        </button>

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

      {/* Change password modal */}
      {showChangePwd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-100 dark:bg-violet-950/40 rounded-xl">
                  <KeyRound className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Changer le mot de passe</h3>
              </div>
              <button
                onClick={() => { setShowChangePwd(false); setPwdForm({ current: '', next: '', confirm: '' }); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer text-lg leading-none"
              >✕</button>
            </div>

            <form onSubmit={handleChangePwd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    required
                    type={showCurrent ? 'text' : 'password'}
                    value={pwdForm.current}
                    onChange={(e) => setPwdForm(f => ({ ...f, current: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Mot de passe actuel"
                  />
                  <button type="button" onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    required
                    type={showNext ? 'text' : 'password'}
                    minLength={8}
                    value={pwdForm.next}
                    onChange={(e) => setPwdForm(f => ({ ...f, next: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Min. 8 caractères"
                  />
                  <button type="button" onClick={() => setShowNext(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Confirmer le mot de passe</label>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm(f => ({ ...f, confirm: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  placeholder="Répéter le nouveau mot de passe"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button"
                  onClick={() => { setShowChangePwd(false); setPwdForm({ current: '', next: '', confirm: '' }); }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                  Annuler
                </button>
                <button type="submit" disabled={changePwdMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                  {changePwdMutation.isPending ? 'Enregistrement…' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
