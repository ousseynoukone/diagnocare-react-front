import { useState } from 'react';
import { ArrowLeft, Search, MapPin, Filter, Star, Phone, Activity, ExternalLink, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Doctor } from '../../../types/models/Evaluation';
import DoctorMap from './DoctorMap';

interface SpecialistFinderProps {
  specialist: string;
  doctors: Doctor[];
  isLoadingDoctors: boolean;
  location: string;
  userCoords: { lat: number; lng: number } | null;
  onBackToResults: () => void;
  onSearch: (specialist: string, location: string) => void;
}

export default function SpecialistFinder({
  specialist,
  doctors,
  isLoadingDoctors,
  location,
  userCoords,
  onBackToResults,
  onSearch,
}: SpecialistFinderProps) {
  const { t } = useTranslation();
  const [specialistQuery, setSpecialistQuery] = useState(specialist);
  const [locationQuery, setLocationQuery] = useState(location);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    doctors.length > 0 ? doctors[0] : null
  );

  // Keep selectedDoctor in sync when doctors list refreshes
  if (doctors.length > 0 && selectedDoctor === null) {
    setSelectedDoctor(doctors[0]);
  }
  if (doctors.length === 0 && selectedDoctor !== null && !isLoadingDoctors) {
    setSelectedDoctor(null);
  }

  const handleSearch = () => {
    onSearch(specialistQuery.trim() || specialist, locationQuery.trim() || location);
  };

  const doctlibFallback = (spec: string) =>
    `https://www.doctolib.fr/recherche?query=${encodeURIComponent(spec)}`;

  return (
    <div className="space-y-6 animate-fadeIn text-background-800 dark:text-background-100">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToResults}
          className="inline-flex items-center gap-2 text-sm font-semibold text-background-500 hover:text-background-900 dark:text-background-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('dashboard.pages.evaluation.result_back', 'Retour')}
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-background-900 dark:text-white">
          {t('dashboard.pages.evaluation.specialist_title', 'Trouver un spécialiste')}
        </h1>
      </div>

      {/* Search bar */}
      <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="flex items-center bg-background-50 dark:bg-background-900/40 border border-background-100 dark:border-background-800/80 rounded-xl px-3.5 py-2.5">
            <Search className="h-4 w-4 text-background-400 mr-2 shrink-0" />
            <input
              type="text"
              value={specialistQuery}
              onChange={e => setSpecialistQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent border-none text-sm font-semibold text-background-900 dark:text-white focus:outline-none"
              placeholder={t('dashboard.pages.evaluation.specialist_placeholder', 'Spécialité')}
            />
          </div>
          <div className="flex items-center bg-background-50 dark:bg-background-900/40 border border-background-100 dark:border-background-800/80 rounded-xl px-3.5 py-2.5">
            <MapPin className="h-4 w-4 text-background-400 mr-2 shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={e => setLocationQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full bg-transparent border-none text-sm font-semibold text-background-900 dark:text-white focus:outline-none"
              placeholder={t('dashboard.pages.evaluation.specialist_location_placeholder', 'Ville ou Code Postal')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSearch}
            disabled={isLoadingDoctors}
            className="flex items-center gap-2 bg-primary hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" />
            {isLoadingDoctors
              ? t('dashboard.pages.evaluation.specialist_searching', 'Recherche...')
              : t('dashboard.pages.evaluation.specialist_search_btn', 'Rechercher')}
          </button>
          <button className="p-3 bg-background-100 hover:bg-background-200 dark:bg-background-800 dark:hover:bg-background-700 text-background-600 dark:text-background-300 rounded-xl transition-colors cursor-pointer">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left: Doctor Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-background-400 tracking-wide uppercase px-1">
            <span>
              {isLoadingDoctors
                ? t('dashboard.pages.evaluation.specialist_loading', 'Chargement des résultats...')
                : doctors.length === 0
                  ? t('dashboard.pages.evaluation.specialist_no_results', 'Aucun résultat — lancez une recherche')
                  : doctors.length === 1
                    ? t('dashboard.pages.evaluation.specialist_results_count_one', '1 résultat trouvé')
                    : t('dashboard.pages.evaluation.specialist_results_count_plural', { count: doctors.length, defaultValue: '{{count}} résultats trouvés' })}
            </span>
            {doctors.length > 0 && (
              <span>{t('dashboard.pages.evaluation.specialist_sort_by', 'Trié par pertinence')}</span>
            )}
          </div>

          {/* Skeleton */}
          {isLoadingDoctors && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-5 flex gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-background-200 dark:bg-background-700 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-background-200 dark:bg-background-700 rounded w-2/3" />
                    <div className="h-3 bg-background-100 dark:bg-background-800 rounded w-1/3" />
                    <div className="h-3 bg-background-100 dark:bg-background-800 rounded w-1/2" />
                    <div className="flex gap-2 pt-1">
                      <div className="h-9 bg-background-200 dark:bg-background-700 rounded-xl flex-1" />
                      <div className="h-9 w-9 bg-background-100 dark:bg-background-800 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Doctor cards */}
          {!isLoadingDoctors && (
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
              {doctors.map((doc, idx) => {
                const isSelected = selectedDoctor?.name === doc.name;
                const websiteUrl = doc.website ?? doctlibFallback(doc.specialist);
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setSelectedDoctor(doc)}
                    className={`bg-white dark:bg-background-900 border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden flex gap-4 ${
                      isSelected
                        ? 'border-primary dark:border-primary ring-1 ring-primary/20'
                        : 'border-background-200 dark:border-background-800'
                    }`}
                  >
                    <div className="w-14 h-14 bg-background-50 dark:bg-background-800 rounded-xl shrink-0 flex items-center justify-center text-background-400">
                      <Activity className="h-6 w-6 stroke-[1.5]" />
                    </div>

                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <div className="space-y-0.5">
                          <h3 className="font-extrabold text-base text-background-900 dark:text-white">
                            {doc.name}
                          </h3>
                          <span className="text-xs font-bold text-primary dark:text-primary-400">
                            {doc.specialist}
                          </span>
                        </div>
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase border border-emerald-100 dark:border-emerald-900/60 shrink-0">
                          {doc.sector}
                        </span>
                      </div>

                      {doc.rating > 0 && (
                        <div className="flex items-center gap-1 text-background-500 dark:text-background-400 text-xs font-semibold">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="text-background-800 dark:text-white font-bold">{doc.rating.toFixed(1)}</span>
                          <span>({doc.reviews} avis)</span>
                        </div>
                      )}

                      <div className="space-y-1.5 pt-1 text-xs text-background-500 dark:text-background-400 font-medium">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{doc.address}</span>
                        </p>
                        {doc.website && (
                          <p className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <a
                              href={doc.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              {doc.website.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {doc.website
                            ? t('dashboard.pages.evaluation.specialist_visit_site', 'Voir le site')
                            : t('dashboard.pages.evaluation.specialist_take_appt', 'Prendre RDV')}
                        </a>

                        {doc.phone && (
                          <a
                            href={`tel:${doc.phone}`}
                            className="p-2.5 bg-background-50 hover:bg-background-100 dark:bg-background-800 dark:hover:bg-background-700 text-background-500 dark:text-background-400 rounded-xl transition-colors cursor-pointer"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Real Leaflet Map */}
        <div className="lg:col-span-5 h-[50vh] lg:h-auto min-h-[350px]">
          <div className="border border-background-200 dark:border-background-800 rounded-2xl shadow-xs overflow-hidden relative h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <DoctorMap
                doctors={doctors}
                selectedDoctor={selectedDoctor}
                userCoords={userCoords}
                onSelectDoctor={setSelectedDoctor}
              />
            </div>

            {/* Selected doctor drawer */}
            {selectedDoctor && (
              <div className="bg-white dark:bg-background-900 border-t border-background-200 dark:border-background-800 p-4 shrink-0">
                <div className="flex justify-between items-center gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold text-primary block uppercase tracking-widest">
                      {t('dashboard.pages.evaluation.specialist_selected_badge', 'Sélectionné')}
                    </span>
                    <h4 className="font-extrabold text-sm text-background-950 dark:text-white truncate">
                      {selectedDoctor.name}
                    </h4>
                    <p className="text-xs text-background-500 dark:text-background-400 truncate">
                      {selectedDoctor.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedDoctor.website && (
                      <a
                        href={selectedDoctor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary hover:bg-primary-700 text-white font-bold p-3 rounded-xl transition-colors shadow-sm"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {selectedDoctor.phone && (
                      <a
                        href={`tel:${selectedDoctor.phone}`}
                        className="bg-background-100 hover:bg-background-200 dark:bg-background-800 dark:hover:bg-background-700 text-background-600 dark:text-background-300 font-bold p-3 rounded-xl transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
