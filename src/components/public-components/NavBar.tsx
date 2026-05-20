export default function NavBar() {
  return (
    <nav className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 ">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-slate-900 dark:text-slate-100">
          DiagnoCare
        </a>
        <div className="flex items-center gap-4">
          {/* Future navigation links can be added here */}
        </div>
      </div>
    </nav>
  )
}