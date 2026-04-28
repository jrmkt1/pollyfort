import { useState, useCallback, useEffect } from 'react';
import { BuilderElement, DeviceMode, MenuItem, MenuConfig, Template } from '../types';
import { createElement } from '../utils/elementFactory';

const MAX_UNDO_STACK = 50;

export function useThemeBuilder() {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [menus, setMenus] = useState<MenuConfig[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [undoStack, setUndoStack] = useState<BuilderElement[][]>([]);
  const [redoStack, setRedoStack] = useState<BuilderElement[][]>([]);

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  // Add to undo stack
  const addToUndoStack = useCallback((newElements: BuilderElement[]) => {
    setUndoStack(prev => {
      const newStack = [elements, ...prev].slice(0, MAX_UNDO_STACK);
      return newStack;
    });
    setRedoStack([]);
    setElements(newElements);
  }, [elements]);

  // Add element
  const addElement = useCallback((type: string, parentId?: string) => {
    const newElement = createElement(type as any);
    
    if (parentId) {
      // Add as child to parent element
      const newElements = elements.map(el => {
        if (el.id === parentId) {
          return {
            ...el,
            children: [...(el.children || []), { ...newElement, parentId }]
          };
        }
        return el;
      });
      addToUndoStack(newElements);
    } else {
      // Add as root element
      addToUndoStack([...elements, newElement]);
    }
    
    setSelectedElementId(newElement.id);
  }, [elements, addToUndoStack]);

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<BuilderElement>) => {
    const updateElementRecursive = (elements: BuilderElement[]): BuilderElement[] => {
      return elements.map(el => {
        if (el.id === id) {
          return { ...el, ...updates };
        }
        if (el.children) {
          return {
            ...el,
            children: updateElementRecursive(el.children)
          };
        }
        return el;
      });
    };

    const newElements = updateElementRecursive(elements);
    addToUndoStack(newElements);
  }, [elements, addToUndoStack]);

  // Delete element
  const deleteElement = useCallback((id: string) => {
    const deleteElementRecursive = (elements: BuilderElement[]): BuilderElement[] => {
      return elements.filter(el => {
        if (el.id === id) return false;
        if (el.children) {
          el.children = deleteElementRecursive(el.children);
        }
        return true;
      });
    };

    const newElements = deleteElementRecursive(elements);
    addToUndoStack(newElements);
    
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [elements, selectedElementId, addToUndoStack]);

  // Duplicate element
  const duplicateElement = useCallback((id: string) => {
    const findAndDuplicateElement = (elements: BuilderElement[]): BuilderElement[] => {
      const newElements = [...elements];
      
      for (let i = 0; i < newElements.length; i++) {
        if (newElements[i].id === id) {
          const duplicated = JSON.parse(JSON.stringify(newElements[i]));
          duplicated.id = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Update IDs recursively for children
          const updateIds = (element: BuilderElement): BuilderElement => {
            element.id = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            if (element.children) {
              element.children = element.children.map(updateIds);
            }
            return element;
          };
          
          updateIds(duplicated);
          newElements.splice(i + 1, 0, duplicated);
          return newElements;
        }
        
        if (newElements[i].children) {
          newElements[i].children = findAndDuplicateElement(newElements[i].children || []);
        }
      }
      
      return newElements;
    };

    const newElements = findAndDuplicateElement(elements);
    addToUndoStack(newElements);
  }, [elements, addToUndoStack]);

  // Select element
  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  // Undo
  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const [previous, ...remainingUndo] = undoStack;
      setRedoStack([elements, ...redoStack]);
      setElements(previous);
      setUndoStack(remainingUndo);
    }
  }, [undoStack, redoStack, elements]);

  // Redo
  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const [next, ...remainingRedo] = redoStack;
      setUndoStack([elements, ...undoStack]);
      setElements(next);
      setRedoStack(remainingRedo);
    }
  }, [redoStack, undoStack, elements]);

  // Move element
  const moveElement = useCallback((dragId: string, hoverId: string, position: 'before' | 'after' | 'inside') => {
    // Implementation for drag and drop reordering
    const newElements = [...elements];
    // Complex logic for moving elements would go here
    addToUndoStack(newElements);
  }, [elements, addToUndoStack]);

  // Template management
  const saveTemplate = useCallback(() => {
    const template: Template = {
      id: `template_${Date.now()}`,
      name: 'Template Personalizado',
      description: 'Template criado no builder',
      category: 'custom',
      thumbnail: '',
      elements,
      menus,
      globalStyles: {
        fonts: ['Inter', 'Roboto'],
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#0ea5e9',
          text: '#1f2937',
          background: '#ffffff'
        },
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px'
        }
      },
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    localStorage.setItem('theme-builder-template', JSON.stringify(template));
    localStorage.setItem('theme-builder-elements', JSON.stringify(elements));
    localStorage.setItem('theme-builder-menus', JSON.stringify(menus));
  }, [elements, menus]);

  const loadTemplate = useCallback((template?: Template) => {
    if (template) {
      setElements(template.elements);
      setMenus(template.menus);
    } else {
      const savedElements = localStorage.getItem('theme-builder-elements');
      const savedMenus = localStorage.getItem('theme-builder-menus');
      
      if (savedElements) {
        setElements(JSON.parse(savedElements));
      }
      if (savedMenus) {
        setMenus(JSON.parse(savedMenus));
      }
    }
  }, []);

  const exportTemplate = useCallback(() => {
    const template: Template = {
      id: `template_${Date.now()}`,
      name: 'Template Exportado',
      description: 'Template criado no Theme Builder',
      category: 'custom',
      thumbnail: '',
      elements,
      menus,
      globalStyles: {
        fonts: ['Inter'],
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#0ea5e9',
          text: '#1f2937',
          background: '#ffffff'
        },
        spacing: {
          xs: '4px',
          sm: '8px', 
          md: '16px',
          lg: '24px',
          xl: '32px'
        }
      },
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }, [elements, menus]);

  const importTemplate = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target?.result as string);
        loadTemplate(template);
      } catch (error) {
        console.error('Erro ao importar template:', error);
      }
    };
    reader.readAsText(file);
  }, [loadTemplate]);

  // Load saved data on mount
  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  return {
    elements,
    selectedElement,
    selectedElementId,
    menus,
    selectedMenuId,
    previewMode,
    deviceMode,
    undoStack,
    redoStack,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    selectElement,
    moveElement,
    setPreviewMode,
    setDeviceMode,
    setSelectedMenuId,
    undo,
    redo,
    saveTemplate,
    loadTemplate,
    exportTemplate,
    importTemplate,
    setMenus
  };
}