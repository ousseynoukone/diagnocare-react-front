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
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      
      <main>
        <div className="flex">
        <SideBar />

          <div className="flex-1 p-4">
            
            <Outlet />

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

