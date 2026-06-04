import { Printer, Download, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/UserStore';
import { toast } from 'sonner';

export default function ResumePage() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  const getFullName = () => {
    return user ? `${user.firstName} ${user.lastName}` : 'Jean Dupont';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.success(t('auth.verify_email.success_code_sent') ? "Téléchargement du rapport PDF lancé." : "PDF report download started.");
  };

  return (
    <div id="resume-page" className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      {/* Header Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('dashboard.pages.resume.title', 'Résumé de consultation')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {t('dashboard.pages.resume.subtitle', 'Document généré automatiquement pour votre médecin.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/10 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner Header Inside the Card */}
        <div className="bg-[#0B0F19] dark:bg-[#070A10] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Rapport Médical DiagnoCare
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Généré le 14 Octobre 2023 à 14:35
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700/80 text-slate-400 px-3 py-1 rounded-md font-semibold text-xs tracking-wider font-mono shrink-0">
            ID: #DC-8923-XJ
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Patient and Context Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
            {/* Left: Patient info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Patient
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {getFullName()}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    35 ans • Homme
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Context info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Contexte
              </h3>
              <div className="space-y-1.5 text-sm font-medium">
                <p className="flex items-baseline gap-2">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-bold w-16 uppercase shrink-0">Motif :</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">Maux de tête persistants</span>
                </p>
                <p className="flex items-baseline gap-2">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-bold w-16 uppercase shrink-0">Durée :</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">Depuis 3 jours</span>
                </p>
                <p className="flex items-baseline gap-2">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-bold w-16 uppercase shrink-0">Évolution :</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">Aggravation légère</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Declared Symptoms */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              1. Symptômes déclarés
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200/45 dark:border-slate-700/65">
                Céphalées pulsatiles
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200/45 dark:border-slate-700/65">
                Photophobie
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200/45 dark:border-slate-700/65">
                Nausées
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200/45 dark:border-slate-700/65">
                Fatigue intense
              </span>
            </div>

            <div className="border-l-4 border-primary bg-slate-50 dark:bg-slate-800/40 p-4 rounded-r-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic font-semibold leading-relaxed">
                "La douleur est localisée sur le côté droit de la tête et augmente avec l'effort physique. La lumière vive est insupportable."
              </p>
            </div>
          </div>

          {/* Section 2: Predictive Analysis */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              2. Analyse prédictive
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60">
                    <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Pathologie potentielle
                    </th>
                    <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Confiance
                    </th>
                    <th className="pb-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Spécialiste
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  <tr>
                    <td className="py-4 text-sm font-bold text-slate-900 dark:text-white">
                      Migraine avec aura
                    </td>
                    <td className="py-4 text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      88%
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Neurologue
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                      Céphalée de tension
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-550 dark:text-slate-400">
                      45%
                    </td>
                    <td className="py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Généraliste
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Suggested Questions */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              3. Questions suggérieures pour la consultation
            </h3>
            <ul className="space-y-2.5 pl-5 list-disc text-sm font-semibold text-slate-700 dark:text-slate-300 marker:text-primary">
              <li>
                À quelle fréquence surviennent ces crises ?
              </li>
              <li>
                Avez-vous identifié des déclencheurs alimentaires ?
              </li>
              <li>
                Un traitement de fond est-il nécessaire ?
              </li>
            </ul>
          </div>

          {/* Report Footer Disclaimer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide leading-relaxed">
              Ce document est généré par une IA à titre informatif. Il ne constitue pas un diagnostic médical officiel.
              <br className="sm:hidden" /> DiagnoCare © 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
