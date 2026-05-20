export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <p>© {new Date().getFullYear()} Diagnocare. Built for a clean care experience.</p>
        <p className="text-slate-400">Designed for modern healthcare workflows.</p>
      </div>
    </footer>
  )
}
