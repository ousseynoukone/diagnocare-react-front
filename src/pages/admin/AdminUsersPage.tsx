import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Search, Users, ShieldCheck, UserCircle, RefreshCw, UserPlus, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { getAllUsers, deleteUser, createAdminAccount } from '../../api-s/requests/AdminRequest';
import { AdminSetPasswordRequest } from '../../api-s/requests/AuthRequest';
import { useUserStore } from '../../store/UserStore';
import { Role } from '../../types/models/Auth';

function roleLabel(roles: Array<{ id: number; roleName?: string; name?: string }>) {
  if (!roles || roles.length === 0) return 'Patient';
  const id = roles[0].id;
  if (id === Role.SUPER_ADMIN) return 'Super Admin';
  if (id === Role.ADMIN) return 'Admin';
  if (id === Role.DOCTOR) return 'Médecin';
  if (id === Role.OPERATOR) return 'Opérateur';
  return 'Patient';
}

function roleBadgeClass(roles: Array<{ id: number }>) {
  const id = roles?.[0]?.id;
  if (id === Role.SUPER_ADMIN) return 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50';
  if (id === Role.ADMIN) return 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
  if (id === Role.DOCTOR) return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
  return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
}

const CREATABLE_ROLES = [
  { id: Role.ADMIN, label: 'Admin' },
  { id: Role.DOCTOR, label: 'Médecin' },
  { id: Role.OPERATOR, label: 'Opérateur' },
];

const EMPTY_CREATE_FORM: { firstName: string; lastName: string; email: string; password: string; roleId: number } =
  { firstName: '', lastName: '', email: '', password: '', roleId: Role.ADMIN };

export default function AdminUsersPage() {
  const currentUser = useUserStore((s) => s.user);
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // Create account modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [showCreatePwd, setShowCreatePwd] = useState(false);

  // Reset password modal
  const [resetTarget, setResetTarget] = useState<{ id: number; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showResetPwd, setShowResetPwd] = useState(false);

  const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Utilisateur supprimé');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Impossible de supprimer cet utilisateur'),
  });

  const createMutation = useMutation({
    mutationFn: createAdminAccount,
    onSuccess: () => {
      toast.success('Compte créé avec succès');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      setShowCreateModal(false);
      setCreateForm(EMPTY_CREATE_FORM);
      setShowCreatePwd(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Impossible de créer le compte';
      toast.error(msg);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, pwd }: { id: number; pwd: string }) =>
      AdminSetPasswordRequest(id, pwd),
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé');
      setResetTarget(null);
      setNewPassword('');
      setShowResetPwd(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Impossible de réinitialiser le mot de passe';
      toast.error(msg);
    },
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    );
  });

  const closeCreate = () => { setShowCreateModal(false); setCreateForm(EMPTY_CREATE_FORM); setShowCreatePwd(false); };
  const closeReset = () => { setResetTarget(null); setNewPassword(''); setShowResetPwd(false); };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Utilisateurs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {users.length} compte{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Créer un compte
            </button>
          )}
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-violet-500 dark:border-slate-800 dark:border-t-violet-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <UserCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nom</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rôle</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vérifié</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">#{u.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-violet-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(u.firstName?.[0] ?? '') + (u.lastName?.[0] ?? '')}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${roleBadgeClass(u.roles)}`}>
                        <ShieldCheck className="h-3 w-3" />
                        {roleLabel(u.roles)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold ${u.emailVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {u.emailVerified ? '✓ Oui' : '✗ Non'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isSuperAdmin && u.id !== currentUser?.id && u.roles?.[0]?.id !== Role.SUPER_ADMIN && (
                          <button
                            onClick={() => setResetTarget({ id: u.id, name: `${u.firstName} ${u.lastName}` })}
                            className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Réinitialiser le mot de passe"
                          >
                            <KeyRound className="h-4 w-4" />
                          </button>
                        )}
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => setDeleteTarget(u.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create account modal ───────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-100 dark:bg-violet-950/40 rounded-xl">
                  <UserPlus className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Créer un compte</h3>
              </div>
              <button onClick={closeCreate} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer text-lg leading-none">✕</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(createForm); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Prénom</label>
                  <input required value={createForm.firstName} onChange={(e) => setCreateForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Jean" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nom</label>
                  <input required value={createForm.lastName} onChange={(e) => setCreateForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Dupont" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email</label>
                <input required type="email" value={createForm.email} onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  placeholder="admin@diagnocare.com" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Mot de passe temporaire</label>
                <div className="relative">
                  <input required type={showCreatePwd ? 'text' : 'password'} minLength={8} value={createForm.password}
                    onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    placeholder="Min. 8 caractères" />
                  <button type="button" onClick={() => setShowCreatePwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showCreatePwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Rôle</label>
                <select value={createForm.roleId} onChange={(e) => setCreateForm(f => ({ ...f, roleId: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 cursor-pointer">
                  {CREATABLE_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeCreate}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                  Annuler
                </button>
                <button type="submit" disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                  {createMutation.isPending ? 'Création…' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset password modal ──────────────────────────────────────────────── */}
      {resetTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/40 rounded-xl">
                <KeyRound className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Réinitialiser le mot de passe</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{resetTarget.name}</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); resetPasswordMutation.mutate({ id: resetTarget.id, pwd: newPassword }); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <input required type={showResetPwd ? 'text' : 'password'} minLength={8} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                    placeholder="Min. 8 caractères" />
                  <button type="button" onClick={() => setShowResetPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showResetPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={closeReset}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                  Annuler
                </button>
                <button type="submit" disabled={resetPasswordMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                  {resetPasswordMutation.isPending ? 'Enregistrement…' : 'Réinitialiser'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirm ────────────────────────────────────────────────────── */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/40 rounded-xl">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Supprimer l'utilisateur</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={() => deleteMutation.mutate(deleteTarget)} disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                {deleteMutation.isPending ? 'Suppression…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
