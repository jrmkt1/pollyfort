import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Minus, Calculator, Send, ShoppingCart, X, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import type { Product } from "@shared/schema";
import type { QuotationItem } from "@shared/types";
import { sessionStorageService } from "@/lib/sessionStorage";
import WhatsAppIntegration from "@/components/whatsapp-integration";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export default function Quotation() {
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>(() => 
    sessionStorageService.getQuotationItems()
  );
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items: cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createQuotation = useMutation({
    mutationFn: async (data: any) => {
      const productsString = quotationItems.map(item => 
        `${item.product.name} (Qtd: ${item.quantity})`
      ).join(', ');

      return api.createQuotation({
        ...data,
        products: productsString
      });
    },
    onSuccess: () => {
      toast({
        title: "Cotação enviada com sucesso!",
        description: "Entraremos em contato em breve com sua cotação personalizada.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
      setQuotationItems([]);
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar cotação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addItemFromCart = () => {
    const newItems = cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

    setQuotationItems(prev => {
      const combined = [...prev];
      newItems.forEach(newItem => {
        const existingIndex = combined.findIndex(item => item.product.id === newItem.product.id);
        if (existingIndex >= 0) {
          combined[existingIndex].quantity += newItem.quantity;
        } else {
          combined.push(newItem);
        }
      });
      return combined;
    });

    clearCart();
    toast({
      title: "Produtos adicionados à cotação",
      description: `${newItems.length} produtos foram adicionados à sua cotação.`,
    });
  };

  const addProduct = (product: Product) => {
    setQuotationItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    const updatedItems = quotationItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setQuotationItems(updatedItems);
    sessionStorageService.saveQuotationItems(updatedItems);
  };

  const removeProduct = (productId: number) => {
    const updatedItems = quotationItems.filter(item => item.product.id !== productId);
    setQuotationItems(updatedItems);
    sessionStorageService.saveQuotationItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quotationItems.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um produto para cotação.",
        variant: "destructive",
      });
      return;
    }
    createQuotation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const totalItems = quotationItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-polly-blue mb-4">Solicitar Cotação</h1>
          <p className="text-xl text-polly-gray max-w-3xl mx-auto">
            Solicite uma cotação personalizada para os produtos que você precisa. 
            Nossa equipe entrará em contato com as melhores condições comerciais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-orange-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Resumo da Cotação
                </span>
                <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                  {quotationItems.reduce((sum, item) => sum + item.quantity, 0)} {quotationItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'itens'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Import from Cart */}
              {cartItems.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">
                      Carrinho ({cartItems.length} produtos)
                    </h4>
                    <Button 
                      onClick={addItemFromCart}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Importar do Carrinho
                    </Button>
                  </div>
                  <p className="text-sm text-blue-700">
                    Você tem produtos no carrinho. Clique para importá-los para a cotação.
                  </p>
                </div>
              )}

              {/* Products from Quotation Summary */}
              {quotationItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quotationItems.map((item) => (
                    <div key={item.product.id} className="bg-white p-2 rounded border shadow-sm">
                      <div className="mb-2">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.product.imageUrl ? (
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="text-gray-400 text-xs">🔧</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">{item.product.code}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-5 w-5 p-0"
                          >
                            <Minus className="h-2 w-2" />
                          </Button>
                          <span className="text-xs font-medium w-5 text-center bg-orange-100 text-orange-800 rounded px-1 py-0.5">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-5 w-5 p-0"
                          >
                            <Plus className="h-2 w-2" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeProduct(item.product.id)}
                          className="h-5 w-full p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Nenhum produto selecionado para cotação</p>
                  <p className="text-xs mt-1">Volte às páginas de produtos para adicionar itens</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quotation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-polly-blue" />
                Dados da Cotação
              </CardTitle>
              <CardDescription>
                Preencha seus dados para receber a cotação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                    <Input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                    <Input 
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais sobre sua necessidade..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={createQuotation.isPending || quotationItems.length === 0}
                    className="flex-1 bg-polly-blue hover:bg-polly-blue/90"
                  >
                    {createQuotation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Cotação
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setIsWhatsAppOpen(true)}
                    disabled={quotationItems.length === 0}
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>



        <WhatsAppIntegration 
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      </div>
    </div>
  );
}