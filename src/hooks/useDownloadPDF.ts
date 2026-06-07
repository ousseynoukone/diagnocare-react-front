import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { apiClient } from '../api-s/AxiosApiClient';

export function useDownloadPDF() {
  const { i18n } = useTranslation();
  const isFr = i18n.language.startsWith('fr');

  const downloadPDF = async (predId: string | number) => {
    const toastId = toast.loading(
      isFr ? 'Génération du rapport PDF en cours...' : 'Generating PDF report...'
    );
    try {
      const response = await apiClient.get(`/consultation-summaries/${predId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consultation-summary-${predId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(
        isFr ? 'Rapport PDF téléchargé avec succès !' : 'PDF report downloaded successfully!',
        { id: toastId }
      );
    } catch (error) {
      console.error('Failed to download PDF:', error);
      toast.error(
        isFr ? 'Erreur lors de la génération du PDF.' : 'Error generating PDF report.',
        { id: toastId }
      );
    }
  };

  return { downloadPDF };
}
