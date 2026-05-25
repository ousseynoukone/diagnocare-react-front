import { Outlet, Navigate } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import { useUserStore } from '../store/UserStore'



export default function MainLayout() {
  const user = useUserStore((state) => state.user);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      

      <main className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <Outlet />

      </main>

      <Footer />
    </div>
  )
}

