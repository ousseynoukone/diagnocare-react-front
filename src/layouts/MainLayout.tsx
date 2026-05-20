import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'



export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="text-xl font-semibold tracking-tight text-slate-900">
            Diagnocare
          </a>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#home" className="transition hover:text-slate-900">
              Home
            </a>
            <a href="#features" className="transition hover:text-slate-900">
              Features
            </a>
            <a href="#about" className="transition hover:text-slate-900">
              About
            </a>
            <a href="#contact" className="transition hover:text-slate-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <Outlet />

      </main>

      <Footer />
    </div>
  )
}

