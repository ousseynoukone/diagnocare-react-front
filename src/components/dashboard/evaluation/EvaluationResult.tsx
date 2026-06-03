import React from 'react';
import { ArrowLeft, Download, Calendar, CheckCircle, MapPin, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Doctor, PredictionResult } from '../../../types/models/Evaluation';

interface EvaluationResultProps {
  resultData: PredictionResult;
  onBackToSelection: () => void;
  onFindSpecialists: () => void;
  onNavigateToFollowups: () => void;
}

export default function EvaluationResult({
  resultData,
  onBackToSelection,
  onFindSpecialists,
  onNavigateToFollowups,
}: EvaluationResultProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBackToSelection}
          className="inline-flex items-center gap-2 text-sm font-semibold text-background-500 hover:text-background-900 dark:text-background-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('dashboard.pages.evaluation.result_back', 'Retour')}
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              toast.success(t('auth.verify_email.success_code_sent') ? "Téléchargement du rapport PDF lancé." : "PDF report download started.");
            }}
            className="flex items-center gap-2 bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 hover:bg-background-50 dark:hover:bg-background-800 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer text-background-700 dark:text-background-200"
          >
            <Download className="h-4 w-4 text-background-500" />
            {t('dashboard.pages.evaluation.result_pdf', 'PDF')}
          </button>
          
          <button
            onClick={onNavigateToFollowups}
            className="flex items-center gap-2 bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-primary/10 transition-colors cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            {t('dashboard.pages.evaluation.result_followup', 'Faire un suivi')}
          </button>
        </div>
      </div>

      {/* Results Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Main Diagnosis & alternatives */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-6 md:p-8 shadow-sm">
            
            {/* Result Tag Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-background-100 dark:border-background-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary dark:text-primary-400 uppercase tracking-widest">
                  <CheckCircle className="h-4 w-4" />
                  {t('dashboard.pages.evaluation.result_main_title', 'Résultat principal')}
                </div>
                <p className="text-xs text-background-400 dark:text-background-500 font-semibold">
                  {t('dashboard.pages.evaluation.result_based_on', 'Basé sur vos symptômes déclarés')}
                </p>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900/40 text-primary dark:text-primary-300 font-bold px-3 py-1.5 rounded-full text-xs border border-primary-100 dark:border-primary-900/60">
                {t('dashboard.pages.evaluation.result_confidence', { confidence: resultData.confidence, defaultValue: 'Confiance {{confidence}}%' })}
              </div>
            </div>

            {/* Primary Disease Title */}
            <div className="py-6 space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-background-900 dark:text-white tracking-tight">
                {resultData.title}
              </h2>
              <p className="text-background-600 dark:text-background-300 text-base leading-relaxed font-medium">
                {resultData.description}
              </p>
            </div>

            {/* Probability Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-background-500 dark:text-background-400">{t('dashboard.pages.evaluation.result_probability', 'Probabilité')}</span>
                <span className="text-primary font-bold">{resultData.confidence}%</span>
              </div>
              <div className="h-3 w-full bg-background-100 dark:bg-background-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${resultData.confidence}%` }}
                />
              </div>
            </div>

          </div>

          {/* Other possibilities list */}
          <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-background-900 dark:text-white">
              {t('dashboard.pages.evaluation.result_alternatives_title', 'Autres possibilités analysées')}
            </h3>
            <div className="space-y-4">
              {resultData.alternatives.map((alt, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-xl bg-background-50 dark:bg-background-900/40 border border-background-100 dark:border-background-800/60 hover:bg-background-100/60 dark:hover:bg-background-900/40 transition-colors"
                >
                  <span className="text-sm font-bold text-background-800 dark:text-background-200">
                    {alt.name}
                  </span>
                  <span className="text-sm font-extrabold text-background-500 dark:text-background-400 bg-white dark:bg-background-900 px-3 py-1 rounded-lg border border-background-200/60 dark:border-background-800 shadow-xs">
                    {alt.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Recommended Specialist */}
        <div className="space-y-6">
          <div className="bg-background-900 text-white rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between h-full border border-background-800">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-background-400 uppercase tracking-widest">
                  {t('dashboard.pages.evaluation.result_specialist_recommended', 'Spécialiste recommandé')}
                </h3>
                <p className="text-xs text-background-500">
                  {t('dashboard.pages.evaluation.result_specialist_confirm', 'Pour confirmer ce résultat')}
                </p>
              </div>
              
              {/* Doctor badge box */}
              <div className="bg-background-800 border border-background-700 p-5 rounded-xl text-center shadow-inner">
                <span className="text-xl font-extrabold tracking-tight text-white block">
                  {resultData.specialist}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-12">
              <button
                onClick={onFindSpecialists}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-background-100 text-background-900 font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg cursor-pointer"
              >
                <MapPin className="h-4 w-4 fill-background-950" />
                {t('dashboard.pages.evaluation.result_find_nearby', 'Trouver à proximité')}
              </button>
              <p className="text-center text-[10px] text-background-500 font-semibold tracking-wide">
                {t('dashboard.pages.evaluation.result_redirection_sub', 'Redirection vers Doctolib / Google Maps')}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Legal Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/60 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-500" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold">{t('dashboard.pages.evaluation.result_warning_title', 'Avertissement important :')}</h4>
          <p className="text-xs leading-relaxed font-semibold">
            {t('dashboard.pages.evaluation.result_warning_desc', "DiagnoCare est un outil d'aide à la décision et ne remplace pas un avis médical professionnel. Ceci n'est pas un diagnostic médical. En cas d'urgence, contactez immédiatement le 15 ou rendez-vous aux urgences.")}
          </p>
        </div>
      </div>
    </div>
  );
}
