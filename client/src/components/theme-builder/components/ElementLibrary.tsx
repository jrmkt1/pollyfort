import { Button } from '@/components/ui/button';
import { 
  Type, 
  Image, 
  Layout, 
  Navigation, 
  Grid,
  Video,
  FileText,
  Star,
  Minus,
  Square,
  Grid3x3,
  MousePointer,
  FileImage,
  MessageSquare,
  Users,
  Mail
} from 'lucide-react';
import { ElementType } from '../types';

interface ElementDefinition {
  type: ElementType;
  label: string;
  icon: React.ComponentType<any>;
  category: 'layout' | 'content' | 'media' | 'forms' | 'navigation';
}

const elements: ElementDefinition[] = [
  // Layout Elements
  { type: 'container', label: 'Container', icon: Square, category: 'layout' },
  { type: 'columns', label: 'Colunas', icon: Grid3x3, category: 'layout' },
  { type: 'spacer', label: 'Espaçador', icon: Layout, category: 'layout' },
  { type: 'divider', label: 'Divisor', icon: Minus, category: 'layout' },

  // Content Elements
  { type: 'text', label: 'Texto', icon: Type, category: 'content' },
  { type: 'heading', label: 'Título', icon: Type, category: 'content' },
  { type: 'button', label: 'Botão', icon: MousePointer, category: 'content' },
  { type: 'list', label: 'Lista', icon: Layout, category: 'content' },
  { type: 'icon', label: 'Ícone', icon: Star, category: 'content' },

  // Media Elements
  { type: 'image', label: 'Imagem', icon: Image, category: 'media' },
  { type: 'video', label: 'Vídeo', icon: Video, category: 'media' },
  { type: 'gallery', label: 'Galeria', icon: FileImage, category: 'media' },

  // Navigation Elements
  { type: 'navbar', label: 'Menu Principal', icon: Navigation, category: 'navigation' },
  { type: 'footer', label: 'Rodapé', icon: Layout, category: 'navigation' },

  // Forms
  { type: 'form', label: 'Formulário', icon: FileText, category: 'forms' },

  // Complex Elements
  { type: 'hero', label: 'Seção Hero', icon: Layout, category: 'layout' },
  { type: 'card', label: 'Card', icon: Layout, category: 'content' },
];

const categories = {
  layout: 'Layout',
  content: 'Conteúdo',
  media: 'Mídia',
  forms: 'Formulários',
  navigation: 'Navegação'
};

interface ElementLibraryProps {
  onAddElement: (type: string) => void;
}

export function ElementLibrary({ onAddElement }: ElementLibraryProps) {
  const groupedElements = elements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, ElementDefinition[]>);

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium text-gray-700 mb-4">
        Arraste elementos para o canvas
      </div>
      
      {Object.entries(groupedElements).map(([category, categoryElements]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {categories[category as keyof typeof categories]}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {categoryElements.map((element) => (
              <Button
                key={element.type}
                variant="outline"
                size="sm"
                className="h-auto flex flex-col items-center gap-2 p-3 text-xs hover:bg-blue-50 hover:border-blue-200"
                onClick={() => onAddElement(element.type)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('element-type', element.type);
                }}
              >
                <element.icon className="h-4 w-4" />
                <span>{element.label}</span>
              </Button>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Dica</h4>
        <p className="text-xs text-gray-600">
          Clique em um elemento para adicioná-lo ao final da página, ou arraste para posicioná-lo onde desejar.
        </p>
      </div>
    </div>
  );
}