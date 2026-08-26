import { ArrowRepeat } from 'react-bootstrap-icons';
import { useLoading } from '../context/LoadingContext';

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay" role="status" aria-label="Carregando">
      <div className="loading-indicator">
        <ArrowRepeat className="loading-icon" size={24} aria-hidden="true" />
        <span>Carregando</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
