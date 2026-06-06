import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Lock, Globe, Shield } from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import PersonalInfoSection from '../../components/dashboard/parametres/PersonalInfoSection';
import SecuritySection from '../../components/dashboard/parametres/SecuritySection';
import PreferencesSection from '../../components/dashboard/parametres/PreferencesSection';
import AccountSection from '../../components/dashboard/parametres/AccountSection';

export default function ParametresPage() {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: t('dashboard.pages.parametres.tab_profile', 'Profil'),
      description: t('dashboard.pages.parametres.tab_profile_desc', 'Informations personnelles'),
      icon: User,
      color: 'blue',
      component: <PersonalInfoSection user={user} />
    },
    {
      id: 'security',
      label: t('dashboard.pages.parametres.tab_security', 'Sécurité'),
      description: t('dashboard.pages.parametres.tab_security_desc', 'Mot de passe & accès'),
      icon: Lock,
      color: 'purple',
      component: <SecuritySection />
    },
    {
      id: 'preferences',
      label: t('dashboard.pages.parametres.tab_preferences', 'Préférences'),
      description: t('dashboard.pages.parametres.tab_preferences_desc', 'Langue de l\'interface'),
      icon: Globe,
      color: 'emerald',
      component: <PreferencesSection />
    },
    {
      id: 'account',
      label: t('dashboard.pages.parametres.tab_account', 'Compte & Données'),
      description: t('dashboard.pages.parametres.tab_account_desc', 'RGPD & suppression'),
      icon: Shield,
      color: 'rose',
      component: <AccountSection user={user} />
    }
  ];

  const activeTabObj = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div id="parametres-page" className="space-y-8 max-w-5xl mx-auto pb-12 animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t('dashboard.pages.parametres.title', 'Paramètres')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {t('dashboard.pages.parametres.description', 'Gérez vos informations personnelles et les préférences de votre compte.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-2 border-b md:border-b-0 border-slate-200 dark:border-slate-800 scrollbar-none shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            // Custom styling based on active state and color theme
            let activeClass = '';
            let iconClass = '';
            
            if (isActive) {
              if (tab.color === 'blue') {
                activeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-500 shadow-xs';
                iconClass = 'text-blue-500 dark:text-blue-400';
              } else if (tab.color === 'purple') {
                activeClass = 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-500 shadow-xs';
                iconClass = 'text-purple-500 dark:text-purple-400';
              } else if (tab.color === 'emerald') {
                activeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-500 shadow-xs';
                iconClass = 'text-emerald-500 dark:text-emerald-400';
              } else if (tab.color === 'rose') {
                activeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-500 shadow-xs';
                iconClass = 'text-rose-500 dark:text-rose-400';
              }
            } else {
              activeClass = 'hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-transparent';
              iconClass = 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-350';
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3.5 px-4 py-3 md:py-3.5 rounded-2xl text-left border-l-2 md:border-l-4 transition-all duration-200 shrink-0 cursor-pointer ${activeClass}`}
              >
                <div className={`p-2 rounded-xl bg-white dark:bg-slate-950 shadow-xs transition-colors shrink-0 group-hover:shadow-md ${isActive ? 'ring-1 ring-black/5 dark:ring-white/5' : ''}`}>
                  <Icon className={`h-5 w-5 ${iconClass}`} />
                </div>
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-bold truncate leading-snug">{tab.label}</p>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate leading-normal mt-0.5">{tab.description}</p>
                </div>
                <div className="md:hidden block">
                  <span className="text-sm font-bold">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="animate-fadeIn">
            {activeTabObj.component}
          </div>
        </div>
      </div>
    </div>
  );
}
