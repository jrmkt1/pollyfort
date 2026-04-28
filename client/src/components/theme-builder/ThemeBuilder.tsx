import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Plus, 
  Eye, 
  Code, 
  Save, 
  Download, 
  Upload, 
  Settings,
  Type,
  Image,
  Layout,
  Palette,
  Move,
  Trash2,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  Undo,
  Redo,
  Grid,
  Menu
} from 'lucide-react';
import { ElementLibrary } from './components/ElementLibrary';
import { Canvas } from './components/Canvas';
import { ElementSettings } from './components/ElementSettings';
import { MenuBuilder } from './components/MenuBuilder';
import { TemplateManager } from './components/TemplateManager';
import { ResponsivePreview } from './components/ResponsivePreview';
import { useThemeBuilder } from './hooks/useThemeBuilder';

export default function ThemeBuilder() {
  console.log('ThemeBuilder component loading...');
  
  const {
    elements,
    selectedElement,
    previewMode,
    deviceMode,
    undoStack,
    redoStack,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    selectElement,
    setPreviewMode,
    setDeviceMode,
    undo,
    redo,
    saveTemplate,
    loadTemplate,
    exportTemplate,
    importTemplate
  } = useThemeBuilder();

  const [activeTab, setActiveTab] = useState('elements');
  const [sidebarWidth, setSidebarWidth] = useState(320);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Theme Builder</h1>
          <div className="flex items-center gap-1 ml-4">
            <Button size="sm" variant="ghost" onClick={undo} disabled={undoStack.length === 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={redo} disabled={redoStack.length === 0}>
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Mode Selector */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              size="sm"
              variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setDeviceMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setDeviceMode('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setDeviceMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <Button
            size="sm"
            variant={previewMode ? 'default' : 'outline'}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={saveTemplate}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={exportTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div 
          className="bg-white border-r border-gray-200 flex flex-col"
          style={{ width: sidebarWidth }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="elements">
                <Plus className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="menus">
                <Menu className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="flex-1 p-4">
              <ElementLibrary onAddElement={addElement} />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-4">
              {selectedElement ? (
                <ElementSettings 
                  element={selectedElement} 
                  onUpdate={(updates) => updateElement(selectedElement.id, updates)}
                  deviceMode={deviceMode}
                />
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  Selecione um elemento para configurar
                </div>
              )}
            </TabsContent>

            <TabsContent value="menus" className="flex-1 p-4">
              <MenuBuilder />
            </TabsContent>

            <TabsContent value="templates" className="flex-1 p-4">
              <TemplateManager 
                onLoadTemplate={loadTemplate}
                onImportTemplate={importTemplate}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Resize Handle */}
        <div 
          className="w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = sidebarWidth;

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth + (e.clientX - startX);
              setSidebarWidth(Math.max(280, Math.min(500, newWidth)));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <ResponsivePreview deviceMode={deviceMode}>
            <Canvas
              elements={elements}
              selectedElement={selectedElement}
              previewMode={previewMode}
              onSelectElement={selectElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={duplicateElement}
              onUpdateElement={updateElement}
              deviceMode={deviceMode}
            />
          </ResponsivePreview>
        </div>
      </div>
    </div>
  );
}