import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Filter, Star, Calendar, Phone, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Doctor } from '../../../types/models/Evaluation';

interface SpecialistFinderProps {
  specialist: string;
  doctors: Doctor[];
  onBackToResults: () => void;
}

export default function SpecialistFinder({
  specialist,
  doctors,
  onBackToResults,
}: SpecialistFinderProps) {
  const { t } = useTranslation();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    doctors.length > 0 ? doctors[0] : null
  );

  const formatSlot = (slot: string) => {
    if (slot.startsWith("Aujourd'hui à")) {
      return slot.replace("Aujourd'hui à", t('dashboard.pages.evaluation.specialist_today', "Aujourd'hui à"));
    }
    if (slot.startsWith("Demain à")) {
      return slot.replace("Demain à", t('dashboard.pages.evaluation.specialist_tomorrow', "Demain à"));
    }
    return slot;
  };

  return (
    <div className="space-y-6 animate-fadeIn text-background-800 dark:text-background-100">
      {/* Header Action Buttons */}
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

      {/* Inputs Bar */}
      <div className="bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Specialist Input */}
          <div className="flex items-center bg-background-50 dark:bg-background-900/40 border border-background-100 dark:border-background-800/80 rounded-xl px-3.5 py-2.5">
            <Search className="h-4 w-4 text-background-400 mr-2 shrink-0" />
            <input 
              type="text" 
              defaultValue={specialist}
              className="w-full bg-transparent border-none text-sm font-semibold text-background-900 dark:text-white focus:outline-none"
              placeholder={t('dashboard.pages.evaluation.specialist_placeholder', 'Spécialité')} 
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center bg-background-50 dark:bg-background-900/40 border border-background-100 dark:border-background-800/80 rounded-xl px-3.5 py-2.5">
            <MapPin className="h-4 w-4 text-background-400 mr-2 shrink-0" />
            <input 
              type="text" 
              defaultValue="Paris, 75001"
              className="w-full bg-transparent border-none text-sm font-semibold text-background-900 dark:text-white focus:outline-none"
              placeholder={t('dashboard.pages.evaluation.specialist_location_placeholder', 'Ville ou Code Postal')} 
            />
          </div>
        </div>

        <button className="p-3 bg-background-100 hover:bg-background-200 dark:bg-background-800 dark:hover:bg-background-700 text-background-600 dark:text-background-300 rounded-xl transition-colors cursor-pointer shrink-0">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Double Column Search Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Doctor Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-background-400 tracking-wide uppercase px-1">
            <span>
              {doctors.length === 1 
                ? t('dashboard.pages.evaluation.specialist_results_count_one', '1 résultat à proximité de Paris, 75001')
                : t('dashboard.pages.evaluation.specialist_results_count_plural', { count: doctors.length, defaultValue: '{{count}} résultats à proximité de Paris, 75001' })}
            </span>
            <span>{t('dashboard.pages.evaluation.specialist_sort_by', 'Trié par pertinence')}</span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
            {doctors.map((doc, idx) => {
              const isHovered = selectedDoctor?.name === doc.name;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setSelectedDoctor(doc)}
                  className={`bg-white dark:bg-background-900 border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden flex gap-4 ${
                    isHovered 
                      ? 'border-primary dark:border-primary ring-1 ring-primary/20' 
                      : 'border-background-200 dark:border-background-800'
                  }`}
                >
                  {/* Left: Dummy Image Container */}
                  <div className="w-14 h-14 bg-background-50 dark:bg-background-800 rounded-xl shrink-0 flex items-center justify-center text-background-400">
                    <Activity className="h-6 w-6 stroke-[1.5]" />
                  </div>

                  {/* Right: Info Area */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div className="space-y-0.5">
                        <h3 className="font-extrabold text-base text-background-900 dark:text-white truncate">
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

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-background-500 dark:text-background-400 text-xs font-semibold">
                      <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500 shadow-xs" />
                      <span className="text-background-800 dark:text-white font-bold">{doc.rating}</span>
                      <span>({doc.reviews} {t('dashboard.home.recent_evaluations.view_all') ? 'avis' : 'reviews'})</span>
                    </div>

                    {/* Address & Next Slot */}
                    <div className="space-y-1.5 pt-1 text-xs text-background-500 dark:text-background-400 font-medium">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {doc.address}
                      </p>
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-100/40 dark:border-emerald-900/40">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{t('dashboard.pages.evaluation.specialist_next_appt', 'Prochain rdv :')} <strong className="font-bold">{formatSlot(doc.nextSlot)}</strong></span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          toast.success(`Redirection vers Doctolib pour prendre rendez-vous avec ${doc.name}.`);
                        }}
                        className="flex-1 bg-primary hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {t('dashboard.pages.evaluation.specialist_take_appt', 'Prendre RDV')}
                      </button>
                      
                      <button
                        onClick={() => {
                          toast.info(`Appel au numéro ${doc.phone}.`);
                        }}
                        className="p-2.5 bg-background-50 hover:bg-background-100 dark:bg-background-800 dark:hover:bg-background-700 text-background-500 dark:text-background-400 rounded-xl transition-colors cursor-pointer"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Custom SVG Map View (5 Cols) */}
        <div className="lg:col-span-5 h-[50vh] lg:h-auto min-h-[350px]">
          <div className="bg-background-200 dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-2xl shadow-xs overflow-hidden relative h-full flex flex-col">
            
            {/* Visual SVG Map Representation */}
            <div className="w-full flex-1 relative bg-[#E8F0F8] dark:bg-[#1A263B] select-none overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                {/* Paris Seine River */}
                <path
                  d="M -50,280 Q 120,240 220,180 T 450,110"
                  fill="none"
                  stroke="#A1C6EA"
                  strokeWidth="32"
                  className="dark:stroke-[#2E4260] opacity-80"
                />
                <path
                  d="M -50,280 Q 120,240 220,180 T 450,110"
                  fill="none"
                  stroke="#B8D4EE"
                  strokeWidth="24"
                  className="dark:stroke-[#344C6E] opacity-90"
                />

                {/* Green Parks */}
                <rect x="20" y="300" width="80" height="60" rx="6" fill="#D3EDD0" className="dark:fill-[#2A4232] opacity-75" />
                <rect x="280" y="30" width="100" height="70" rx="8" fill="#D3EDD0" className="dark:fill-[#2A4232] opacity-75" />

                {/* Street Grids */}
                <g stroke="#FCFDFD" strokeWidth="6" className="dark:stroke-[#253249] opacity-90">
                  {/* Horizontal Streets */}
                  <line x1="-50" y1="90" x2="450" y2="90" />
                  <line x1="-50" y1="180" x2="450" y2="180" />
                  <line x1="-50" y1="280" x2="450" y2="280" />

                  {/* Vertical/Diagonal Streets */}
                  <line x1="80" y1="-50" x2="80" y2="450" />
                  <line x1="200" y1="-50" x2="200" y2="450" />
                  <line x1="320" y1="-50" x2="320" y2="450" />
                  <line x1="-50" y1="50" x2="450" y2="250" />
                </g>
                
                {/* Narrower street lines */}
                <g stroke="#FCFDFD" strokeWidth="3" className="dark:stroke-[#2A3951] opacity-70">
                  <line x1="-50" y1="140" x2="450" y2="140" />
                  <line x1="140" y1="-50" x2="140" y2="450" />
                </g>

                {/* Patient Location Indicator (User Center Point) */}
                <circle cx="200" cy="200" r="16" fill="rgba(30, 64, 175, 0.15)" className="animate-ping" />
                <circle cx="200" cy="200" r="8" fill="rgba(30, 64, 175, 0.4)" />
                <circle cx="200" cy="200" r="4" fill="#1E40AF" />

                {/* Doctor Pins */}
                {doctors.map((doc, idx) => {
                  const isHovered = selectedDoctor?.name === doc.name;
                  return (
                    <g 
                      key={idx}
                      className="cursor-pointer transition-all duration-300 transform hover:scale-110"
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      {/* Pin Shadow */}
                      <ellipse 
                        cx={doc.coords.x} 
                        cy={doc.coords.y + 12} 
                        rx="6" 
                        ry="2.5" 
                        fill="rgba(0,0,0,0.15)" 
                      />
                      {/* Pin Stem */}
                      <path
                        d={`M ${doc.coords.x} ${doc.coords.y + 12} L ${doc.coords.x - 3} ${doc.coords.y + 4} A 6 6 0 0 1 ${doc.coords.x + 3} ${doc.coords.y + 4} Z`}
                        fill={isHovered ? '#DC2626' : '#1E40AF'}
                      />
                      {/* Pin Top Bubble */}
                      <circle 
                        cx={doc.coords.x} 
                        cy={doc.coords.y} 
                        r="11" 
                        fill={isHovered ? '#DC2626' : '#1E40AF'} 
                        stroke="#FFFFFF" 
                        strokeWidth="2.5"
                        className="shadow-lg"
                      />
                      {/* Label number */}
                      <text 
                        x={doc.coords.x} 
                        y={doc.coords.y + 3.5} 
                        fill="#FFFFFF" 
                        fontSize="9.5" 
                        fontWeight="900" 
                        textAnchor="middle"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Top Left Zoom Controls */}
              <div className="absolute top-3 left-3 bg-white dark:bg-background-900 border border-background-200 dark:border-background-800 rounded-lg flex flex-col shadow-sm select-none">
                <button className="w-8 h-8 flex items-center justify-center font-bold text-background-800 dark:text-background-200 hover:bg-background-100 dark:hover:bg-background-800 border-b border-background-200 dark:border-background-800 cursor-pointer text-base">
                  +
                </button>
                <button className="w-8 h-8 flex items-center justify-center font-bold text-background-800 dark:text-background-200 hover:bg-background-100 dark:hover:bg-background-800 cursor-pointer text-lg">
                  −
                </button>
              </div>

              {/* Leaflet Attribution */}
              <div className="absolute bottom-1 right-2 text-[9px] text-background-500 font-semibold bg-white/70 dark:bg-background-950/70 backdrop-blur-xs px-2 py-0.5 rounded-xs select-none">
                Leaflet | © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:underline">OpenStreetMap</a> contributors
              </div>
            </div>

            {/* Selected Doctor Summary Drawer */}
            {selectedDoctor && (
              <div className="bg-white dark:bg-background-900 border-t border-background-200 dark:border-background-800 p-4 shrink-0 transition-all duration-300">
                <div className="flex justify-between items-center gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-primary block uppercase tracking-widest">
                      {t('dashboard.pages.evaluation.specialist_selected_badge', 'Sélectionné')}
                    </span>
                    <h4 className="font-extrabold text-sm text-background-950 dark:text-white">
                      {selectedDoctor.name}
                    </h4>
                    <p className="text-xs text-background-500 dark:text-background-400">
                      {selectedDoctor.address}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      toast.success(`Appel en cours au ${selectedDoctor.phone}`);
                    }}
                    className="bg-primary hover:bg-primary-700 text-white font-bold p-3 rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
