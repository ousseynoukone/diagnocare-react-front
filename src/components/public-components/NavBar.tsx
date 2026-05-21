import logo from '../../assets/logo-blue.png';
import ToggleDarkMode from '../toggle-dark-mode/ToggleDarkMode';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';   
export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);




  return (
    <nav className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 sticky top-0 z-50">
      <div className="mx-auto max-w-8xl px-2 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <img src={logo} alt="DiagnoCare Logo" className="h-12 w-auto translate-y-1.5" />
          <span className="text-xl font-bold">DiagnoCare</span>
        </a>


        <div className="flex items-center gap-3 hidden md:flex">
          <a href="/services" className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Comment ça marche ?
          </a>
          <a href="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            FAQ
          </a>

          <div className="h-10 w-0.5 bg-gray-200 dark:bg-gray-800 mx-2">
          </div>
          <a
            href="/login"
            className="rounded-full dark:bg-primary border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
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

        <div className="md:hidden  top-4 right-4">
          <button
          onClick={()=>setIsMenuOpen(!isMenuOpen)}     
          
          className="text-slate-900 dark:text-slate-100 focus:outline-none"      
          >
            {!isMenuOpen && <Menu size={24} />  }
            
          </button>

        </div>
      </div>

      {/* Side Menu */}
      <div className={`fixed inset-0 z-50 md:hidden ${isMenuOpen ? 'visible' : 'invisible'}`}>

        {/* Overlay (fond noir semi-transparent) */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Le menu qui glisse depuis la droite */}
        <div 
          className={`absolute top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header du menu */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => setIsMenuOpen(false)} className="cursor:pointer">
              <X size={28} />
            </button>

            <ToggleDarkMode />

          </div>

          {/* Contenu du menu */}
          <div className="p-5 space-y-4">
                    {/* Menu Mobile */}
        {isMenuOpen && (
        <div >
            <a
              href="/services"
              className="block px-4 my-1 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Comment ça marche ?
            </a>
            <a
              href="/contact"
              className="block px-4 my-1 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>

            <div className="px-4  pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
              <a
                href="/login"
                className="w-full  text-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </a>
              <a
                href="/signup"
                className="w-full text-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
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