import { useState, useRef, useEffect } from "react";
import { Star, Calculator, Eye, ShoppingCart, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
// Removed unused productImage import
import WhatsAppIntegration from "@/components/whatsapp-integration";

interface ProductCardProps {
  product: Product;
  onQuotationClick: (product: Product) => void;
  onDetailsClick: (product: Product) => void;
  viewMode?: "grid" | "list";
  quotationQuantity?: number;
}

export default function ProductCard({ product, onQuotationClick, onDetailsClick, viewMode = "grid", quotationQuantity = 0 }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [imageFailed, setImageFailed] = useState(false);
  const [forceReload, setForceReload] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const ratingStars = Math.round((product.rating || 0) / 10);
  
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Listen for image reload events
  useEffect(() => {
    const handleImageReload = () => {
      setImageKey(prev => prev + 1);
      setImageLoaded(false);
      setImageFailed(false);
    };

    window.addEventListener('forceImageReload', handleImageReload);
    return () => window.removeEventListener('forceImageReload', handleImageReload);
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);
  }, [product.imageUrl]);

  const ImageSoonPlaceholder = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-center ${className}`}>
      <span className="px-4 text-xs font-bold tracking-widest text-gray-500 uppercase">
        IMAGEM EM BREVE
      </span>
    </div>
  );

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produto adicionado ao carrinho",
      description: `${product.name} foi adicionado ao carrinho de cotação.`,
    });
  };

  const handleFavoriteToggle = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast({
        title: "Removido dos favoritos",
        description: `${product.name} foi removido dos favoritos.`,
      });
    } else {
      addToFavorites(product);
      toast({
        title: "Adicionado aos favoritos",
        description: `${product.name} foi adicionado aos favoritos.`,
      });
    }
  };

  const handleDetailsClick = () => {
    addToRecentlyViewed(product);
    onDetailsClick(product);
  };

  if (viewMode === "list") {
    return (
      <div ref={cardRef} className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300 group">
        <div className="flex p-4 gap-4">
          <div className="relative overflow-hidden w-32 h-32 flex-shrink-0">
            {isVisible ? (
              product.imageUrl && !imageFailed ? (
                <img 
                  src={product.imageUrl.split('?')[0] + `?cb=${Date.now()}&k=${imageKey}&r=${forceReload}`}
                  key={`product-${product.id}-${imageKey}-${forceReload}`} 
                  alt={product.name}
                  className={`w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.log('Image error for product:', product.name, product.imageUrl);
                    setImageLoaded(true);
                    setImageFailed(true);
                  }}
                />
              ) : (
                <ImageSoonPlaceholder className="w-full h-full rounded-lg" />
              )
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
            )}
            {/* Quotation indicator - priority position */}
            {quotationQuantity > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                <Calculator className="w-3 h-3 inline mr-1" />
                {quotationQuantity}
              </div>
            )}
            
            {product.featured && (
              <Badge className={`absolute ${quotationQuantity > 0 ? 'top-10 left-2' : 'top-2 left-2'} bg-[#314D85] text-white text-xs`}>DESTAQUE</Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'
              } hover:text-red-500 bg-white/80 backdrop-blur-sm`}
            >
              <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-[#314D85] transition-colors">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              {/* Technical specs in list view */}
              <div className="flex flex-wrap gap-2 mb-3">
                {product.diameter && (
                  <Badge variant="outline" className="text-xs">Ø {product.diameter}</Badge>
                )}
                {product.width && (
                  <Badge variant="outline" className="text-xs">{product.width} largura</Badge>
                )}
                {product.material && (
                  <Badge variant="outline" className="text-xs">{product.material}</Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => onQuotationClick(product)}
                size="sm"
                className={`transition-all duration-300 ${
                  quotationQuantity > 0
                    ? "bg-orange-500 text-white hover:bg-orange-600" 
                    : "bg-polly-orange text-white hover:bg-polly-orange/90"
                }`}
              >
                <Calculator className="mr-2 h-4 w-4" />
                {quotationQuantity > 0 ? `Na cotação (${quotationQuantity})` : "Adicionar"}
              </Button>
              <Button 
                onClick={() => setIsWhatsAppOpen(true)}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => onDetailsClick(product)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-modern transition-all duration-300 group animate-fade-in m-2 flex flex-col h-full">
      <div className="relative overflow-hidden">
        {isVisible ? (
          product.imageUrl && !imageFailed ? (
            <img 
              src={product.imageUrl.replace(/\?.*$/, '') + `?cb=${Date.now()}&k=${imageKey}`}
              key={`product-grid-${product.id}-${imageKey}`} 
              alt={product.name}
              className={`w-full h-48 object-cover group-hover:scale-110 transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.log('Image error for product:', product.name, product.imageUrl);
                setImageLoaded(true);
                setImageFailed(true);
              }}
            />
          ) : (
            <ImageSoonPlaceholder className="w-full h-48" />
          )
        ) : (
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4">
          {product.featured && (
            <Badge className="bg-polly-orange text-white shadow-lg animate-scale-in">✨ DESTAQUE</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteToggle}
          className={`absolute top-4 right-4 h-10 w-10 p-0 ${
            isFavorite(product.id) ? 'text-red-500' : 'text-white'
          } hover:text-red-500 bg-black/20 backdrop-blur-sm rounded-full`}
        >
          <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <h3 className="font-semibold text-xl mb-3 text-gray-800 group-hover:text-polly-blue transition-colors">{product.name}</h3>
        <p className="text-sm text-polly-gray mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
        
        <div className="flex items-center gap-1 mt-auto">
          <Button 
            onClick={() => onQuotationClick(product)}
            className={`flex-1 transition-all duration-300 ${
              quotationQuantity > 0
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-polly-orange text-white hover:bg-polly-orange/90 shadow-lg hover:shadow-xl"
            }`}
          >
            <Calculator className="mr-2 h-4 w-4" />
            {quotationQuantity > 0 ? `Na cotação (${quotationQuantity})` : "Adicionar"}
          </Button>
          <Button 
            onClick={() => onDetailsClick(product)}
            variant="outline"
            size="sm"
            className="border-polly-blue text-polly-blue hover:bg-polly-blue hover:text-white transition-all duration-300 px-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <WhatsAppIntegration 
        product={product}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />
    </div>
  );
}
