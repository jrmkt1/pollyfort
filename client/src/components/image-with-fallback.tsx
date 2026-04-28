import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/api/placeholder/300/200',
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    console.warn(`[ImageWithFallback] Failed to load image: ${currentSrc}`);
    setHasError(true);
    setIsLoading(false);
    
    if (onError) {
      onError();
    }

    // Try to repair the image by triggering storage repair
    if (currentSrc.includes('/uploads/products/')) {
      const filename = currentSrc.split('/').pop();
      if (filename) {
        fetch('/api/storage/repair', { method: 'POST' })
          .then(() => {
            console.log('[ImageWithFallback] Storage repair triggered');
            // Retry loading the image after a short delay
            setTimeout(() => {
              const retryUrl = `${currentSrc}?retry=${Date.now()}`;
              setCurrentSrc(retryUrl);
              setHasError(false);
              setIsLoading(true);
            }, 2000);
          })
          .catch((error) => {
            console.warn('[ImageWithFallback] Storage repair failed:', error);
          });
      }
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-widest uppercase">
            IMAGEM EM BREVE
          </div>
          <button 
            onClick={() => {
              setCurrentSrc(`${src}?reload=${Date.now()}`);
              setHasError(false);
              setIsLoading(true);
            }}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-bold tracking-widest uppercase">
            Carregando...
          </div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};