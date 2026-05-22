import { Outlet } from 'react-router-dom'
import NavBar from '../components/public-components/NavBar'
import Footer from '../components/footer/Footer'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />
      <main className="flex-1 flex flex-col justify-center my-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
