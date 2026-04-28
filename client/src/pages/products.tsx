import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List, Search, ChevronDown, Calculator, ArrowRight, ArrowUp, X, Plus, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import QuotationForm from "@/components/quotation-form";
import { useToast } from "@/hooks/use-toast";
import { filterAndSortProducts } from "@/lib/productFilters";
import { sessionStorageService } from "@/lib/sessionStorage";
import { type Product } from "@shared/schema";
import type { QuotationItem } from "@shared/types";

interface ProductsProps {
  searchQuery?: string;
}

export default function Products({ searchQuery }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quotationProduct, setQuotationProduct] = useState<Product | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>(() => 
    sessionStorageService.getQuotationItems()
  );
  const [showQuotationSummary, setShowQuotationSummary] = useState(false);
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Array<{name: string; count: number}>>({
    queryKey: ["/api/categories"],
  });

  // Save quotation items to sessionStorage whenever they change
  useEffect(() => {
    sessionStorageService.saveQuotationItems(quotationItems);
  }, [quotationItems]);

  const filteredProducts = useMemo(() => {
    const searchTerm = localSearchQuery || searchQuery || "";
    return filterAndSortProducts(products, {
      category: selectedCategory,
      search: searchTerm,
      sortBy
    });
  }, [products, selectedCategory, localSearchQuery, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setLocalSearchQuery("");
    setSortBy("name");
  };

  const handleProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuotationClick = (product?: Product) => {
    if (product) {
      addToQuotation(product);
    } else {
      setQuotationProduct(product);
    }
  };

  const addToQuotation = (product: Product) => {
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

    toast({
      title: "Produto adicionado à cotação",
      description: `${product.name} foi adicionado à sua cotação.`,
    });

    setShowQuotationSummary(true);
    
    // Force re-render and then scroll
    setTimeout(() => {
      let quotationSection = document.getElementById('quotation');
      
      if (quotationSection) {
        // Scroll with offset to position at the top of the viewport
        const elementTop = quotationSection.offsetTop;
        const offset = 80; // Account for header and some padding
        window.scrollTo({ 
          top: elementTop - offset, 
          behavior: "smooth" 
        });
      } else {
        // Wait for React to re-render
        setTimeout(() => {
          quotationSection = document.getElementById('quotation');
          if (quotationSection) {
            const elementTop = quotationSection.offsetTop;
            const offset = 80;
            window.scrollTo({ 
              top: elementTop - offset, 
              behavior: "smooth" 
            });
          } else {
            // Final attempt
            setTimeout(() => {
              quotationSection = document.getElementById('quotation');
              if (quotationSection) {
                const elementTop = quotationSection.offsetTop;
                const offset = 80;
                window.scrollTo({ 
                  top: elementTop - offset, 
                  behavior: "smooth" 
                });
              }
            }, 500);
          }
        }, 100);
      }
    }, 50);
  };

  const updateQuotationQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuotation(productId);
      return;
    }
    setQuotationItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromQuotation = (productId: number) => {
    setQuotationItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const goToQuotation = () => {
    // Store quotation items in sessionStorage to pass to quotation page
    sessionStorage.setItem('quotationItems', JSON.stringify(quotationItems));
    window.location.href = '/quotation';
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      const elementTop = productsSection.offsetTop;
      const offset = 80; // Account for header and some padding
      window.scrollTo({ 
        top: elementTop - offset, 
        behavior: "smooth" 
      });
    }
  };

  const totalQuotationItems = quotationItems.reduce((sum, item) => sum + item.quantity, 0);

  if (quotationProduct) {
    return <QuotationForm selectedProduct={quotationProduct} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#314D85] to-[#4A6FA5] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rodas para Empilhadeiras
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Soluções completas em rodas de poliuretano para equipamentos industriais
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Alta Durabilidade
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Resistente a Cargas
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Baixo Ruído
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Fabricação Nacional
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <span>Início</span>
            <ArrowRight className="h-4 w-4 mx-2" />
            <span className="text-[#314D85] font-medium">Produtos</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#314D85] hover:text-[#314D85]/80"
                >
                  Limpar
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Buscar Produtos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Digite o nome do produto..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Categorias
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === "" 
                        ? "bg-[#314D85] text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Todas as Categorias
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                        selectedCategory === category.name 
                          ? "bg-[#314D85] text-white" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || localSearchQuery) && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Filtros Ativos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory("")}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {localSearchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        "{localSearchQuery}"
                        <button
                          onClick={() => setLocalSearchQuery("")}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}



              {/* Product Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#314D85] mb-2">Sobre Nossos Produtos</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Rodas de alta qualidade</li>
                  <li>• Material poliuretano durável</li>
                  <li>• Resistência superior</li>
                  <li>• Garantia de qualidade</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                  </span>
                  
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Ordenar:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nome A-Z</SelectItem>
                        <SelectItem value="rating">Avaliação</SelectItem>
                        <SelectItem value="newest">Mais Recentes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div id="products-section">
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => {
                  const quotationItem = quotationItems.find(item => item.product.id === product.id);
                  const quotationQuantity = quotationItem?.quantity || 0;
                  
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuotationClick={handleQuotationClick}
                      onDetailsClick={handleProductDetails}
                      viewMode={viewMode}
                      quotationQuantity={quotationQuantity}
                    />
                  );
                })}
              </div>
            )}

            {/* Call to Action */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 bg-gradient-to-r from-[#314D85] to-[#4A6FA5] rounded-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Não encontrou o que procura?
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Nossa equipe especializada pode ajudar você a encontrar a solução ideal para seu equipamento. 
                  Entre em contato conosco para um atendimento personalizado.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-[#314D85] hover:bg-gray-100"
                  onClick={() => handleQuotationClick()}
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Solicitar Orçamento Personalizado
                </Button>
              </div>
            )}
            </div>
          </main>
        </div>
      </div>

      {/* Quotation Summary */}
      {quotationItems.length > 0 && (
        <div className="bg-gray-50 py-8" id="quotation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
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
                            onClick={() => updateQuotationQuantity(item.product.id, item.quantity - 1)}
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
                            onClick={() => updateQuotationQuantity(item.product.id, item.quantity + 1)}
                            className="h-5 w-5 p-0"
                          >
                            <Plus className="h-2 w-2" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromQuotation(item.product.id)}
                          className="h-5 w-full p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button 
                      onClick={scrollToProducts}
                      className="bg-[#314D85] hover:bg-[#4A6FA5] text-white"
                      size="lg"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      CONTINUAR ORÇAMENTO
                    </Button>
                    <Button 
                      onClick={() => setQuotationItems([])}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      size="lg"
                    >
                      Limpar Cotação
                    </Button>
                  </div>
                  
                  {/* Embedded Quotation Form */}
                  <div className="border-t border-orange-200 pt-6 mt-6 -mx-6 -mb-6 px-6 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-b-lg">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-[#314D85] mb-2 flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Solicite sua Cotação
                      </h3>
                      <p className="text-sm text-[#4A6FA5]">
                        Preencha seus dados para receber nossa melhor proposta
                      </p>
                    </div>
                    
                    <QuotationForm 
                      quotationItems={quotationItems}
                      onUpdateQuotationQuantity={updateQuotationQuantity}
                      onRemoveFromQuotation={removeFromQuotation}
                      compact={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onQuotationClick={handleQuotationClick}
      />
    </div>
  );
}