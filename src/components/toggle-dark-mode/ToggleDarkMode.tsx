import { useState } from 'react'
import { ThemeStorageKey } from '../../types/storage-keys'



export default function ToggleDarkMode() {
  // Read the initial theme class directly from the HTML element (set by index.html script)
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    window.localStorage.setItem(ThemeStorageKey, nextTheme)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full cursor-pointer border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? (
        <span aria-hidden="true">🌙</span>
      ) : (
        <span aria-hidden="true">☀️</span>
      )}
      <span >{theme === 'dark' ? 'Mode sombre' : 'Mode clair'}</span>
    </button>
  )
}
