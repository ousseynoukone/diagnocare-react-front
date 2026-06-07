import { Outlet, Navigate } from 'react-router-dom';
import { useUserStore } from '../store/UserStore';
import { Role } from '../types/models/Auth';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  const user = useUserStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto">
          <div className="flex-1 p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
