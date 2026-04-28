import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, ShoppingCart, Package, Eye, Star, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Product, Quotation } from "@shared/schema";

export default function AdminAnalytics() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: quotations = [] } = useQuery<Quotation[]>({
    queryKey: ["/api/quotations"],
  });

  // Calculate analytics
  const totalProducts = products.length;
  const totalQuotations = quotations.length;
  const pendingQuotations = quotations.filter(q => q.status === "pending").length;
  const completedQuotations = quotations.filter(q => q.status === "completed").length;
  
  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const featuredProducts = products.filter(p => p.featured).length;
  const averageRating = products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length / 10;
  
  const recentQuotations = quotations
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const exportData = () => {
    const data = {
      products: products.length,
      quotations: quotations.length,
      categories: categoryStats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pollyfort-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
          <p className="text-gray-500">Visão geral do desempenho da plataforma</p>
        </div>
        <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Dados
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {featuredProducts} em destaque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotações Totais</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotations}</div>
            <p className="text-xs text-muted-foreground">
              {pendingQuotations} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQuotations > 0 ? Math.round((completedQuotations / totalQuotations) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedQuotations} completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              de 5.0 estrelas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>Produtos por categoria principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm text-gray-500">{count} produtos</span>
                </div>
                <Progress 
                  value={(count / totalProducts) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Quotations */}
        <Card>
          <CardHeader>
            <CardTitle>Cotações Recentes</CardTitle>
            <CardDescription>Últimas 5 solicitações de cotação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotations.length > 0 ? (
                recentQuotations.map((quotation) => (
                  <div key={quotation.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{quotation.name}</p>
                      <p className="text-xs text-gray-500">{quotation.email}</p>
                      <p className="text-xs text-gray-400">
                        {quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(quotation.status || 'pending')}>
                      {quotation.status === 'pending' ? 'Pendente' : 
                       quotation.status === 'completed' ? 'Concluída' : 
                       quotation.status === 'cancelled' ? 'Cancelada' : quotation.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma cotação encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Populares</CardTitle>
          <CardDescription>Baseado em avaliações e cotações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 6)
              .map((product) => (
                <div key={product.id} className="border border-gray-100 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                    {product.featured && (
                      <Badge variant="secondary" className="text-xs ml-2">Destaque</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{product.code}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{((product.rating || 0) / 10).toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ({product.reviewCount || 0} avaliações)
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}