import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Package, Clock, CheckCircle, XCircle, Eye, FileText, Phone, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Quotation } from "@shared/schema";

// Type guard to check if a value is a valid date
const isValidDate = (date: any): date is Date => {
  return date instanceof Date || (typeof date === 'string' && !isNaN(Date.parse(date)));
};

interface QuotationWithItems extends Quotation {
  quotationItems: Array<{
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      code: string;
      imageUrl?: string;
    };
  }>;
}

export default function QuotationHistory() {
  const { customer, isAuthenticated } = useAuth();
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationWithItems | null>(null);

  const { data: quotations = [], isLoading } = useQuery<QuotationWithItems[]>({
    queryKey: ["/api/quotations/my"],
    enabled: isAuthenticated,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case "responded":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><FileText className="h-3 w-3 mr-1" />Respondida</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aprovada</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">Você precisa estar logado para ver seu histórico de cotações.</p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#314D85] to-[#4A6FA5] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Histórico de Cotações
            </h1>
            <p className="text-xl text-blue-100">
              Acompanhe suas solicitações e respostas
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">E-mail:</span>
                <span className="font-medium">{customer?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Nome:</span>
                <span className="font-medium">{customer?.name}</span>
              </div>
              {customer?.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Empresa:</span>
                  <span className="font-medium">{customer.company}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quotations List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quotations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma cotação encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Você ainda não fez nenhuma solicitação de cotação.
              </p>
              <Button onClick={() => window.location.href = '/products'}>
                Explorar Produtos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotations.map((quotation) => (
              <Card key={quotation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Cotação #{quotation.id}
                    </CardTitle>
                    {getStatusBadge(quotation.status)}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {isValidDate(quotation.createdAt) ? format(new Date(quotation.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Produtos:</span>
                      <p className="text-sm font-medium">
                        {quotation.quotationItems?.length || 0} {(quotation.quotationItems?.length || 0) === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    
                    {quotation.responseMessage && (
                      <div>
                        <span className="text-sm text-gray-600">Resposta:</span>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {quotation.responseMessage}
                        </p>
                      </div>
                    )}

                    {quotation.totalValue && (
                      <div>
                        <span className="text-sm text-gray-600">Valor Total:</span>
                        <p className="text-lg font-bold text-green-600">
                          {quotation.totalValue}
                        </p>
                      </div>
                    )}

                    {quotation.validUntil && (
                      <div>
                        <span className="text-sm text-gray-600">Válido até:</span>
                        <p className="text-sm font-medium">
                          {quotation.validUntil ? format(new Date(quotation.validUntil), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                        </p>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedQuotation(quotation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Cotação #{quotation.id} - Detalhes</DialogTitle>
                          <DialogDescription>
                            Solicitada em {isValidDate(quotation.createdAt) ? format(new Date(quotation.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Status */}
                          <div>
                            <h4 className="font-medium mb-2">Status</h4>
                            {getStatusBadge(quotation.status)}
                          </div>

                          {/* Products */}
                          {quotation.quotationItems && quotation.quotationItems.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">Produtos Solicitados</h4>
                              <div className="space-y-3">
                                {quotation.quotationItems.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    {item.product.imageUrl ? (
                                      <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-center">
                                        <span className="px-1 text-[8px] font-bold tracking-wide text-gray-500 uppercase leading-tight">
                                          IMAGEM EM BREVE
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{item.product.name}</p>
                                      <p className="text-xs text-gray-500">{item.product.code}</p>
                                    </div>
                                    <Badge variant="secondary">
                                      Qtd: {item.quantity}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Original Message */}
                          <div>
                            <h4 className="font-medium mb-2">Mensagem Original</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {quotation.products}
                            </p>
                          </div>

                          {/* Response */}
                          {quotation.responseMessage && (
                            <div>
                              <h4 className="font-medium mb-2">Resposta da Empresa</h4>
                              <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                {quotation.responseMessage}
                              </p>
                            </div>
                          )}

                          {/* Total Value */}
                          {quotation.totalValue && (
                            <div>
                              <h4 className="font-medium mb-2">Valor Total</h4>
                              <p className="text-2xl font-bold text-green-600">
                                {quotation.totalValue}
                              </p>
                            </div>
                          )}

                          {/* Valid Until */}
                          {quotation.validUntil && (
                            <div>
                              <h4 className="font-medium mb-2">Válido Até</h4>
                              <p className="text-sm font-medium">
                                {format(new Date(quotation.validUntil), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                            </div>
                          )}

                          <Separator />
                          
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => window.location.href = '/produtos'}
                              className="flex-1"
                            >
                              Nova Cotação
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => window.location.href = '/contatos'}
                              className="flex-1"
                            >
                              Entrar em Contato
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
