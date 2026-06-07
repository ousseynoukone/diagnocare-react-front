import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Save, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getAllSettings, getKnownSettings, updateSetting } from '../../api-s/requests/AdminRequest';
import type { AppSettingDTO, SettingDescriptorDTO } from '../../api-s/requests/AdminRequest';

// Human-readable labels override backend descriptions when available
const SETTING_LABELS: Record<string, { label: string; hint?: string }> = {
  CHECKIN_BASE_URL: {
    label: 'URL de base — Emails de suivi santé',
    hint: 'Ex: https://diagnocare.app',
  },
  CHECKIN_FIRST_REMINDER_MINUTES: {
    label: 'Rappel J+1 — délai (minutes)',
    hint: '1440 = 24h. Valeur faible (ex: 1) pour les tests.',
  },
  CHECKIN_SECOND_REMINDER_MINUTES: {
    label: 'Rappel J+2 — délai (minutes)',
    hint: '2880 = 48h après le check-in J+1.',
  },
};

interface MergedSetting {
  key: string;
  savedValue: string;       // what's in the DB (empty string if not saved yet)
  defaultValue: string;     // from known descriptor
  description: string;
}

function SettingRow({ setting, onSave }: { setting: MergedSetting; onSave: (key: string, value: string) => void }) {
  const [value, setValue] = useState(setting.savedValue);
  const meta = SETTING_LABELS[setting.key];
  const isDirty = value !== setting.savedValue;

  useEffect(() => {
    setValue(setting.savedValue);
  }, [setting.savedValue]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {meta?.label ?? setting.key}
          </h3>
          {!setting.savedValue && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
              Non configuré
            </span>
          )}
          {isDirty && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
              Non sauvegardé
            </span>
          )}
        </div>
        <p className="text-xs font-mono text-slate-400">{setting.key}</p>
        {setting.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
            {setting.description}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={meta?.hint ?? setting.defaultValue ?? 'Valeur'}
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
        />
        <button
          onClick={() => onSave(setting.key, value)}
          disabled={!isDirty || !value.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
        >
          <Save className="h-4 w-4" />
          Sauvegarder
        </button>
      </div>

      {setting.defaultValue && !setting.savedValue && (
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <span className="font-medium">Valeur par défaut :</span>
          <span className="font-mono">{setting.defaultValue}</span>
        </p>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const qc = useQueryClient();

  const { data: saved = [], isLoading: loadingSaved, refetch } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getAllSettings,
  });

  const { data: known = [], isLoading: loadingKnown } = useQuery({
    queryKey: ['admin-settings-known'],
    queryFn: getKnownSettings,
    staleTime: Infinity,
  });

  const isLoading = loadingSaved || loadingKnown;

  // Merge: every known setting appears, pre-filled with saved value if it exists
  const savedMap = new Map<string, AppSettingDTO>(saved.map((s) => [s.key, s]));
  const mergedSettings: MergedSetting[] = known.map((descriptor: SettingDescriptorDTO) => ({
    key: descriptor.key,
    savedValue: savedMap.get(descriptor.key)?.value ?? '',
    defaultValue: descriptor.defaultValue ?? '',
    description: descriptor.description ?? '',
  }));

  // Also show any saved settings that aren't in the known list (custom/future keys)
  const knownKeys = new Set(known.map((d: SettingDescriptorDTO) => d.key));
  const unknownSaved: MergedSetting[] = saved
    .filter((s) => !knownKeys.has(s.key))
    .map((s) => ({ key: s.key, savedValue: s.value, defaultValue: '', description: '' }));

  const allSettings = [...mergedSettings, ...unknownSaved];

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => updateSetting(key, value),
    onSuccess: (_, variables) => {
      toast.success(`Paramètre "${variables.key}" mis à jour`);
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => toast.error('Impossible de mettre à jour ce paramètre'),
  });

  const handleSave = (key: string, value: string) => {
    updateMutation.mutate({ key, value });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-500" />
            Paramètres système
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configuration globale de la plateforme DiagnoCare.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-violet-500 dark:border-slate-800 dark:border-t-violet-500" />
        </div>
      ) : allSettings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Settings className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">Aucun paramètre disponible</p>
          <p className="text-xs mt-1 text-slate-300 dark:text-slate-600">Le backend ne définit aucun paramètre connu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allSettings.map((s) => (
            <SettingRow key={s.key} setting={s} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
