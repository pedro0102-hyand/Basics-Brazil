import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onRequestLoadingChange } from '../services/api';

interface LoadingContextType {
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const removeRequest = onRequestLoadingChange((isStarting) => {
      setRequestCount((currentCount) =>
        isStarting ? currentCount + 1 : Math.max(0, currentCount - 1),
      );
    });

    return () => {
      removeRequest();
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading: requestCount > 0 }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
