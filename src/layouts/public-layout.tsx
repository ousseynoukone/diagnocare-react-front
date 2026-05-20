import { Outlet } from 'react-router-dom'


export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
 
        <Outlet />

      </main>

      <footer className="border-t border-slate-200 bg-white/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Diagnocare. Page d'accueil publique.</p>
          <p className="text-slate-400">Simple, accueillante et facile à naviguer.</p>
        </div>
      </footer>
    </div>
  )
}
