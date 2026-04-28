import { useState } from 'react';
import { BuilderElement, DeviceMode } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Palette, Layout, Type, Image, Link } from 'lucide-react';

interface ElementSettingsProps {
  element: BuilderElement;
  onUpdate: (updates: Partial<BuilderElement>) => void;
  deviceMode: DeviceMode;
}

export function ElementSettings({ element, onUpdate, deviceMode }: ElementSettingsProps) {
  const currentStyles = element.styles[deviceMode] || element.styles.desktop || {};

  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: {
        ...element.content,
        [key]: value
      }
    });
  };

  const updateStyle = (key: string, value: string) => {
    onUpdate({
      styles: {
        ...element.styles,
        [deviceMode]: {
          ...currentStyles,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-4">
        Configurações - {element.type}
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <ContentSettings element={element} onUpdate={updateContent} />
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <StyleSettings 
            currentStyles={currentStyles}
            onUpdate={updateStyle}
            deviceMode={deviceMode}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedSettings element={element} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentSettings({ element, onUpdate }: { element: BuilderElement; onUpdate: (key: string, value: any) => void }) {
  switch (element.type) {
    case 'text':
      return (
        <div className="space-y-3">
          <div>
            <Label>Texto</Label>
            <Textarea
              value={element.content.text || ''}
              onChange={(e) => onUpdate('text', e.target.value)}
              placeholder="Digite seu texto aqui"
            />
          </div>
        </div>
      );

    case 'heading':
      return (
        <div className="space-y-3">
          <div>
            <Label>Texto do Título</Label>
            <Input
              value={element.content.text || ''}
              onChange={(e) => onUpdate('text', e.target.value)}
              placeholder="Seu título aqui"
            />
          </div>
          <div>
            <Label>Nível do Título</Label>
            <Select value={element.content.level || 'h2'} onValueChange={(value) => onUpdate('level', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1</SelectItem>
                <SelectItem value="h2">H2</SelectItem>
                <SelectItem value="h3">H3</SelectItem>
                <SelectItem value="h4">H4</SelectItem>
                <SelectItem value="h5">H5</SelectItem>
                <SelectItem value="h6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-3">
          <div>
            <Label>URL da Imagem</Label>
            <Input
              value={element.content.src || ''}
              onChange={(e) => onUpdate('src', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div>
            <Label>Texto Alternativo</Label>
            <Input
              value={element.content.alt || ''}
              onChange={(e) => onUpdate('alt', e.target.value)}
              placeholder="Descrição da imagem"
            />
          </div>
          <div>
            <Label>Ajuste da Imagem</Label>
            <Select value={element.content.objectFit || 'cover'} onValueChange={(value) => onUpdate('objectFit', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cobrir</SelectItem>
                <SelectItem value="contain">Conter</SelectItem>
                <SelectItem value="fill">Preencher</SelectItem>
                <SelectItem value="none">Nenhum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-3">
          <div>
            <Label>Texto do Botão</Label>
            <Input
              value={element.content.text || ''}
              onChange={(e) => onUpdate('text', e.target.value)}
              placeholder="Clique aqui"
            />
          </div>
          <div>
            <Label>Link</Label>
            <Input
              value={element.content.link || ''}
              onChange={(e) => onUpdate('link', e.target.value)}
              placeholder="https://exemplo.com"
            />
          </div>
          <div>
            <Label>Abrir em</Label>
            <Select value={element.content.target || '_self'} onValueChange={(value) => onUpdate('target', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Mesma janela</SelectItem>
                <SelectItem value="_blank">Nova janela</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Estilo do Botão</Label>
            <Select value={element.content.style || 'primary'} onValueChange={(value) => onUpdate('style', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primário</SelectItem>
                <SelectItem value="secondary">Secundário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div className="space-y-3">
          <div>
            <Label>Altura (px)</Label>
            <Slider
              value={[element.content.height || 50]}
              onValueChange={([value]) => onUpdate('height', value)}
              min={10}
              max={200}
              step={5}
            />
            <div className="text-sm text-gray-500 mt-1">{element.content.height || 50}px</div>
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="space-y-3">
          <div>
            <Label>Estilo da Linha</Label>
            <Select value={element.content.style || 'solid'} onValueChange={(value) => onUpdate('style', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Sólida</SelectItem>
                <SelectItem value="dashed">Tracejada</SelectItem>
                <SelectItem value="dotted">Pontilhada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cor</Label>
            <Input
              type="color"
              value={element.content.color || '#e5e7eb'}
              onChange={(e) => onUpdate('color', e.target.value)}
            />
          </div>
          <div>
            <Label>Espessura (px)</Label>
            <Slider
              value={[element.content.thickness || 1]}
              onValueChange={([value]) => onUpdate('thickness', value)}
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>
      );

    case 'columns':
      return (
        <div className="space-y-3">
          <div>
            <Label>Número de Colunas</Label>
            <Slider
              value={[element.content.columns || 2]}
              onValueChange={([value]) => onUpdate('columns', value)}
              min={1}
              max={6}
              step={1}
            />
            <div className="text-sm text-gray-500 mt-1">{element.content.columns || 2} colunas</div>
          </div>
          <div>
            <Label>Espaçamento</Label>
            <Input
              value={element.content.gap || '24px'}
              onChange={(e) => onUpdate('gap', e.target.value)}
              placeholder="24px"
            />
          </div>
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-3">
          <div>
            <Label>Título Principal</Label>
            <Input
              value={element.content.title || ''}
              onChange={(e) => onUpdate('title', e.target.value)}
              placeholder="Título Principal"
            />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={element.content.subtitle || ''}
              onChange={(e) => onUpdate('subtitle', e.target.value)}
              placeholder="Subtítulo descritivo"
            />
          </div>
          <div>
            <Label>Imagem de Fundo</Label>
            <Input
              value={element.content.backgroundImage || ''}
              onChange={(e) => onUpdate('backgroundImage', e.target.value)}
              placeholder="https://exemplo.com/fundo.jpg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={element.content.overlay}
              onCheckedChange={(checked) => onUpdate('overlay', checked)}
            />
            <Label>Sobreposição escura</Label>
          </div>
          {element.content.overlay && (
            <div>
              <Label>Opacidade da Sobreposição</Label>
              <Slider
                value={[element.content.overlayOpacity || 0.5]}
                onValueChange={([value]) => onUpdate('overlayOpacity', value)}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          )}
          <div>
            <Label>Texto do Botão CTA</Label>
            <Input
              value={element.content.ctaText || ''}
              onChange={(e) => onUpdate('ctaText', e.target.value)}
              placeholder="Saiba Mais"
            />
          </div>
          <div>
            <Label>Link do CTA</Label>
            <Input
              value={element.content.ctaLink || ''}
              onChange={(e) => onUpdate('ctaLink', e.target.value)}
              placeholder="https://exemplo.com"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          Configurações de conteúdo não disponíveis para este elemento.
        </div>
      );
  }
}

function StyleSettings({ 
  currentStyles, 
  onUpdate, 
  deviceMode 
}: { 
  currentStyles: any; 
  onUpdate: (key: string, value: string) => void;
  deviceMode: DeviceMode;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Configurações para {deviceMode === 'desktop' ? 'Desktop' : deviceMode === 'tablet' ? 'Tablet' : 'Mobile'}
      </div>

      {/* Spacing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Espaçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Margem</Label>
              <Input
                value={currentStyles.margin || ''}
                onChange={(e) => onUpdate('margin', e.target.value)}
                placeholder="0px"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Padding</Label>
              <Input
                value={currentStyles.padding || ''}
                onChange={(e) => onUpdate('padding', e.target.value)}
                placeholder="16px"
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Cor do Fundo</Label>
              <Input
                type="color"
                value={currentStyles.backgroundColor || '#ffffff'}
                onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Cor do Texto</Label>
              <Input
                type="color"
                value={currentStyles.color || '#000000'}
                onChange={(e) => onUpdate('color', e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Type className="h-4 w-4" />
            Tipografia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Tamanho da Fonte</Label>
            <Input
              value={currentStyles.fontSize || ''}
              onChange={(e) => onUpdate('fontSize', e.target.value)}
              placeholder="16px"
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Peso da Fonte</Label>
            <Select value={currentStyles.fontWeight || 'normal'} onValueChange={(value) => onUpdate('fontWeight', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Negrito</SelectItem>
                <SelectItem value="500">Médio</SelectItem>
                <SelectItem value="600">Semi-negrito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Alinhamento</Label>
            <Select value={currentStyles.textAlign || 'left'} onValueChange={(value) => onUpdate('textAlign', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
                <SelectItem value="justify">Justificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dimensions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dimensões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Largura</Label>
              <Input
                value={currentStyles.width || ''}
                onChange={(e) => onUpdate('width', e.target.value)}
                placeholder="auto"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Altura</Label>
              <Input
                value={currentStyles.height || ''}
                onChange={(e) => onUpdate('height', e.target.value)}
                placeholder="auto"
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Border & Effects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Bordas & Efeitos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Borda</Label>
            <Input
              value={currentStyles.border || ''}
              onChange={(e) => onUpdate('border', e.target.value)}
              placeholder="1px solid #e5e7eb"
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Raio da Borda</Label>
            <Input
              value={currentStyles.borderRadius || ''}
              onChange={(e) => onUpdate('borderRadius', e.target.value)}
              placeholder="8px"
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Sombra</Label>
            <Input
              value={currentStyles.boxShadow || ''}
              onChange={(e) => onUpdate('boxShadow', e.target.value)}
              placeholder="0 1px 3px rgba(0,0,0,0.1)"
              className="h-8"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdvancedSettings({ element, onUpdate }: { element: BuilderElement; onUpdate: (updates: Partial<BuilderElement>) => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Animações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Tipo de Animação</Label>
            <Select 
              value={element.animation?.type || 'none'} 
              onValueChange={(value) => onUpdate({
                animation: { 
                  type: value as any,
                  duration: element.animation?.duration || 300,
                  delay: element.animation?.delay || 0
                }
              })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="fadeIn">Aparecer</SelectItem>
                <SelectItem value="slideIn">Deslizar</SelectItem>
                <SelectItem value="zoomIn">Zoom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {element.animation?.type && element.animation.type !== 'none' && (
            <>
              <div>
                <Label className="text-xs">Duração (ms)</Label>
                <Input
                  type="number"
                  value={element.animation?.duration || 300}
                  onChange={(e) => onUpdate({
                    animation: { 
                      type: element.animation?.type || 'none',
                      duration: parseInt(e.target.value),
                      delay: element.animation?.delay || 0
                    }
                  })}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Atraso (ms)</Label>
                <Input
                  type="number"
                  value={element.animation?.delay || 0}
                  onChange={(e) => onUpdate({
                    animation: { 
                      type: element.animation?.type || 'none',
                      duration: element.animation?.duration || 300,
                      delay: parseInt(e.target.value)
                    }
                  })}
                  className="h-8"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ID e Classes CSS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">ID do Elemento</Label>
            <Input
              value={element.id}
              readOnly
              className="h-8 bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}