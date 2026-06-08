import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import { HomePage } from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import TermsOfServicePage from './pages/legal/TermsOfServicePage'
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'
import { Toaster } from 'sonner'
import DashboardPage from './pages/dashboard/dashboard'
import EvaluationPage from './pages/dashboard/evaluation'
import SuivisPage from './pages/dashboard/suivis'
import HistoriquePage from './pages/dashboard/historique'
import ProfilMedicalPage from './pages/dashboard/profil'
import ParametresPage from './pages/dashboard/parametres'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminPredictionsPage from './pages/admin/AdminPredictionsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminUrgentDiseasesPage from './pages/admin/AdminUrgentDiseasesPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/evaluation" element={<EvaluationPage />} />
          <Route path="/dashboard/suivis" element={<SuivisPage />} />
          <Route path="/dashboard/historique" element={<HistoriquePage />} />
          <Route path="/dashboard/profil" element={<ProfilMedicalPage />} />
          <Route path="/dashboard/parametres" element={<ParametresPage />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/predictions" element={<AdminPredictionsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/urgent-diseases" element={<AdminUrgentDiseasesPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>

      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}

export default App

