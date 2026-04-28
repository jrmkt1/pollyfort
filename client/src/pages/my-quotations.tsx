import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { FileText, Calendar, Phone, Building2, MapPin, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useLocation } from "wouter";
import type { Quotation } from "@shared/schema";

export default function MyQuotations() {
  const { customer, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para ver suas cotações.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, authLoading, toast, setLocation]);

  const { data: quotations, isLoading } = useQuery<Quotation[]>({
    queryKey: ["/api/quotations/my"],
    enabled: isAuthenticated,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovada";
      case "rejected":
        return "Rejeitada";
      default:
        return "Desconhecido";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-polly-gray mb-2">Minhas Cotações</h1>
          <p className="text-gray-600">
            Acompanhe o status das suas cotações e histórico de pedidos
          </p>
        </div>

        {quotations && quotations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma cotação encontrada
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Você ainda não fez nenhuma cotação. Comece explorando nossos produtos!
              </p>
              <Button 
                onClick={() => setLocation("/#products")}
                className="bg-polly-orange hover:bg-polly-orange/90"
              >
                Ver Produtos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {quotations?.map((quotation) => (
              <Card key={quotation.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-polly-orange" />
                        Cotação #{quotation.id}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {quotation.createdAt && format(new Date(quotation.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(quotation.status)}>
                      {getStatusText(quotation.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Telefone</p>
                          <p className="text-gray-600">{quotation.phone}</p>
                        </div>
                      </div>
                      
                      {quotation.company && (
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium text-sm">Empresa</p>
                            <p className="text-gray-600">{quotation.company}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium text-sm">Produtos</p>
                          <p className="text-gray-600">{quotation.products}</p>
                        </div>
                      </div>
                    </div>
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