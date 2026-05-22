import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import NavBar from '../components/public-components/NavBar'


export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    {< NavBar />}
    
      <main className="flex-1">
 
        <Outlet />

      </main>

      <Footer />
    </div>
  )
}
