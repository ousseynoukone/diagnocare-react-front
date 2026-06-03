import React from 'react';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AnalysisLoading() {
  const { t } = useTranslation();

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center animate-pulse">
      <div className="relative flex items-center justify-center">
        {/* Heartbeat pulse circles */}
        <div className="absolute h-24 w-24 bg-primary-500/25 rounded-full animate-ping"></div>
        <div className="absolute h-32 w-32 bg-primary-500/10 rounded-full animate-ping [animation-delay:0.5s]"></div>
        
        <div className="relative h-20 w-20 bg-primary rounded-full flex items-center justify-center border-4 border-white dark:border-background-950 shadow-xl">
          <Activity className="h-10 w-10 text-white animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-background-950 dark:text-white">
          {t('dashboard.pages.evaluation.loading_title', 'Analyse en cours...')}
        </h2>
        <p className="text-sm text-background-500 dark:text-background-400 font-medium leading-relaxed">
          {t('dashboard.pages.evaluation.loading_desc', 'Notre IA compare vos symptômes avec notre base médicale.')}
        </p>
      </div>
    </div>
  );
}
