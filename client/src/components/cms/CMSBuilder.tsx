import { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Image, 
  Layout, 
  Monitor, 
  Smartphone, 
  Tablet,
  Plus,
  Save,
  Eye,
  Settings,
  Trash2,
  Move,
  Copy,
  Layers,
  Palette,
  Grid,
  Columns,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Quote,
  Video,
  Music,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Camera,
  Play,
  Download,
  Upload,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { ColorPaletteGenerator } from '../theme-builder/components/ColorPaletteGenerator';

// Types for CMS elements
interface CMSElement {
  id: string;
  type: ElementType;
  content: any;
  styles: ElementStyles;
  settings: ElementSettings;
  children?: CMSElement[];
  parentId?: string;
}

type ElementType = 
  | 'section' | 'container' | 'row' | 'column'
  | 'heading' | 'text' | 'image' | 'button' | 'spacer'
  | 'video' | 'audio' | 'gallery' | 'slider' | 'carousel'
  | 'form' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  | 'list' | 'table' | 'tabs' | 'accordion' | 'modal'
  | 'icon' | 'divider' | 'map' | 'social' | 'testimonial'
  | 'pricing' | 'counter' | 'progress' | 'timeline'
  | 'blog' | 'portfolio' | 'team' | 'contact' | 'newsletter';

interface ElementStyles {
  // Layout
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  display?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Typography
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  color?: string;
  
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  
  // Border
  border?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  
  // Effects
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  filter?: string;
  
  // Flexbox
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  gap?: string;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  gridColumn?: string;
  gridRow?: string;
  
  // Custom properties
  [key: string]: string | undefined;
}

interface ElementSettings {
  id?: string;
  className?: string;
  animation?: {
    type: string;
    duration: number;
    delay: number;
    repeat: boolean;
  };
  responsive?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
  };
  seo?: {
    alt?: string;
    title?: string;
    description?: string;
  };
  advanced?: {
    customCSS?: string;
    customHTML?: string;
    customJS?: string;
  };
}

// Element library configuration
const ELEMENT_CATEGORIES = [
  {
    id: 'basic',
    name: 'Básicos',
    elements: [
      { type: 'heading', name: 'Título', icon: Type },
      { type: 'text', name: 'Texto', icon: Type },
      { type: 'image', name: 'Imagem', icon: Image },
      { type: 'button', name: 'Botão', icon: Layout },
      { type: 'spacer', name: 'Espaçador', icon: Layout },
      { type: 'divider', name: 'Divisória', icon: Layout }
    ]
  },
  {
    id: 'layout',
    name: 'Layout',
    elements: [
      { type: 'section', name: 'Seção', icon: Grid },
      { type: 'container', name: 'Container', icon: Layout },
      { type: 'row', name: 'Linha', icon: Columns },
      { type: 'column', name: 'Coluna', icon: Columns }
    ]
  },
  {
    id: 'media',
    name: 'Mídia',
    elements: [
      { type: 'video', name: 'Vídeo', icon: Video },
      { type: 'audio', name: 'Áudio', icon: Music },
      { type: 'gallery', name: 'Galeria', icon: Image },
      { type: 'slider', name: 'Slider', icon: Image },
      { type: 'carousel', name: 'Carrossel', icon: Image }
    ]
  },
  {
    id: 'forms',
    name: 'Formulários',
    elements: [
      { type: 'form', name: 'Formulário', icon: Layout },
      { type: 'input', name: 'Campo de Texto', icon: Type },
      { type: 'textarea', name: 'Área de Texto', icon: Type },
      { type: 'select', name: 'Seleção', icon: ChevronDown },
      { type: 'checkbox', name: 'Checkbox', icon: Layout },
      { type: 'radio', name: 'Radio', icon: Layout }
    ]
  },
  {
    id: 'advanced',
    name: 'Avançados',
    elements: [
      { type: 'tabs', name: 'Abas', icon: Layout },
      { type: 'accordion', name: 'Acordeão', icon: ChevronDown },
      { type: 'modal', name: 'Modal', icon: Layout },
      { type: 'map', name: 'Mapa', icon: MapPin },
      { type: 'social', name: 'Redes Sociais', icon: Heart },
      { type: 'testimonial', name: 'Depoimento', icon: Quote }
    ]
  },
  {
    id: 'business',
    name: 'Negócios',
    elements: [
      { type: 'pricing', name: 'Preços', icon: ShoppingCart },
      { type: 'counter', name: 'Contador', icon: Star },
      { type: 'progress', name: 'Progresso', icon: Layout },
      { type: 'timeline', name: 'Timeline', icon: Clock },
      { type: 'team', name: 'Equipe', icon: User },
      { type: 'contact', name: 'Contato', icon: Phone }
    ]
  }
];

export default function CMSBuilder() {
  const [elements, setElements] = useState<CMSElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CMSElement | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activePanel, setActivePanel] = useState<'elements' | 'colors' | 'settings'>('elements');
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [canvasMode, setCanvasMode] = useState<'design' | 'preview'>('design');
  const [history, setHistory] = useState<CMSElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState({
    id: '',
    title: 'Nova Página',
    slug: '',
    status: 'draft',
    content: '',
    seoTitle: '',
    seoDescription: '',
    customCSS: '',
    customJS: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Drag and Drop functionality
  const moveElement = useCallback((dragIndex: number, dropIndex: number) => {
    setElements(prev => {
      const newElements = [...prev];
      const [draggedElement] = newElements.splice(dragIndex, 1);
      newElements.splice(dropIndex, 0, draggedElement);
      return newElements;
    });
  }, []);

  // Add element to canvas
  const addElement = (type: ElementType) => {
    const newElement: CMSElement = {
      id: `${type}_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      settings: getDefaultSettings(type)
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    saveToHistory();
  };

  // Get default content for element type
  const getDefaultContent = (type: ElementType): any => {
    switch (type) {
      case 'heading': return { text: 'Título Principal', level: 1 };
      case 'text': return { text: 'Este é um parágrafo de exemplo. Você pode editar este texto para adicionar seu próprio conteúdo.' };
      case 'button': return { text: 'Clique Aqui', link: '#', action: 'link' };
      case 'image': return { src: 'https://via.placeholder.com/400x300', alt: 'Imagem', caption: '' };
      case 'video': return { src: '', poster: '', autoplay: false, controls: true };
      case 'section': return { tag: 'section', fullWidth: true };
      case 'container': return { maxWidth: '1200px', centered: true };
      case 'row': return { columns: 2, gap: '20px' };
      case 'column': return { width: 'auto', offset: 0 };
      case 'spacer': return { height: '40px' };
      case 'divider': return { style: 'solid', width: '100%', color: '#e5e5e5' };
      case 'form': return { action: '', method: 'POST', fields: [] };
      case 'input': return { type: 'text', placeholder: 'Digite aqui...', required: false };
      case 'textarea': return { placeholder: 'Digite sua mensagem...', rows: 4 };
      case 'select': return { options: ['Opção 1', 'Opção 2', 'Opção 3'] };
      default: return {};
    }
  };

  // Get default styles for element type
  const getDefaultStyles = (type: ElementType): ElementStyles => {
    const baseStyles: ElementStyles = {
      margin: '0',
      padding: '0'
    };

    switch (type) {
      case 'heading':
        return { ...baseStyles, fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '16px' };
      case 'text':
        return { ...baseStyles, fontSize: '16px', lineHeight: '1.6', color: '#333333', marginBottom: '16px' };
      case 'button':
        return { 
          ...baseStyles, 
          backgroundColor: '#3b82f6', 
          color: '#ffffff', 
          padding: '12px 24px', 
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'inline-block',
          textAlign: 'center',
          textDecoration: 'none'
        };
      case 'image':
        return { ...baseStyles, width: '100%', height: 'auto', borderRadius: '8px' };
      case 'section':
        return { 
          ...baseStyles, 
          width: '100%', 
          padding: '60px 0',
          backgroundColor: '#ffffff'
        };
      case 'container':
        return { 
          ...baseStyles, 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '0 20px'
        };
      case 'row':
        return { 
          ...baseStyles, 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '20px'
        };
      case 'column':
        return { 
          ...baseStyles, 
          flex: '1',
          minWidth: '250px'
        };
      case 'spacer':
        return { ...baseStyles, height: '40px', width: '100%' };
      case 'divider':
        return { 
          ...baseStyles, 
          height: '1px', 
          backgroundColor: '#e5e5e5',
          width: '100%',
          margin: '20px 0'
        };
      default:
        return baseStyles;
    }
  };

  // Get default settings for element type
  const getDefaultSettings = (type: ElementType): ElementSettings => {
    return {
      animation: {
        type: 'none',
        duration: 300,
        delay: 0,
        repeat: false
      },
      responsive: {
        hideOnMobile: false,
        hideOnTablet: false,
        hideOnDesktop: false
      },
      seo: {},
      advanced: {}
    };
  };

  // Save current state to history
  const saveToHistory = () => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...elements]);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  // Save page as draft
  const savePage = async () => {
    setIsSaving(true);
    try {
      const pageData = {
        ...currentPage,
        content: JSON.stringify(elements),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/cms/pages', {
        method: currentPage.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar página');
      }

      const savedPage = await response.json();
      setCurrentPage(prev => ({ ...prev, ...savedPage }));
      
      alert('Página salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar página:', error);
      alert('Erro ao salvar página. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update page cache and navigation
  const updatePageCache = async (page: any) => {
    try {
      // Atualizar localStorage com a nova página
      const existingPages = JSON.parse(localStorage.getItem('publishedPages') || '[]');
      const pageIndex = existingPages.findIndex((p: any) => p.id === page.id);
      
      if (pageIndex >= 0) {
        existingPages[pageIndex] = page;
      } else {
        existingPages.push(page);
      }
      
      localStorage.setItem('publishedPages', JSON.stringify(existingPages));
      
      // Disparar evento customizado para notificar outros componentes
      window.dispatchEvent(new CustomEvent('pagePublished', { 
        detail: { page, action: pageIndex >= 0 ? 'updated' : 'created' }
      }));
      
      // Atualizar navegação se a página estiver marcada para aparecer no menu
      if (page.showInNavigation !== false) {
        updateNavigationMenu(page);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar cache da página:', error);
    }
  };

  // Update navigation menu
  const updateNavigationMenu = (page: any) => {
    try {
      const existingNav = JSON.parse(localStorage.getItem('navigationMenu') || '[]');
      const navItem = {
        id: page.id,
        title: page.title,
        slug: page.slug,
        url: `/${page.slug}`,
        type: 'page',
        order: existingNav.length,
        createdAt: page.createdAt || new Date().toISOString()
      };
      
      const itemIndex = existingNav.findIndex((item: any) => item.id === page.id);
      
      if (itemIndex >= 0) {
        existingNav[itemIndex] = navItem;
      } else {
        existingNav.push(navItem);
      }
      
      localStorage.setItem('navigationMenu', JSON.stringify(existingNav));
      
      // Disparar evento para atualizar o header
      window.dispatchEvent(new CustomEvent('navigationUpdated', { detail: existingNav }));
      
    } catch (error) {
      console.error('Erro ao atualizar menu de navegação:', error);
    }
  };

  // Delete published page
  const deletePage = async (pageId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir página');
      }

      // Remover do cache local
      const existingPages = JSON.parse(localStorage.getItem('publishedPages') || '[]');
      const updatedPages = existingPages.filter((p: any) => p.id !== pageId);
      localStorage.setItem('publishedPages', JSON.stringify(updatedPages));

      // Remover do menu de navegação
      const existingNav = JSON.parse(localStorage.getItem('navigationMenu') || '[]');
      const updatedNav = existingNav.filter((item: any) => item.id !== pageId);
      localStorage.setItem('navigationMenu', JSON.stringify(updatedNav));

      // Disparar eventos para atualizar outros componentes
      window.dispatchEvent(new CustomEvent('pageDeleted', { detail: { pageId } }));
      window.dispatchEvent(new CustomEvent('navigationUpdated', { detail: updatedNav }));

      alert('Página excluída com sucesso!');
      
      // Se estamos editando a página que foi excluída, criar nova página
      if (currentPage.id === pageId) {
        setCurrentPage({
          id: '',
          title: '',
          slug: '',
          description: '',
          status: 'draft',
          showInNavigation: true
        });
        setElements([]);
        setHistory([[]]);
        setHistoryIndex(0);
      }

    } catch (error) {
      console.error('Erro ao excluir página:', error);
      alert('Erro ao excluir página. Tente novamente.');
    }
  };

  // Publish page
  const publishPage = async () => {
    setIsPublishing(true);
    try {
      const pageData = {
        ...currentPage,
        content: JSON.stringify(elements),
        status: 'published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/cms/pages', {
        method: currentPage.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) {
        throw new Error('Erro ao publicar página');
      }

      const publishedPage = await response.json();
      setCurrentPage(prev => ({ ...prev, ...publishedPage, status: 'published' }));
      
      // Atualizar cache e notificar outros componentes
      await updatePageCache(publishedPage);
      
      alert(`Página "${publishedPage.title}" publicada com sucesso! Agora está disponível na seção Páginas e no menu de navegação.`);
    } catch (error) {
      console.error('Erro ao publicar página:', error);
      alert('Erro ao publicar página. Tente novamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Generate page slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Update page settings
  const updatePageSettings = (updates: Partial<typeof currentPage>) => {
    setCurrentPage(prev => {
      const newPage = { ...prev, ...updates };
      
      if (updates.title && !prev.slug) {
        newPage.slug = generateSlug(updates.title);
      }
      
      return newPage;
    });
  };

  // Undo/Redo functionality
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Update element
  const updateElement = (id: string, updates: Partial<CMSElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Delete element
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    saveToHistory();
  };

  // Duplicate element
  const duplicateElement = (element: CMSElement) => {
    const newElement: CMSElement = {
      ...element,
      id: `${element.type}_${Date.now()}`
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    saveToHistory();
  };

  // Get device width for responsive preview
  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full bg-gray-50">
        {/* Left Sidebar - Elements & Settings */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Tabs value={activePanel} onValueChange={(value: any) => setActivePanel(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="elements">Elementos</TabsTrigger>
                <TabsTrigger value="colors">Cores</TabsTrigger>
                <TabsTrigger value="settings">Config</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {activePanel === 'elements' && (
                <ElementsPanel 
                  categories={ELEMENT_CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  onAddElement={addElement}
                />
              )}

              {activePanel === 'colors' && (
                <div className="h-[calc(100vh-20rem)]">
                  <ColorPaletteGenerator />
                </div>
              )}

              {activePanel === 'settings' && (
                <PageSettingsPanel 
                  currentPage={currentPage}
                  onUpdatePage={updatePageSettings}
                  onDeletePage={deletePage}
                />
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Device Mode Selector */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Canvas Mode Selector */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={canvasMode === 'design' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCanvasMode('design')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Design
                </Button>
                <Button
                  variant={canvasMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCanvasMode('preview')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* History Controls */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  ↶ Desfazer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  ↷ Refazer
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={currentPage.title}
                onChange={(e) => updatePageSettings({ title: e.target.value })}
                placeholder="Título da página"
                className="w-48"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={savePage}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button 
                size="sm"
                onClick={publishPage}
                disabled={isPublishing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isPublishing ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4 bg-gray-100 overflow-auto">
            <div className="flex justify-center">
              <div 
                className="bg-white shadow-lg transition-all duration-300 min-h-[600px]"
                style={{ 
                  width: getDeviceWidth(),
                  maxWidth: '100%'
                }}
              >
                <Canvas 
                  elements={elements}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  onMoveElement={moveElement}
                  mode={canvasMode}
                  deviceMode={deviceMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200">
          <PropertiesPanel 
            selectedElement={selectedElement}
            onUpdateElement={updateElement}
            deviceMode={deviceMode}
          />
        </div>
      </div>
    </DndProvider>
  );
}

// Components for different panels
function ElementsPanel({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onAddElement 
}: {
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddElement: (type: ElementType) => void;
}) {
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Categorias</h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="text-xs"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {currentCategory && (
        <div>
          <h3 className="font-semibold mb-3">{currentCategory.name}</h3>
          <div className="space-y-2">
            {currentCategory.elements.map((element: any) => {
              const IconComponent = element.icon;
              return (
                <Button
                  key={element.type}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => onAddElement(element.type)}
                >
                  <IconComponent className="h-4 w-4" />
                  {element.name}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement, 
  onDuplicateElement 
}: {
  selectedElement: CMSElement | null;
  onUpdateElement: (id: string, updates: Partial<CMSElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: CMSElement) => void;
}) {
  if (!selectedElement) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Selecione um elemento para ver as configurações</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicateElement(selectedElement)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteElement(selectedElement.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
          <TabsTrigger value="responsive">Responsivo</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Content editing based on element type */}
          <ContentEditor 
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedSettings 
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        </TabsContent>

        <TabsContent value="responsive" className="space-y-4">
          <ResponsiveSettings 
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PropertiesPanel({ 
  selectedElement, 
  onUpdateElement, 
  deviceMode 
}: {
  selectedElement: CMSElement | null;
  onUpdateElement: (id: string, updates: Partial<CMSElement>) => void;
  deviceMode: string;
}) {
  if (!selectedElement) {
    return (
      <div className="p-4">
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Selecione um elemento para editar propriedades</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Propriedades de Estilo</h3>
        <Badge variant="outline">{deviceMode}</Badge>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <StyleEditor 
          element={selectedElement}
          onUpdate={(styles) => onUpdateElement(selectedElement.id, { styles })}
          deviceMode={deviceMode}
        />
      </ScrollArea>
    </div>
  );
}

// Page Settings Panel
function PageSettingsPanel({ currentPage, onUpdatePage, onDeletePage }: {
  currentPage: any;
  onUpdatePage: (updates: any) => void;
  onDeletePage?: (pageId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Configurações da Página</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            value={currentPage.title}
            onChange={(e) => onUpdatePage({ title: e.target.value })}
            placeholder="Título da página"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <Input
            value={currentPage.slug}
            onChange={(e) => onUpdatePage({ slug: e.target.value })}
            placeholder="url-da-pagina"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL amigável para a página
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={currentPage.status}
            onValueChange={(value) => onUpdatePage({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="private">Privado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">SEO</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Título SEO</label>
              <Input
                value={currentPage.seoTitle}
                onChange={(e) => onUpdatePage({ seoTitle: e.target.value })}
                placeholder="Título para motores de busca"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição SEO</label>
              <Textarea
                value={currentPage.seoDescription}
                onChange={(e) => onUpdatePage({ seoDescription: e.target.value })}
                placeholder="Descrição para motores de busca"
                rows={3}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Botão de exclusão para páginas publicadas */}
        {currentPage.id && currentPage.status === 'published' && onDeletePage && (
          <div>
            <h4 className="font-medium mb-2 text-red-600">Zona de Perigo</h4>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onDeletePage(currentPage.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Página Publicada
            </Button>
            <p className="text-xs text-red-500 mt-1">
              Esta ação não pode ser desfeita e removerá a página do site e do menu de navegação.
            </p>
          </div>
        )}

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Código Personalizado</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">CSS Personalizado</label>
              <Textarea
                value={currentPage.customCSS}
                onChange={(e) => onUpdatePage({ customCSS: e.target.value })}
                placeholder="/* Seu CSS personalizado aqui */"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">JavaScript Personalizado</label>
              <Textarea
                value={currentPage.customJS}
                onChange={(e) => onUpdatePage({ customJS: e.target.value })}
                placeholder="// Seu JavaScript personalizado aqui"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Editor for elements
function ContentEditor({ element, onUpdate }: { 
  element: CMSElement; 
  onUpdate: (updates: Partial<CMSElement>) => void; 
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Editor de conteúdo para {element.type}</p>
      {/* Implementation specific to each element type */}
    </div>
  );
}

function AdvancedSettings({ element, onUpdate }: { 
  element: CMSElement; 
  onUpdate: (updates: Partial<CMSElement>) => void; 
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Configurações avançadas</p>
      {/* Animation, SEO, Custom CSS/JS settings */}
    </div>
  );
}

function ResponsiveSettings({ element, onUpdate }: { 
  element: CMSElement; 
  onUpdate: (updates: Partial<CMSElement>) => void; 
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Configurações responsivas</p>
      {/* Responsive visibility and breakpoint settings */}
    </div>
  );
}

function StyleEditor({ element, onUpdate, deviceMode }: { 
  element: CMSElement; 
  onUpdate: (styles: ElementStyles) => void; 
  deviceMode: string; 
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Editor de estilos para {deviceMode}</p>
      {/* Comprehensive style editing interface */}
    </div>
  );
}

function Canvas({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onMoveElement, 
  mode, 
  deviceMode 
}: {
  elements: CMSElement[];
  selectedElement: CMSElement | null;
  onSelectElement: (element: CMSElement | null) => void;
  onMoveElement: (dragIndex: number, dropIndex: number) => void;
  mode: string;
  deviceMode: string;
}) {
  if (elements.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500 p-8">
        <div className="text-center">
          <Grid className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
          <p>Arraste elementos da biblioteca para começar a criar sua página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {elements.map((element, index) => (
        <CanvasElement
          key={element.id}
          element={element}
          index={index}
          isSelected={selectedElement?.id === element.id}
          onSelect={() => onSelectElement(element)}
          onMove={onMoveElement}
          mode={mode}
        />
      ))}
    </div>
  );
}

function CanvasElement({ 
  element, 
  index, 
  isSelected, 
  onSelect, 
  onMove, 
  mode 
}: {
  element: CMSElement;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (dragIndex: number, dropIndex: number) => void;
  mode: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: 'element',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    }
  });

  drag(drop(ref));

  const renderElementContent = () => {
    switch (element.type) {
      case 'heading':
        return (
          <div style={element.styles as React.CSSProperties}>
            {element.content.text || 'Título'}
          </div>
        );
      case 'text':
        return (
          <div style={element.styles as React.CSSProperties}>
            {element.content.text || 'Texto'}
          </div>
        );
      case 'button':
        return (
          <button style={element.styles as React.CSSProperties}>
            {element.content.text || 'Botão'}
          </button>
        );
      case 'image':
        return (
          <img 
            src={element.content.src || 'https://via.placeholder.com/400x300'} 
            alt={element.content.alt || 'Imagem'}
            style={element.styles as React.CSSProperties}
          />
        );
      case 'section':
        return (
          <section style={element.styles as React.CSSProperties}>
            <div className="text-center py-8 text-gray-400">
              Seção - Arraste elementos aqui
            </div>
          </section>
        );
      case 'container':
        return (
          <div style={element.styles as React.CSSProperties}>
            <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-300">
              Container - Arraste elementos aqui
            </div>
          </div>
        );
      default:
        return (
          <div style={element.styles as React.CSSProperties}>
            {element.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`
        relative transition-all duration-200
        ${mode === 'design' ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {mode === 'design' && isSelected && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded flex items-center gap-2">
          <Move className="h-3 w-3" />
          {element.type}
        </div>
      )}
      
      {renderElementContent()}
    </div>
  );
}