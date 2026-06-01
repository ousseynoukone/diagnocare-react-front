import { Outlet, Navigate } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import { useUserStore } from '../store/UserStore'
import SideBar from '../components/head/SideBar';



export default function MainLayout() {
  const user = useUserStore((state) => state.user);

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen  flex flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        <SideBar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex-1 p-6 md:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}


