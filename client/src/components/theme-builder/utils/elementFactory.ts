import { BuilderElement, ElementType } from '../types';

export function createElement(type: ElementType, id?: string): BuilderElement {
  const elementId = id || `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const baseElement: BuilderElement = {
    id: elementId,
    type,
    content: {},
    styles: {
      desktop: {},
      tablet: {},
      mobile: {}
    },
    animation: {
      type: 'none',
      duration: 300,
      delay: 0
    },
    children: []
  };

  // Set default content based on element type
  switch (type) {
    case 'text':
      baseElement.content = {
        text: 'New text element'
      };
      baseElement.styles!.desktop = {
        fontSize: '16px',
        color: '#000000',
        lineHeight: '1.5'
      };
      break;

    case 'heading':
      baseElement.content = {
        text: 'New Heading',
        level: 2
      };
      baseElement.styles!.desktop = {
        fontSize: '24px',
        color: '#000000',
        fontWeight: 'bold',
        marginBottom: '16px'
      };
      break;

    case 'button':
      baseElement.content = {
        text: 'Click Me',
        url: '#',
        target: '_self'
      };
      baseElement.styles!.desktop = {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500'
      };
      break;

    case 'image':
      baseElement.content = {
        src: 'https://via.placeholder.com/400x300',
        alt: 'Placeholder image',
        width: '400',
        height: '300'
      };
      baseElement.styles!.desktop = {
        maxWidth: '100%',
        height: 'auto',
        display: 'block'
      };
      break;

    case 'container':
      baseElement.styles!.desktop = {
        padding: '20px',
        border: '2px dashed #e5e7eb',
        borderRadius: '8px',
        minHeight: '100px',
        backgroundColor: '#f9fafb'
      };
      break;

    case 'spacer':
      baseElement.content = {
        height: '20px'
      };
      baseElement.styles!.desktop = {
        height: '20px',
        width: '100%'
      };
      break;

    case 'divider':
      baseElement.content = {
        thickness: 1,
        color: '#e5e7eb',
        spacing: 20
      };
      baseElement.styles!.desktop = {
        border: 'none',
        borderTop: '1px solid #e5e7eb',
        margin: '20px 0',
        width: '100%'
      };
      break;

    default:
      break;
  }

  return baseElement;
}

export function duplicateElement(element: BuilderElement): BuilderElement {
  const newElement = JSON.parse(JSON.stringify(element)) as BuilderElement;
  newElement.id = `${element.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Recursively update IDs for children
  if (newElement.children && newElement.children.length > 0) {
    newElement.children = newElement.children.map(child => duplicateElement(child));
  }
  
  return newElement;
}

export function getElementDefaults(type: ElementType) {
  const element = createElement(type);
  return {
    content: element.content,
    styles: element.styles,
    animation: element.animation
  };
}