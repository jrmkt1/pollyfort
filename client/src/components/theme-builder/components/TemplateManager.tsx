import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  FileText,
  Layout,
  Briefcase,
  User,
  ShoppingCart,
  Palette
} from 'lucide-react';
import { Template } from '../types';

interface TemplateManagerProps {
  onLoadTemplate: (template: Template) => void;
  onImportTemplate: (file: File) => void;
}

export function TemplateManager({ onLoadTemplate, onImportTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'landing-modern',
      name: 'Landing Page Moderna',
      description: 'Template moderno para páginas de destino com hero, recursos e CTA',
      category: 'landing',
      thumbnail: '/templates/landing-modern.jpg',
      elements: [],
      menus: [],
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
        createdAt: '2025-06-17T00:00:00Z',
        updatedAt: '2025-06-17T00:00:00Z',
        version: '1.0.0',
        author: 'Theme Builder'
      }
    },
    {
      id: 'business-corporate',
      name: 'Corporativo Empresarial',
      description: 'Template profissional para empresas e negócios',
      category: 'business',
      thumbnail: '/templates/business-corporate.jpg',
      elements: [],
      menus: [],
      globalStyles: {
        fonts: ['Roboto', 'Open Sans'],
        colors: {
          primary: '#1e40af',
          secondary: '#6b7280',
          accent: '#dc2626',
          text: '#111827',
          background: '#f9fafb'
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
        createdAt: '2025-06-17T00:00:00Z',
        updatedAt: '2025-06-17T00:00:00Z',
        version: '1.0.0',
        author: 'Theme Builder'
      }
    },
    {
      id: 'portfolio-creative',
      name: 'Portfólio Criativo',
      description: 'Template para portfólios de designers e criativos',
      category: 'portfolio',
      thumbnail: '/templates/portfolio-creative.jpg',
      elements: [],
      menus: [],
      globalStyles: {
        fonts: ['Montserrat', 'Source Sans Pro'],
        colors: {
          primary: '#7c3aed',
          secondary: '#a78bfa',
          accent: '#f59e0b',
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
        createdAt: '2025-06-17T00:00:00Z',
        updatedAt: '2025-06-17T00:00:00Z',
        version: '1.0.0',
        author: 'Theme Builder'
      }
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<string>('all');

  const categoryIcons = {
    landing: Layout,
    business: Briefcase,
    portfolio: User,
    blog: FileText,
    ecommerce: ShoppingCart,
    custom: Palette
  };

  const categoryLabels = {
    landing: 'Landing Page',
    business: 'Empresarial',
    portfolio: 'Portfólio',
    blog: 'Blog',
    ecommerce: 'E-commerce',
    custom: 'Personalizado'
  };

  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category === filter);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportTemplate(file);
    }
  };

  const saveCurrentTemplate = () => {
    const savedElements = localStorage.getItem('theme-builder-elements');
    const savedMenus = localStorage.getItem('theme-builder-menus');
    
    if (savedElements) {
      const newTemplate: Template = {
        id: `custom_${Date.now()}`,
        name: `Template ${new Date().toLocaleDateString()}`,
        description: 'Template criado no Theme Builder',
        category: 'custom',
        thumbnail: '',
        elements: JSON.parse(savedElements),
        menus: savedMenus ? JSON.parse(savedMenus) : [],
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
      
      setTemplates([...templates, newTemplate]);
    }
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Gerenciador de Templates</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" />
            Importar
          </Button>
          <Button size="sm" onClick={saveCurrentTemplate}>
            <Download className="h-4 w-4 mr-1" />
            Salvar Atual
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todos
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? 'default' : 'outline'}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-3">
        {filteredTemplates.map((template) => {
          const IconComponent = categoryIcons[template.category] || Palette;
          
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {categoryLabels[template.category]}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            v{template.meta.version}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => onLoadTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {template.category === 'custom' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Color Palette Preview */}
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 mr-2">Cores:</span>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.globalStyles.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.globalStyles.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: template.globalStyles.colors.accent }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layout className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Nenhum template encontrado</p>
          </div>
        )}
      </div>

      {/* Quick Start Templates */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Início Rápido</h4>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            className="justify-start h-auto p-3"
            onClick={() => onLoadTemplate({
              id: 'blank',
              name: 'Página em Branco',
              description: 'Comece do zero',
              category: 'custom',
              thumbnail: '',
              elements: [],
              menus: [],
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
            })}
          >
            <div className="text-left">
              <div className="font-medium text-sm">Página em Branco</div>
              <div className="text-xs text-gray-600">Comece com uma tela limpa</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}