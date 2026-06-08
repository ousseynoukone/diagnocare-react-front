import { apiClient } from '../AxiosApiClient';

// ── Users ─────────────────────────────────────────────────────────────────────
export interface AdminUserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: Array<{ id: number; roleName?: string; name?: string }>;
  emailVerified?: boolean;
  lang?: string;
}

export function getAllUsers(): Promise<AdminUserDTO[]> {
  return apiClient.get('/users').then((r) => r.data.data ?? r.data);
}

export function deleteUser(id: number): Promise<void> {
  return apiClient.delete(`/users/${id}`).then(() => undefined);
}

// ── Predictions ───────────────────────────────────────────────────────────────
export interface AdminPredictionDTO {
  id: number;
  sessionSymptomId?: number;
  bestScore?: number;
  isRedAlert?: boolean;
  createdAt?: string;
  deleted?: boolean;
}

export interface PredictionDetailDTO {
  id: number;
  bestScore?: number;
  isRedAlert?: boolean;
  comment?: string;
  sessionSymptomId?: number;
  previousPredictionId?: number;
  createdAt?: string;
  pdfReportUrl?: string;
}

export interface PathologyResultDTO {
  id: number;
  diseaseScore?: number;
  pathologyName?: string;
  localizedDiseaseName?: string;
  localizedSpecialistLabel?: string;
  doctorSpecialistLabel?: string;
}

export interface SymptomDTO {
  id: number;
  label: string;
}

export interface SessionSymptomDetailDTO {
  id: number;
  userId?: number;
  rawDescription?: string;
  symptoms: SymptomDTO[];
}

export function getAllPredictions(): Promise<AdminPredictionDTO[]> {
  return apiClient.get('/predictions').then((r) => r.data.data ?? r.data);
}

export function getRedAlertPredictions(): Promise<AdminPredictionDTO[]> {
  return apiClient.get('/predictions/red-alerts').then((r) => r.data.data ?? r.data);
}

export function adminDeletePrediction(id: number): Promise<void> {
  return apiClient.delete(`/predictions/${id}`).then(() => undefined);
}

export function getPredictionDetail(id: number): Promise<PredictionDetailDTO> {
  return apiClient.get(`/predictions/${id}`).then((r) => r.data.data ?? r.data);
}

export function getPathologyResults(predictionId: number): Promise<PathologyResultDTO[]> {
  return apiClient.get(`/pathology-results/prediction/${predictionId}`).then((r) => r.data.data ?? r.data);
}

export function getSessionSymptomDetail(id: number): Promise<SessionSymptomDetailDTO> {
  return apiClient.get(`/session-symptoms/${id}`).then((r) => r.data.data ?? r.data);
}

// ── Patient Medical Profile ───────────────────────────────────────────────────
export interface PatientMedicalProfileDTO {
  id?: number;
  userId?: number;
  age?: number;
  gender?: string;
  weight?: number;
  bmi?: number;
  isSmoking?: boolean;
  alcohol?: boolean;
  sedentary?: boolean;
  meanBloodPressure?: number;
  meanCholesterol?: number;
  familyAntecedents?: string[];
}

export function getPatientMedicalProfile(userId: number): Promise<PatientMedicalProfileDTO> {
  return apiClient.get(`/patient-profiles/user/${userId}`).then((r) => r.data.data ?? r.data);
}

// ── Reports ───────────────────────────────────────────────────────────────────
export interface AdminReportDTO {
  id: number;
  title?: string;
  comment?: string;
  reportDate?: string;
  isCorrected?: boolean;
  userId?: number;
  predictionId?: number;
}

export function getUncorrectedReports(): Promise<AdminReportDTO[]> {
  return apiClient.get('/reports/uncorrected').then((r) => r.data.data ?? r.data);
}

export function markReportCorrected(id: number): Promise<void> {
  return apiClient.put(`/reports/${id}/mark-corrected`, {}).then(() => undefined);
}

export function deleteReport(id: number): Promise<void> {
  return apiClient.delete(`/reports/${id}`).then(() => undefined);
}

// ── ML Diseases Metadata ──────────────────────────────────────────────────────
export interface MLDiseaseItem {
  key: string;
  label: string;
}

export interface MLDiseasesMetadata {
  diseases: {
    count: number;
    en: MLDiseaseItem[];
    fr: MLDiseaseItem[];
  };
  languages: string[];
}

export function getMLDiseasesMetadata(): Promise<MLDiseasesMetadata> {
  return apiClient.get('/pathologies/ml-metadata').then((r) => r.data.data ?? r.data);
}

// ── Urgent Diseases ───────────────────────────────────────────────────────────
export interface UrgentDiseaseDTO {
  id: number;
  diseaseName: string;
}

export function getUrgentDiseases(): Promise<UrgentDiseaseDTO[]> {
  return apiClient.get('/urgent-diseases').then((r) => r.data.data ?? r.data);
}

export function addUrgentDisease(diseaseName: string): Promise<UrgentDiseaseDTO> {
  return apiClient.post('/urgent-diseases', { diseaseName }).then((r) => r.data.data ?? r.data);
}

export function deleteUrgentDisease(id: number): Promise<void> {
  return apiClient.delete(`/urgent-diseases/${id}`).then(() => undefined);
}

// ── App Settings ──────────────────────────────────────────────────────────────
export interface AppSettingDTO {
  key: string;
  value: string;
}

export interface SettingDescriptorDTO {
  key: string;
  description: string;
  defaultValue: string;
}

export function getAllSettings(): Promise<AppSettingDTO[]> {
  return apiClient.get('/settings').then((r) => r.data.data ?? r.data);
}

export function getKnownSettings(): Promise<SettingDescriptorDTO[]> {
  return apiClient.get('/settings/known').then((r) => r.data.data ?? r.data);
}

export function updateSetting(key: string, value: string): Promise<string> {
  return apiClient.put(`/settings/${key}`, { value }).then((r) => r.data.data ?? r.data);
}

// ── Admin account creation (SUPER_ADMIN only) ─────────────────────────────────
export interface AdminCreateAccountDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
}

export function createAdminAccount(dto: AdminCreateAccountDTO): Promise<AdminUserDTO> {
  return apiClient.post('/auth/admin-register', dto).then((r) => r.data.data ?? r.data);
}
