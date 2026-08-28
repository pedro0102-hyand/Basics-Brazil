import { ArrowRepeat } from 'react-bootstrap-icons';
import { useLoading } from '../context/LoadingContext';
import { useLanguage } from '../context/LanguageContext';

const LoadingOverlay = () => {
  const { isLoading } = useLoading();
  const { t } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay" role="status" aria-label={t('loading')}>
      <div className="loading-indicator">
        <ArrowRepeat className="loading-icon" size={24} aria-hidden="true" />
        <span>{t('loading')}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
