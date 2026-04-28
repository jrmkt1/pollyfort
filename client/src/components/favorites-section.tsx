import { Heart, X, ShoppingCart, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface FavoritesSectionProps {
  onProductClick: (product: Product) => void;
  onQuotationClick: (product: Product) => void;
}

export default function FavoritesSection({ onProductClick, onQuotationClick }: FavoritesSectionProps) {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  if (favorites.length === 0) return null;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao carrinho de cotação.`,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Produtos Favoritos ({favorites.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFavorites}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Limpar Todos
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((product) => (
          <div key={product.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow group">
            <div className="relative mb-3">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromFavorites(product.id)}
                className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 bg-white/80 backdrop-blur-sm rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <h4 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h4>
            <p className="text-xs text-gray-500 mb-2">{product.code}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {product.diameter && (
                <Badge variant="outline" className="text-xs">Ø {product.diameter}</Badge>
              )}
              {product.material && (
                <Badge variant="outline" className="text-xs">{product.material}</Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={() => handleAddToCart(product)}
                size="sm"
                className={`w-full text-xs ${
                  isInCart(product.id) 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <ShoppingCart className="mr-1 h-3 w-3" />
                {isInCart(product.id) ? "No carrinho" : "Adicionar"}
              </Button>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onProductClick(product)}
                  className="flex-1 text-xs"
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuotationClick(product)}
                  className="flex-1 text-xs text-orange-600 border-orange-200"
                >
                  <Calculator className="mr-1 h-3 w-3" />
                  Cotar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}