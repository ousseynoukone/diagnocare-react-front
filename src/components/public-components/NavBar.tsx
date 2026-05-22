import logo from '../../assets/logo-blue.png';
import ToggleDarkMode from '../toggle-dark-mode/ToggleDarkMode';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-background-900 border-b border-background-200 dark:border-background-700 sticky top-0 z-50">
      <div className="mx-auto max-w-8xl px-2 py-2 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-background-900 dark:text-background-50">
          <img src={logo} alt="DiagnoCare Logo" className="h-12 w-auto translate-y-1.5" />
          <span className="text-xl font-bold">DiagnoCare</span>
        </a>

        {/* Desktop Nav */}
        <div className="items-center gap-3 hidden lg:flex">
          <a
            href="/services"
            className="text-sm font-medium text-background-600 hover:text-background-900 dark:text-background-300 dark:hover:text-background-50 transition-colors"
          >
            Comment ça marche ?
          </a>
          <a
            href="/contact"
            className="text-sm font-medium text-background-600 hover:text-background-900 dark:text-background-300 dark:hover:text-background-50 transition-colors"
          >
            FAQ
          </a>

          <div className="h-10 w-0.5 bg-background-200 dark:bg-background-700 mx-2"></div>

          <a
            href="/login"
            className="rounded-full border border-background-300 dark:border-background-600 px-4 py-2 text-sm font-medium text-background-700 dark:text-background-200 hover:bg-background-100 dark:hover:bg-background-800 transition-colors"
          >
            Se connecter
          </a>

          <a
            href="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary dark:hover:bg-primary-700 transition-colors"
          >
            Commencer
          </a>

          <ToggleDarkMode />
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-background-900 dark:text-background-100 focus:outline-none"
          >
            {!isMenuOpen && <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMenuOpen ? 'visible' : 'invisible'}`}>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Sliding panel */}
        <div
          className={`absolute top-0 left-0 h-full w-72 bg-white dark:bg-background-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between p-5 border-b border-background-200 dark:border-background-700">
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={28} className="text-background-700 dark:text-background-200" />
            </button>
            <ToggleDarkMode />
          </div>

          {/* Panel links */}
          <div className="p-5 space-y-4">
            {isMenuOpen && (
              <div>
                <a
                  href="/services"
                  className="block px-4 my-1 py-2 text-background-700 dark:text-background-300 hover:bg-background-100 dark:hover:bg-background-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Comment ça marche ?
                </a>
                <a
                  href="/contact"
                  className="block px-4 my-1 py-2 text-background-700 dark:text-background-300 hover:bg-background-100 dark:hover:bg-background-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>

                <div className="px-4 pt-4 border-t border-background-200 dark:border-background-700 flex flex-col gap-3">
                  <a
                    href="/login"
                    className="w-full text-center rounded-full border border-background-300 dark:border-background-600 px-5 py-3 text-sm font-medium text-background-700 dark:text-background-200 hover:bg-background-100 dark:hover:bg-background-800 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </a>

                  <a
                    href="/signup"
                    className="w-full text-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Commencer
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}