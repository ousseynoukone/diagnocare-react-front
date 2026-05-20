import logo from '../../assets/logo-blue.png';
import ToggleDarkMode from '../toggle-dark-mode/ToggleDarkMode';

export default function NavBar() {
  return (
    <nav className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <img src={logo} alt="DiagnoCare Logo" className="h-12 w-auto translate-y-1.5" />
          <span className="text-xl font-bold">DiagnoCare</span>
        </a>


        <div className="flex items-center gap-3">
          <a href="/services" className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Comment ça marche ?
          </a>
          <a href="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            FAQ
          </a>

          <div className='h-10 w-0.5 bg-gray-200 mx-2 '>

          </div>
          <a
            href="/login"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Se connecter
          </a>
          <a
            href="/signup"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Commencer
          </a>
          <ToggleDarkMode />
        </div>
      </div>
    </nav>
  );
}