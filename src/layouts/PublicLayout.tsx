import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'


export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="text-xl font-semibold tracking-tight text-slate-900">
            Diagnocare
          </a>
          <div className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Fonctionnalités</a>
            <a href="#pricing" className="transition hover:text-slate-900">Tarification</a>
            <a href="#contact" className="transition hover:text-slate-900">Contact</a>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
 
        <Outlet />

      </main>

      <Footer />
    </div>
  )
}
