import React from 'react';
import { BuilderElement } from '../types';

interface ElementRendererProps {
  element: BuilderElement;
  isSelected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ElementRenderer({ element, isSelected, onClick, children }: ElementRendererProps) {
  const getElementStyles = () => {
    const styles: React.CSSProperties = {
      ...element.styles?.desktop,
      position: 'relative',
      cursor: 'pointer',
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      outlineOffset: isSelected ? '2px' : '0',
    };

    // Apply animations if present
    if (element.animation && element.animation.type !== 'none') {
      styles.transition = `all ${element.animation.duration}ms ease-in-out`;
      styles.transitionDelay = `${element.animation.delay}ms`;
    }

    return styles;
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return <p>{element.content?.text || 'Text Element'}</p>;
      
      case 'heading':
        const HeadingTag = `h${element.content?.level || 1}` as keyof JSX.IntrinsicElements;
        return <HeadingTag>{element.content?.text || 'Heading'}</HeadingTag>;
      
      case 'button':
        return (
          <button type="button">
            {element.content?.text || 'Button'}
          </button>
        );
      
      case 'image':
        return (
          <img 
            src={element.content?.src || 'https://via.placeholder.com/300x200'} 
            alt={element.content?.alt || 'Image'} 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        );
      
      case 'container':
        return (
          <div className="min-h-[50px] border-2 border-dashed border-gray-300 p-4">
            {children || <span className="text-gray-500">Container - Drop elements here</span>}
          </div>
        );
      
      case 'columns':
        return (
          <div className="min-h-[50px] border border-gray-200 p-2">
            {children || <span className="text-gray-400 text-sm">Columns</span>}
          </div>
        );
      
      case 'spacer':
        return (
          <div 
            style={{ 
              height: element.content?.height || '20px',
              backgroundColor: isSelected ? '#f3f4f6' : 'transparent'
            }}
          >
            {isSelected && (
              <span className="text-xs text-gray-500">Spacer</span>
            )}
          </div>
        );
      
      case 'divider':
        return (
          <hr 
            style={{
              border: 'none',
              borderTop: `${element.content?.thickness || 1}px solid ${element.content?.color || '#e5e7eb'}`,
              margin: `${element.content?.spacing || 20}px 0`
            }}
          />
        );
      
      default:
        return <div>Unknown Element</div>;
    }
  };

  return (
    <div
      style={getElementStyles()}
      onClick={onClick}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {renderContent()}
    </div>
  );
}