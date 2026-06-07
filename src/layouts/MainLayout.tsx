import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import { useUserStore } from '../store/UserStore';
import SideBar from '../components/head/SideBar';
import { useProfile } from '../hooks/useProfile';
import { Role } from '../types/models/Auth';

export default function MainLayout() {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  const { data: dbProfile, isLoading: isProfileLoading } = useProfile(user?.id);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admins and super-admins have no business on patient routes
  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  if (isProfileLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"></div>
      </div>
    );
  }

  const isProfileIncomplete =!dbProfile ||
                              !dbProfile.age ||
                              dbProfile.age === 0 ||
                              !dbProfile.weight ||
                              dbProfile.weight === 0 ||
                              !dbProfile.gender;

  if (isProfileIncomplete && location.pathname !== '/dashboard/profil') {
    return <Navigate to="/dashboard/profil" replace />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <SideBar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-y-auto">
          <div className="flex-1 p-6 md:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}


