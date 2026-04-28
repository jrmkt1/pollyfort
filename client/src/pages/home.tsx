import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Filter, Grid, List, SlidersHorizontal, X, Eye, Calculator, ArrowUp, Send, Minus, Plus, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product-card";
import ProductModal from "@/components/product-modal";
import QuotationForm from "@/components/quotation-form";
import RecentlyViewed from "@/components/recently-viewed";
import FavoritesSection from "@/components/favorites-section";
import { ProductGridSkeleton } from "@/components/skeleton-loader";
import { api } from "@/lib/api";
import { filterAndSortProducts } from "@/lib/productFilters";
import { sessionStorageService } from "@/lib/sessionStorage";
import type { Product } from "@shared/schema";
import type { QuotationItem } from "@shared/types";
import heroBg from "@assets/bg1.jpg";
import heroBg2 from "@assets/bg2.jpg";
// Removed unused productImage import

interface HomeProps {
  searchQuery?: string;
}

export default function Home({ searchQuery }: HomeProps) {
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quotationProduct, setQuotationProduct] = useState<Product | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>(() => 
    sessionStorageService.getQuotationItems()
  );

  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const heroSlides = [
    {
      image: heroBg,
      title: "Peças e Rodas para Empilhadeiras",
      subtitle: "Soluções completas em rodas de poliuretano para empilhadeiras elétricas"
    },
    {
      image: heroBg2,
      title: "Qualidade Premium",
      subtitle: "Rodas de alta durabilidade para máxima performance industrial"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["/api/products", { brand_id: selectedBrandId, category_id: selectedCategoryId, search: searchQuery }],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (selectedBrandId && selectedBrandId !== "all") params.append('brand_id', selectedBrandId);
        if (selectedCategoryId && selectedCategoryId !== "all") params.append('category_id', selectedCategoryId);
        if (searchQuery) params.append('search', searchQuery);
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const { data: categories = [], error: categoriesError } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: api.getCategories,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: brands = [], error: brandsError } = useQuery({
    queryKey: ["/api/brands"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Save quotation items to sessionStorage whenever they change
  useEffect(() => {
    sessionStorageService.saveQuotationItems(quotationItems);
  }, [quotationItems]);

  // Simplified sorting logic (filtering now handled by backend)
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    }
    
    return filtered;
  }, [products, sortBy]);

  const clearFilters = () => {
    setSelectedBrandId("all");
    setSelectedCategoryId("all");
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
      // Navigate to quotation page when no product is provided (Cotação Rápida button)
      window.location.href = '/cotacao';
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

    // Force a re-render and then scroll
    setTimeout(() => {
      // First, try to find the quotation section
      let quotationSection = document.getElementById("quotation");

      if (quotationSection) {
        // Scroll with offset to position at the top of the viewport
        const elementTop = quotationSection.offsetTop;
        const offset = 80; // Account for header and some padding
        window.scrollTo({ 
          top: elementTop - offset, 
          behavior: "smooth" 
        });
      } else {
        // Wait for React to re-render the component
        setTimeout(() => {
          quotationSection = document.getElementById("quotation");
          if (quotationSection) {
            const elementTop = quotationSection.offsetTop;
            const offset = 80;
            window.scrollTo({ 
              top: elementTop - offset, 
              behavior: "smooth" 
            });
          } else {
            // Final attempt with longer delay
            setTimeout(() => {
              quotationSection = document.getElementById("quotation");
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

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      const elementTop = productsSection.offsetTop;
      const offset = 80; // Account for header and some padding
      window.scrollTo({ 
        top: elementTop - offset, 
        behavior: "smooth" 
      });
    }
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

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section 
        id="home" 
        className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden"
      >
        {/* Hero Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentHero 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(30, 64, 199, 0.8), rgba(229, 90, 58, 0.8)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg transition-all duration-500">
              {heroSlides[currentHero]?.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md transition-all duration-500 delay-200">
              {heroSlides[currentHero]?.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 transition-all duration-500 delay-400">
              <Button 
                onClick={scrollToProducts}
                variant="secondary"
                size="lg"
                className="bg-white text-polly-blue hover:bg-gray-100 shadow-lg"
              >
                Ver Produtos
              </Button>
              <Button 
                onClick={() => handleQuotationClick()}
                size="lg"
                className="bg-polly-orange text-white hover:bg-polly-orange/90 shadow-lg border-0"
              >
                Cotação Rápida
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHero(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHero 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Hero Navigation Arrows */}
        <button
          onClick={() => setCurrentHero((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentHero((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Overlay pattern for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
      </section>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* New Filter Interface */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                Filtros
              </h3>

              {/* Brand Filter Dropdown */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Filtrar por Marca</label>
                <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as Marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Marcas</SelectItem>
                    {brands.map((brand: any) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter Dropdown */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Filtrar por Categoria</label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as Categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Products Count */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Produtos encontrados</p>
                    <p className="text-xl font-bold text-blue-600">{filteredAndSortedProducts.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrandId && selectedBrandId !== "all") || (selectedCategoryId && selectedCategoryId !== "all") ? (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              ) : null}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3" id="products">
            <div className="bg-white rounded-2xl shadow-card p-8 animate-slide-up">
              {/* Header with controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-polly-blue mb-2">
                    Todos os Produtos
                  </h2>
                  <p className="text-polly-gray">
                    Encontramos {filteredAndSortedProducts.length} produtos para você
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Sort Controls */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Ordenar:</label>
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
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

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
              </div>

              {/* Recently Viewed and Favorites Sections */}
              <RecentlyViewed 
                onProductClick={handleProductDetails}
                onQuotationClick={handleQuotationClick}
              />

              <FavoritesSection 
                onProductClick={handleProductDetails}
                onQuotationClick={handleQuotationClick}
              />

              {productsLoading ? (
                <ProductGridSkeleton />
              ) : productsError ? (
                <div className="text-center py-20">
                  <div className="bg-red-50 rounded-2xl p-12 max-w-md mx-auto">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Erro ao carregar produtos</h3>
                    <p className="text-red-600 mb-4">
                      Não foi possível conectar ao servidor. Verifique sua conexão.
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
                    <p className="text-polly-gray">
                      {searchQuery 
                        ? `Não encontramos produtos para "${searchQuery}"`
                        : "Nenhum produto disponível com os filtros selecionados"
                      }
                    </p>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="mt-4"
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`
                  ${viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr" 
                    : "space-y-4"
                  }
                `}>
                  {filteredAndSortedProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className={`animate-fade-in ${viewMode === "grid" ? "flex" : ""}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {viewMode === "grid" ? (
                        <ProductCard
                          product={product}
                          onQuotationClick={handleQuotationClick}
                          onDetailsClick={handleProductDetails}
                          quotationQuantity={quotationItems.find(item => item.product.id === product.id)?.quantity || 0}
                        />
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex gap-6">
                            <div className="w-32 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-gray-400 text-2xl">🔧</div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                              <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  Categoria: {product.categoryName || product.category || "Sem categoria"}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleProductDetails(product)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Detalhes
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuotationClick(product)}
                                  >
                                    <Calculator className="h-4 w-4 mr-1" />
                                    Cotação
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
                      <ArrowUp className="mr-2 h-4 w-4" />
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

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuotationClick={handleQuotationClick}
      />
    </div>
  );
}
