import logo from '../../assets/logo-blue.png';
import ToggleDarkMode from '../basics/ToggleDarkMode';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import SwitchLanguage from '../basics/SwitchLanguage';
import { useTranslation } from 'react-i18next';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-white dark:bg-background-900 border-b border-background-200 dark:border-background-700 sticky top-0 z-50">
      <div className="mx-auto max-w-8xl px-2 py-2 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-background-900 dark:text-background-550">
          <img src={logo} alt="DiagnoCare Logo" className="h-12 w-auto translate-y-1.5" />
          <span className="text-xl font-bold">DiagnoCare</span>
        </Link>

        {/* Desktop Nav */}
        <div className="items-center gap-3 hidden lg:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-background-600 hover:text-background-900 dark:text-background-300 dark:hover:text-background-50 transition-colors cursor-pointer"
          >
            {t('nav.how_it_works')}
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-background-600 hover:text-background-900 dark:text-background-300 dark:hover:text-background-50 transition-colors cursor-pointer"
          >
            {t('nav.faq')}
          </a>

          <div className="h-10 w-0.5 bg-background-200 dark:bg-background-700 mx-2"></div>

          <Link
            to="/login"
            className="rounded-full border border-background-300 dark:border-background-600 px-4 py-2 text-sm font-medium text-background-700 dark:text-background-200 hover:bg-background-100 dark:hover:bg-background-800 transition-colors cursor-pointer"
          >
            {t('nav.login')}
          </Link>

          <Link
            to="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary dark:hover:bg-primary-700 transition-colors cursor-pointer"
          >
            {t('nav.start')}
          </Link>

          <ToggleDarkMode />
          <SwitchLanguage />
        </div>

        {/* Mobile hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-background-900 dark:text-background-100 focus:outline-none cursor-pointer"
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
          className={`absolute top-0 left-0 h-full w-[22rem] bg-white dark:bg-background-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between p-5 border-b border-background-200 dark:border-background-700">
            <button onClick={() => setIsMenuOpen(false)} className="cursor-pointer">
              <X size={28} className="text-background-700 dark:text-background-200" />
            </button>
            <div className="flex items-center gap-2">
              <ToggleDarkMode />
              <SwitchLanguage />
            </div>
          </div>

          {/* Panel links */}
          <div className="p-5 space-y-4">
            {isMenuOpen && (
              <div>
                <a
                  href="#how-it-works"
                  className="block px-4 my-1 py-2 text-background-700 dark:text-background-300 hover:bg-background-100 dark:hover:bg-background-800 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.how_it_works')}
                </a>
                <a
                  href="#faq"
                  className="block px-4 my-1 py-2 text-background-700 dark:text-background-300 hover:bg-background-100 dark:hover:bg-background-800 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.faq')}
                </a>

                <div className="px-4 pt-4 border-t border-background-200 dark:border-background-700 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="w-full text-center rounded-full border border-background-300 dark:border-background-600 px-5 py-3 text-sm font-medium text-background-700 dark:text-background-200 hover:bg-background-100 dark:hover:bg-background-800 transition-colors cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>

                  <Link
                    to="/signup"
                    className="w-full text-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.start')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}