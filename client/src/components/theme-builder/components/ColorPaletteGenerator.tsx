import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Wand2, 
  Copy, 
  Download,
  RefreshCw,
  Eye,
  Heart,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  mood: string;
  category: string;
}

interface ColorHarmony {
  name: string;
  description: string;
  colors: string[];
}

export function ColorPaletteGenerator() {
  const { toast } = useToast();
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [selectedMood, setSelectedMood] = useState('professional');
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorPalette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);

  const moods = [
    { value: 'professional', label: 'Profissional', description: 'Cores sóbrias e confiáveis' },
    { value: 'creative', label: 'Criativo', description: 'Cores vibrantes e inspiradoras' },
    { value: 'minimal', label: 'Minimalista', description: 'Cores neutras e elegantes' },
    { value: 'energetic', label: 'Energético', description: 'Cores vivas e estimulantes' },
    { value: 'calm', label: 'Calmo', description: 'Cores suaves e relaxantes' },
    { value: 'luxury', label: 'Luxo', description: 'Cores sofisticadas e premium' }
  ];

  const categories = [
    { value: 'business', label: 'Negócios' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'portfolio', label: 'Portfólio' },
    { value: 'blog', label: 'Blog' },
    { value: 'technology', label: 'Tecnologia' },
    { value: 'healthcare', label: 'Saúde' },
    { value: 'education', label: 'Educação' },
    { value: 'food', label: 'Alimentação' },
    { value: 'fashion', label: 'Moda' },
    { value: 'travel', label: 'Viagem' }
  ];

  // Color harmony algorithms
  const generateColorHarmonies = (baseHex: string): ColorHarmony[] => {
    const hsl = hexToHsl(baseHex);
    
    return [
      {
        name: 'Monocromática',
        description: 'Variações da mesma cor',
        colors: [
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10)),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 20)),
          baseHex,
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 80)),
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 90))
        ]
      },
      {
        name: 'Análoga',
        description: 'Cores adjacentes na roda de cores',
        colors: [
          hslToHex((hsl.h - 30) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h - 15) % 360, hsl.s, hsl.l),
          baseHex,
          hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
        ]
      },
      {
        name: 'Complementar',
        description: 'Cores opostas na roda de cores',
        colors: [
          baseHex,
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(hsl.s - 20, 20), hsl.l),
          hslToHex((hsl.h + 180) % 360, Math.max(hsl.s - 20, 20), hsl.l),
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 90))
        ]
      },
      {
        name: 'Tríade',
        description: 'Três cores igualmente espaçadas',
        colors: [
          baseHex,
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(hsl.s - 30, 20), Math.min(hsl.l + 20, 90)),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10))
        ]
      },
      {
        name: 'Tetrádica',
        description: 'Quatro cores em dois pares complementares',
        colors: [
          baseHex,
          hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, Math.max(hsl.s - 20, 30), Math.min(hsl.l + 10, 85))
        ]
      }
    ];
  };

  // AI-powered palette generation based on mood and category
  const generateSmartPalettes = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const harmonies = generateColorHarmonies(baseColor);
      const newPalettes: ColorPalette[] = [];

      harmonies.forEach((harmony, index) => {
        const palette = createPaletteFromHarmony(harmony, selectedMood, selectedCategory, index);
        newPalettes.push(palette);
      });

      // Add mood-specific adjustments
      const adjustedPalettes = newPalettes.map(palette => 
        adjustPaletteForMood(palette, selectedMood)
      );

      setGeneratedPalettes(adjustedPalettes);
      
      toast({
        title: "Paletas geradas com sucesso!",
        description: `${adjustedPalettes.length} paletas criadas para o mood "${moods.find(m => m.value === selectedMood)?.label}"`
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar paletas",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const createPaletteFromHarmony = (harmony: ColorHarmony, mood: string, category: string, index: number): ColorPalette => {
    const colors = harmony.colors;
    
    return {
      id: `${harmony.name.toLowerCase()}-${index}-${Date.now()}`,
      name: `${harmony.name} ${mood === 'professional' ? 'Pro' : mood === 'creative' ? 'Art' : mood === 'minimal' ? 'Min' : mood.charAt(0).toUpperCase() + mood.slice(1)}`,
      colors: {
        primary: colors[0],
        secondary: colors[1],
        accent: colors[2],
        background: adjustColorForBackground(colors[4], mood),
        surface: adjustColorForSurface(colors[3], mood),
        text: getTextColor(colors[4]),
        textSecondary: getSecondaryTextColor(colors[4])
      },
      mood,
      category
    };
  };

  const adjustPaletteForMood = (palette: ColorPalette, mood: string): ColorPalette => {
    const adjustments = {
      professional: { saturation: -10, lightness: 5 },
      creative: { saturation: 15, lightness: 0 },
      minimal: { saturation: -20, lightness: 10 },
      energetic: { saturation: 20, lightness: -5 },
      calm: { saturation: -15, lightness: 15 },
      luxury: { saturation: -5, lightness: -10 }
    };

    const adjustment = adjustments[mood as keyof typeof adjustments] || { saturation: 0, lightness: 0 };
    
    return {
      ...palette,
      colors: {
        ...palette.colors,
        primary: adjustColor(palette.colors.primary, adjustment.saturation, adjustment.lightness),
        secondary: adjustColor(palette.colors.secondary, adjustment.saturation, adjustment.lightness),
        accent: adjustColor(palette.colors.accent, adjustment.saturation, adjustment.lightness)
      }
    };
  };

  const adjustColorForBackground = (color: string, mood: string): string => {
    const hsl = hexToHsl(color);
    switch (mood) {
      case 'minimal':
        return hslToHex(hsl.h, Math.max(hsl.s - 40, 5), Math.min(hsl.l + 40, 95));
      case 'luxury':
        return hslToHex(hsl.h, Math.max(hsl.s - 20, 10), Math.max(hsl.l - 20, 15));
      default:
        return hslToHex(hsl.h, Math.max(hsl.s - 30, 10), Math.min(hsl.l + 30, 90));
    }
  };

  const adjustColorForSurface = (color: string, mood: string): string => {
    const hsl = hexToHsl(color);
    return hslToHex(hsl.h, Math.max(hsl.s - 20, 15), Math.min(hsl.l + 20, 85));
  };

  const getTextColor = (backgroundColor: string): string => {
    const hsl = hexToHsl(backgroundColor);
    return hsl.l > 50 ? '#1f2937' : '#f9fafb';
  };

  const getSecondaryTextColor = (backgroundColor: string): string => {
    const hsl = hexToHsl(backgroundColor);
    return hsl.l > 50 ? '#6b7280' : '#d1d5db';
  };

  const adjustColor = (hex: string, saturationDelta: number, lightnessDelta: number): string => {
    const hsl = hexToHsl(hex);
    return hslToHex(
      hsl.h,
      Math.max(0, Math.min(100, hsl.s + saturationDelta)),
      Math.max(0, Math.min(100, hsl.l + lightnessDelta))
    );
  };

  // Color conversion utilities
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} copiado!`,
      description: text
    });
  };

  const savePalette = (palette: ColorPalette) => {
    const updated = [...savedPalettes, { ...palette, id: `saved-${Date.now()}` }];
    setSavedPalettes(updated);
    localStorage.setItem('colorPalettes', JSON.stringify(updated));
    
    toast({
      title: "Paleta salva!",
      description: `"${palette.name}" foi adicionada aos favoritos`
    });
  };

  const exportPalette = (palette: ColorPalette) => {
    const cssVars = Object.entries(palette.colors)
      .map(([key, value]) => `  --color-${key}: ${value};`)
      .join('\n');
    
    const css = `:root {\n${cssVars}\n}`;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${palette.name.toLowerCase().replace(/\s+/g, '-')}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load saved palettes on mount
  useEffect(() => {
    const saved = localStorage.getItem('colorPalettes');
    if (saved) {
      setSavedPalettes(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Gerador de Paletas Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="baseColor">Cor Base</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="baseColor"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Mood</Label>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moods.map(mood => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <div>
                        <div className="font-medium">{mood.label}</div>
                        <div className="text-sm text-gray-500">{mood.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateSmartPalettes}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando paletas inteligentes...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Paletas com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="generated" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generated">Geradas ({generatedPalettes.length})</TabsTrigger>
          <TabsTrigger value="saved">Favoritas ({savedPalettes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generated" className="space-y-4">
          {generatedPalettes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Configure suas preferências e clique em "Gerar Paletas com IA" para começar</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {generatedPalettes.map(palette => (
                <PaletteCard 
                  key={palette.id} 
                  palette={palette} 
                  onSave={savePalette}
                  onExport={exportPalette}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedPalettes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Suas paletas favoritas aparecerão aqui</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {savedPalettes.map(palette => (
                <PaletteCard 
                  key={palette.id} 
                  palette={palette} 
                  onExport={exportPalette}
                  onCopy={copyToClipboard}
                  isSaved
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PaletteCardProps {
  palette: ColorPalette;
  onSave?: (palette: ColorPalette) => void;
  onExport: (palette: ColorPalette) => void;
  onCopy: (text: string, label: string) => void;
  isSaved?: boolean;
}

function PaletteCard({ palette, onSave, onExport, onCopy, isSaved }: PaletteCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{palette.name}</CardTitle>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {palette.mood}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {palette.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Preview */}
        <div className="grid grid-cols-7 gap-1 h-16 rounded-lg overflow-hidden">
          {Object.entries(palette.colors).map(([name, color]) => (
            <div
              key={name}
              className="cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onCopy(color, name)}
              title={`${name}: ${color}`}
            />
          ))}
        </div>

        {/* Color Values */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(palette.colors).map(([name, color]) => (
            <div 
              key={name} 
              className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => onCopy(color, name)}
            >
              <span className="font-medium capitalize">{name}</span>
              <span className="text-gray-600">{color}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isSaved && onSave && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onSave(palette)}
              className="flex-1"
            >
              <Heart className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onExport(palette)}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            CSS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}