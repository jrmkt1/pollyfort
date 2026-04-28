import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Move, Eye, Settings } from 'lucide-react';
import { BuilderElement, DeviceMode } from '../types';
import { ElementRenderer } from './ElementRenderer';

interface CanvasProps {
  elements: BuilderElement[];
  selectedElement: BuilderElement | null;
  previewMode: boolean;
  onSelectElement: (id: string | null) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deviceMode: DeviceMode;
}

export function Canvas({
  elements,
  selectedElement,
  previewMode,
  onSelectElement,
  onDeleteElement,
  onDuplicateElement,
  onUpdateElement,
  deviceMode
}: CanvasProps) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('element-type');
    if (elementType) {
      // Handle dropping new elements from library
      // This would be implemented in the parent component
    }
  };

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewMode) {
      onSelectElement(elementId);
    }
  };

  const handleCanvasClick = () => {
    if (!previewMode) {
      onSelectElement(null);
    }
  };

  return (
    <div 
      ref={canvasRef}
      className="min-h-full bg-white relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
    >
      {/* Canvas Content */}
      <div className={`transition-all duration-300 ${
        deviceMode === 'mobile' ? 'max-w-sm mx-auto' :
        deviceMode === 'tablet' ? 'max-w-3xl mx-auto' :
        'w-full'
      }`}>
        {elements.length === 0 ? (
          <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg m-8">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
              <p className="text-sm">Arraste elementos da biblioteca para começar a construir sua página</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {elements.map((element) => (
              <ElementWrapper
                key={element.id}
                element={element}
                isSelected={selectedElement?.id === element.id}
                previewMode={previewMode}
                deviceMode={deviceMode}
                onClick={(e) => handleElementClick(element.id, e)}
                onDelete={() => onDeleteElement(element.id)}
                onDuplicate={() => onDuplicateElement(element.id)}
                onUpdate={(updates) => onUpdateElement(element.id, updates)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selection Overlay */}
      {selectedElement && !previewMode && (
        <ElementControls
          element={selectedElement}
          onDelete={() => onDeleteElement(selectedElement.id)}
          onDuplicate={() => onDuplicateElement(selectedElement.id)}
          onSettings={() => {/* Settings panel would open */}}
        />
      )}
    </div>
  );
}

interface ElementWrapperProps {
  element: BuilderElement;
  isSelected: boolean;
  previewMode: boolean;
  deviceMode: DeviceMode;
  onClick: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (updates: Partial<BuilderElement>) => void;
}

function ElementWrapper({
  element,
  isSelected,
  previewMode,
  deviceMode,
  onClick,
  onDelete,
  onDuplicate,
  onUpdate
}: ElementWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative transition-all duration-200 ${
        !previewMode ? 'hover:ring-2 hover:ring-blue-300' : ''
      } ${
        isSelected && !previewMode ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ElementRenderer 
        element={element} 
        deviceMode={deviceMode}
        onUpdate={onUpdate}
      />

      {/* Element Label (only in edit mode) */}
      {!previewMode && (isSelected || isHovered) && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-md z-10">
          {element.type}
        </div>
      )}
    </div>
  );
}

interface ElementControlsProps {
  element: BuilderElement;
  onDelete: () => void;
  onDuplicate: () => void;
  onSettings: () => void;
}

function ElementControls({ element, onDelete, onDuplicate, onSettings }: ElementControlsProps) {
  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={onSettings}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onDuplicate}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}