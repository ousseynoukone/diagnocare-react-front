import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Check, Info, CheckCircle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Symptom } from '../../../types/models/Evaluation';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onToggleSymptom: (id: string) => void;
  onStartAnalysis: () => void;
  allSymptoms: Symptom[];
  frequentSymptomIds: string[];
}

export default function SymptomSelector({
  selectedSymptoms,
  onToggleSymptom,
  onStartAnalysis,
  allSymptoms,
  frequentSymptomIds,
}: SymptomSelectorProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter symptoms based on search query
  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allSymptoms.filter(s => 
      s.label.toLowerCase().includes(query) && !selectedSymptoms.includes(s.id)
    );
  }, [searchQuery, allSymptoms, selectedSymptoms]);

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-background-900 dark:text-white">
          {t('dashboard.pages.evaluation.selection_title', 'Évaluation des symptômes')}
        </h1>
        <p className="text-background-500 dark:text-background-400 font-medium">
          {t('dashboard.pages.evaluation.selection_desc', "Sélectionnez ce que vous ressentez pour commencer l'analyse.")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Search Input Container */}
        <div ref={searchContainerRef} className="relative">
          <div className="flex items-center bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl px-4 py-4 shadow-sm hover:border-background-300 dark:hover:border-background-700 transition-colors">
            <Search className="h-5 w-5 text-background-400 mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
              placeholder={t('dashboard.pages.evaluation.search_placeholder', 'Rechercher un symptôme (ex: fièvre, douleur...)')}
              className="w-full bg-transparent border-none text-background-900 dark:text-white focus:outline-none placeholder-background-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-background-100 dark:hover:bg-background-800 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-background-400" />
              </button>
            )}
          </div>

          {/* Autocomplete suggestions */}
          {showAutocomplete && filteredSymptoms.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
              {filteredSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => {
                    onToggleSymptom(symptom.id);
                    setSearchQuery('');
                    setShowAutocomplete(false);
                    toast.success(t('auth.verify_email.success_code_sent') ? `Symptôme ajouté : ${symptom.label}` : `Symptom added: ${symptom.label}`);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-background-50 dark:hover:bg-background-800/60 border-b border-background-100 dark:border-background-800/40 text-sm font-semibold transition-colors flex justify-between items-center cursor-pointer text-background-800 dark:text-background-200"
                >
                  <span>{symptom.label}</span>
                  <ChevronRight className="h-4 w-4 text-background-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Frequent Symptoms Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-background-400 dark:text-background-500 uppercase tracking-wider">
            {t('dashboard.pages.evaluation.frequent_title', 'Symptômes fréquents')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {allSymptoms.filter(s => frequentSymptomIds.includes(s.id)).map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => onToggleSymptom(symptom.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-205 cursor-pointer ${
                    isSelected 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 text-background-700 dark:text-background-300 hover:border-background-300 dark:hover:border-background-700 hover:bg-background-50 dark:hover:bg-background-800'
                  }`}
                >
                  {symptom.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Symptoms Box */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-background-200 dark:border-background-800 animate-fadeIn">
            <h3 className="text-sm font-semibold text-background-400 dark:text-background-500 uppercase tracking-wider">
              {t('dashboard.pages.evaluation.selected_title', 'Vos symptômes sélectionnés')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((id) => {
                const symptom = allSymptoms.find(s => s.id === id);
                if (!symptom) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/40 text-primary dark:text-primary-300 px-3.5 py-1.5 rounded-full text-sm font-semibold border border-primary-100 dark:border-primary-900/60"
                  >
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {symptom.label}
                    <button 
                      onClick={() => onToggleSymptom(id)}
                      className="hover:bg-primary-100 dark:hover:bg-primary-900/60 p-0.5 rounded-full transition-colors ml-1 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-72 bg-white dark:bg-background-900 border-t border-background-200 dark:border-background-800 p-4 shadow-lg z-45 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedSymptoms.length === 0 ? (
              <>
                <Info className="h-5 w-5 text-background-400 shrink-0" />
                <span className="text-sm text-background-500 dark:text-background-400 font-semibold">
                  {t('dashboard.pages.evaluation.select_at_least_one', 'Sélectionnez au moins 1 symptôme')}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-primary font-bold">
                  {selectedSymptoms.length === 1 
                    ? t('dashboard.pages.evaluation.symptoms_selected_one', '1 symptôme sélectionné') 
                    : t('dashboard.pages.evaluation.symptoms_selected_plural', { count: selectedSymptoms.length, defaultValue: '{{count}} symptômes sélectionnés' })}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onStartAnalysis}
            disabled={selectedSymptoms.length === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
              selectedSymptoms.length === 0
                ? 'bg-background-100 dark:bg-background-800 text-background-400 dark:text-background-600 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-700 text-white shadow-lg shadow-primary/25'
            }`}
          >
            <span>{t('dashboard.pages.evaluation.start_analysis_btn', "Lancer l'analyse")}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
