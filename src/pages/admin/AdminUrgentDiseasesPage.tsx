import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ShieldAlert, RefreshCw, Search, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  getUrgentDiseases,
  addUrgentDisease,
  deleteUrgentDisease,
  getMLDiseasesMetadata,
} from '../../api-s/requests/AdminRequest';

interface MergedDisease {
  key: string;       // snake_case id (for dedup/filtering only)
  enLabel: string;   // what gets stored — matches ML prediction output via case-insensitive
  frLabel: string;   // display label in UI
}

function DiseaseSearchInput({
  value,
  onChange,
  diseases,
  alreadyAdded,
}: {
  value: MergedDisease | null;
  onChange: (d: MergedDisease | null) => void;
  diseases: MergedDisease[];
  alreadyAdded: Set<string>;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = diseases.filter((d) => {
    if (alreadyAdded.has(d.enLabel.toLowerCase())) return false;
    const q = query.toLowerCase();
    return d.frLabel.toLowerCase().includes(q) || d.enLabel.toLowerCase().includes(q);
  });

  const handleSelect = (d: MergedDisease) => {
    onChange(d);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-1">
      <div
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl cursor-text transition-all ${
          open
            ? 'border-violet-500 ring-2 ring-violet-500/20'
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        {value && !open ? (
          <div className="flex-1 flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value.frLabel}</span>
              <span className="text-xs text-slate-400 ml-2">({value.enLabel})</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <input
              autoFocus={open}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Rechercher une maladie…"
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
            />
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </>
        )}
      </div>

      {open && (
        <div className="absolute z-20 top-full mt-1.5 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-400 text-center">
              {query ? 'Aucune maladie correspondante' : 'Toutes les maladies sont déjà ajoutées'}
            </div>
          ) : (
            filtered.map((d) => (
              <button
                key={d.key}
                onClick={() => handleSelect(d)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-left cursor-pointer group"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-violet-700 dark:group-hover:text-violet-300">
                  {d.frLabel}
                </span>
                <span className="text-xs text-slate-400 ml-3 shrink-0">{d.enLabel}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminUrgentDiseasesPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<MergedDisease | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const { data: diseases = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-urgent-diseases'],
    queryFn: getUrgentDiseases,
  });

  const { data: mlMeta, isLoading: loadingMeta } = useQuery({
    queryKey: ['ml-diseases-metadata'],
    queryFn: getMLDiseasesMetadata,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: addUrgentDisease,
    onSuccess: () => {
      toast.success('Maladie urgente ajoutée');
      qc.invalidateQueries({ queryKey: ['admin-urgent-diseases'] });
      setSelected(null);
    },
    onError: () => toast.error("Impossible d'ajouter cette maladie"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUrgentDisease,
    onSuccess: () => {
      toast.success('Maladie urgente supprimée');
      qc.invalidateQueries({ queryKey: ['admin-urgent-diseases'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Impossible de supprimer cette maladie'),
  });

  const enList = mlMeta?.diseases?.en ?? [];
  const frList = mlMeta?.diseases?.fr ?? [];
  const mlDiseases: MergedDisease[] = enList.map((en) => {
    const fr = frList.find((f) => f.key === en.key);
    return { key: en.key, enLabel: en.label, frLabel: fr?.label ?? en.label };
  });

  const alreadyAdded = new Set(diseases.map((d) => d.diseaseName.toLowerCase()));

  const handleAdd = () => {
    if (!selected) return;
    addMutation.mutate(selected.enLabel);
  };

  // For display: find the French label for a stored disease name (case-insensitive)
  const getDisplayLabel = (diseaseName: string) => {
    const match = mlDiseases.find((d) => d.enLabel.toLowerCase() === diseaseName.toLowerCase());
    return match ? match.frLabel : null;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-violet-500" />
            Maladies urgentes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ces maladies déclenchent une alerte rouge lors de la prédiction.
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

      {/* Add form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Ajouter une maladie
        </h2>
        <div className="flex gap-3">
          {loadingMeta ? (
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-200 border-t-violet-500" />
              <span className="text-sm text-slate-400">Chargement des maladies ML…</span>
            </div>
          ) : (
            <DiseaseSearchInput
              value={selected}
              onChange={setSelected}
              diseases={mlDiseases}
              alreadyAdded={alreadyAdded}
            />
          )}
          <button
            onClick={handleAdd}
            disabled={addMutation.isPending || !selected}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            {addMutation.isPending ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>
        {selected && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="text-violet-500 font-bold">Valeur stockée :</span>
            <span className="font-medium">{selected.enLabel}</span>
            <span className="text-slate-400">— comparée aux résultats ML (insensible à la casse).</span>
          </p>
        )}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-violet-500 dark:border-slate-800 dark:border-t-violet-500" />
          </div>
        ) : diseases.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ShieldAlert className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Aucune maladie urgente configurée</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {diseases.map((d) => {
              const frLabel = getDisplayLabel(d.diseaseName);
              return (
                <li key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                    <div className="min-w-0">
                      {frLabel && (
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {frLabel}
                        </p>
                      )}
                      <p className={`truncate ${frLabel ? 'text-xs text-slate-400' : 'text-sm font-semibold text-slate-800 dark:text-slate-200'}`}>
                        {d.diseaseName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-xs text-slate-400 font-mono">#{d.id}</span>
                    <button
                      onClick={() => setDeleteTarget(d.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/40 rounded-xl">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Supprimer la maladie</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {diseases.find((d) => d.id === deleteTarget)?.diseaseName}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                Annuler
              </button>
              <button onClick={() => deleteMutation.mutate(deleteTarget)} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer">
                {deleteMutation.isPending ? 'Suppression…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
