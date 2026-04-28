import { useState } from "react";
import { X, Plus, Minus, ShoppingCart, Trash2, Calculator, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import BulkQuotation from "./bulk-quotation";

interface CartSidebarProps {
  onQuotationClick: () => void;
}

export default function CartSidebar({ onQuotationClick }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, getTotalItems, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isBulkQuotationOpen, setIsBulkQuotationOpen] = useState(false);

  const handleQuotationClick = () => {
    setIsOpen(false);
    onQuotationClick();
  };

  const handleBulkQuotation = () => {
    setIsBulkQuotationOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative border-polly-blue text-polly-blue hover:bg-polly-blue hover:text-white transition-all duration-300"
        >
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-polly-orange text-white text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho de Cotação
          </SheetTitle>
          <SheetDescription>
            Produtos selecionados para cotação
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Carrinho vazio</h3>
              <p className="text-gray-500">Adicione produtos para solicitar uma cotação</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-center">
                        <span className="px-1 text-[9px] font-bold tracking-wide text-gray-500 uppercase leading-tight">
                          IMAGEM EM BREVE
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">{item.product.code}</p>
                      <p className="text-xs text-gray-500">{item.product.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{items.length} produtos únicos</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      Total: {getTotalItems()} itens
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleBulkQuotation}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Cotação em Lote ({items.length} produtos)
                  </Button>
                  
                  <Button 
                    onClick={handleQuotationClick}
                    variant="outline"
                    className="w-full border-polly-orange text-polly-orange hover:bg-polly-orange hover:text-white transition-all duration-300"
                    size="lg"
                  >
                    Cotação Individual
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
      
      <BulkQuotation 
        isOpen={isBulkQuotationOpen}
        onClose={() => setIsBulkQuotationOpen(false)}
      />
    </Sheet>
  );
}
