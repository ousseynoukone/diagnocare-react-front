

import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Accès sécurisé</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Connectez-vous à votre compte
          </h1>
          <p className="text-sm leading-6 text-slate-600">Connectez-vous pour gérer votre compte et accéder à votre tableau de bord.</p>
        </div>

         <Outlet />

      </div>
    </div>
  )
}
