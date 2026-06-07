import { useState, useMemo } from 'react';
import { X, Search, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FollowUpData } from '../../../api-s/requests/CheckInRequest';

interface SymptomOption {
  id: string;
  label: string;
}

interface CheckInSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUp: FollowUpData | null;
  originalSymptomIds: string[];
  symptoms: SymptomOption[];
  onSubmit: (symptomIds: string[]) => void;
  isPending: boolean;
}

export default function CheckInSymptomModal({
  isOpen,
  onClose,
  followUp,
  originalSymptomIds,
  symptoms,
  onSubmit,
  isPending,
}: CheckInSymptomModalProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(originalSymptomIds);
  const [query, setQuery] = useState('');

  // Reset to original when modal opens for a new follow-up
  useMemo(() => {
    setSelected(originalSymptomIds);
    setQuery('');
  }, [originalSymptomIds, isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return symptoms;
    const q = query.toLowerCase();
    return symptoms.filter((s) => s.label.toLowerCase().includes(q));
  }, [symptoms, query]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  if (!isOpen || !followUp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('dashboard.pages.suivis.checkin_modal_title', 'Suivi de santé')}
              </h2>
              <p className="text-xs text-slate-400 font-semibold">{followUp.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Instruction */}
        <div className="px-6 pt-5 pb-3 shrink-0 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            {t('dashboard.pages.suivis.checkin_instruction', 'Vos symptômes initiaux sont pré-sélectionnés. Décochez ceux qui ont disparu ou ajoutez-en de nouveaux.')}
          </p>

          {/* Search */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 gap-2">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('dashboard.pages.evaluation.search_symptom', 'Rechercher un symptôme...')}
              className="w-full bg-transparent border-none text-sm font-semibold text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Selected count */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('dashboard.pages.suivis.selected_count', { count: selected.length, defaultValue: '{{count}} symptôme(s) sélectionné(s)' })}
            </span>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                {t('dashboard.pages.suivis.clear_selection', 'Tout effacer')}
              </button>
            )}
          </div>
        </div>

        {/* Symptom grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8 font-medium">
              {t('dashboard.pages.evaluation.no_results', 'Aucun résultat pour cette recherche.')}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filtered.map((sym) => {
                const isSelected = selected.includes(sym.id);
                const isOriginal = originalSymptomIds.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    onClick={() => toggle(sym.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/20 border-primary/40 text-primary dark:text-primary-400'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <span className="text-white text-[10px] font-extrabold">✓</span>}
                    </span>
                    <span className="truncate leading-tight">{sym.label}</span>
                    {isOriginal && !isSelected && (
                      <span className="ml-auto text-[9px] font-bold text-slate-400 shrink-0">init.</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
            {t('common.cancel', 'Annuler')}
          </button>
          <button
            onClick={() => onSubmit(selected)}
            disabled={selected.length === 0 || isPending}
            className="bg-primary hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            {isPending
              ? t('dashboard.pages.suivis.submitting', 'Analyse en cours...')
              : t('dashboard.pages.suivis.submit_checkin', 'Soumettre le suivi')}
          </button>
        </div>
      </div>
    </div>
  );
}
