export type ElementType = 
  | 'text' 
  | 'heading' 
  | 'image' 
  | 'button' 
  | 'spacer' 
  | 'divider' 
  | 'container' 
  | 'columns'
  | 'hero'
  | 'card'
  | 'list'
  | 'navbar'
  | 'footer'
  | 'gallery'
  | 'form'
  | 'video'
  | 'icon';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveStyles {
  desktop?: CSSStyles;
  tablet?: CSSStyles;
  mobile?: CSSStyles;
}

export interface CSSStyles {
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  borderRadius?: string;
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRight?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  minWidth?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  boxShadow?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  cursor?: string;
  overflow?: string;
  textDecoration?: string;
  letterSpacing?: string;
  wordSpacing?: string;
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  content: any;
  styles: ResponsiveStyles;
  children?: BuilderElement[];
  parentId?: string;
  animation?: {
    type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'none';
    duration: number;
    delay: number;
  };
  interactions?: {
    hover?: CSSStyles;
    click?: {
      action: 'scroll' | 'modal' | 'link' | 'custom';
      target?: string;
    };
  };
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  children?: MenuItem[];
  target?: '_blank' | '_self';
  megaMenu?: boolean;
  description?: string;
}

export interface MenuConfig {
  id: string;
  name: string;
  items: MenuItem[];
  styles: {
    backgroundColor?: string;
    textColor?: string;
    hoverColor?: string;
    fontSize?: string;
    fontWeight?: string;
    spacing?: string;
    alignment?: 'left' | 'center' | 'right';
    mobileBreakpoint?: string;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'landing' | 'business' | 'portfolio' | 'blog' | 'ecommerce' | 'custom';
  thumbnail: string;
  elements: BuilderElement[];
  menus: MenuConfig[];
  globalStyles: {
    fonts: string[];
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  meta: {
    createdAt: string;
    updatedAt: string;
    version: string;
    author?: string;
  };
}

export interface BuilderState {
  elements: BuilderElement[];
  selectedElementId: string | null;
  menus: MenuConfig[];
  selectedMenuId: string | null;
  previewMode: boolean;
  deviceMode: DeviceMode;
  undoStack: BuilderElement[][];
  redoStack: BuilderElement[][];
  globalStyles: Template['globalStyles'];
}

export interface ElementDefinition {
  type: ElementType;
  label: string;
  icon: React.ComponentType<any>;
  category: 'layout' | 'content' | 'media' | 'forms' | 'navigation';
  defaultContent: any;
  defaultStyles: ResponsiveStyles;
  isContainer?: boolean;
}