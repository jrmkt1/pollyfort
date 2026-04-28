import { ReactNode } from 'react';
import { DeviceMode } from '../types';

interface ResponsivePreviewProps {
  deviceMode: DeviceMode;
  children: ReactNode;
}

export function ResponsivePreview({ deviceMode, children }: ResponsivePreviewProps) {
  const getContainerStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return {
          width: '375px',
          minHeight: '667px',
          margin: '0 auto',
          border: '8px solid #1f2937',
          borderRadius: '24px',
          padding: '8px',
          backgroundColor: '#000000',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          position: 'relative' as const,
          overflow: 'hidden'
        };
      case 'tablet':
        return {
          width: '768px',
          minHeight: '1024px',
          margin: '0 auto',
          border: '12px solid #374151',
          borderRadius: '20px',
          padding: '12px',
          backgroundColor: '#1f2937',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          position: 'relative' as const,
          overflow: 'hidden'
        };
      default:
        return {
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          position: 'relative' as const
        };
    }
  };

  const getScreenStyles = () => {
    if (deviceMode === 'desktop') {
      return {
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#ffffff'
      };
    }
    
    return {
      width: '100%',
      minHeight: '100%',
      backgroundColor: '#ffffff',
      borderRadius: deviceMode === 'mobile' ? '16px' : '8px',
      overflow: 'hidden',
      position: 'relative' as const
    };
  };

  if (deviceMode === 'desktop') {
    return (
      <div className="w-full bg-gray-100 p-8">
        <div style={getScreenStyles()}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 p-8 flex justify-center">
      <div style={getContainerStyles()}>
        {/* Device Chrome */}
        {deviceMode === 'mobile' && (
          <>
            {/* Home indicator */}
            <div 
              style={{
                position: 'absolute',
                bottom: '4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '134px',
                height: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '2.5px'
              }}
            />
            {/* Notch */}
            <div
              style={{
                position: 'absolute',
                top: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '24px',
                backgroundColor: '#000000',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                zIndex: 10
              }}
            />
          </>
        )}
        
        <div style={getScreenStyles()}>
          {children}
        </div>
      </div>
    </div>
  );
}