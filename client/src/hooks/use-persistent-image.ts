import { useState, useEffect } from 'react';

interface UsePersistentImageOptions {
  src: string;
  autoRepair?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UsePersistentImageReturn {
  currentSrc: string;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
  repair: () => Promise<void>;
}

export const usePersistentImage = ({
  src,
  autoRepair = true,
  retryAttempts = 3,
  retryDelay = 2000
}: UsePersistentImageOptions): UsePersistentImageReturn => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
    setAttemptCount(0);
  }, [src]);

  const retry = () => {
    if (attemptCount < retryAttempts) {
      const newSrc = `${src}?retry=${Date.now()}-${attemptCount + 1}`;
      setCurrentSrc(newSrc);
      setHasError(false);
      setIsLoading(true);
      setAttemptCount(prev => prev + 1);
    }
  };

  const repair = async (): Promise<void> => {
    try {
      console.log('[UsePersistentImage] Triggering storage repair...');
      
      const response = await fetch('/api/storage/repair', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('[UsePersistentImage] Storage repair completed');
        
        // Wait a bit for repair to complete, then retry
        setTimeout(() => {
          retry();
        }, retryDelay);
      } else {
        console.warn('[UsePersistentImage] Storage repair failed');
      }
    } catch (error) {
      console.error('[UsePersistentImage] Storage repair error:', error);
    }
  };

  const handleImageError = () => {
    console.warn(`[UsePersistentImage] Image load failed: ${currentSrc}`);
    setIsLoading(false);
    setHasError(true);

    if (autoRepair && attemptCount === 0 && currentSrc.includes('/uploads/products/')) {
      // Trigger automatic repair on first failure
      repair();
    } else if (attemptCount < retryAttempts) {
      // Automatic retry without repair
      setTimeout(retry, retryDelay);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Create image element to test loading
  useEffect(() => {
    if (!currentSrc) return;

    const img = new Image();
    img.onload = handleImageLoad;
    img.onerror = handleImageError;
    img.src = currentSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentSrc]);

  return {
    currentSrc,
    isLoading,
    hasError: hasError && attemptCount >= retryAttempts,
    retry,
    repair
  };
};