import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MessageSquare, 
  ArrowLeft, 
  Eye, 
  Reply, 
  CheckCircle, 
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Types
interface Quotation {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  products: string;
  status: string;
  createdAt: string;
  responseMessage: string | null;
  totalValue: string | null;
  validUntil: string | null;
}

export default function QuotationsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [responseForm, setResponseForm] = useState({
    message: "",
    totalValue: "",
    validUntil: "",
    status: "pending"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Query para buscar cotações
  const { data: quotations = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/quotations"],
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Mutation para responder cotação
  const respondQuotationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/quotations/${id}/respond`, { 
        method: "POST", 
        body: data 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      setIsDialogOpen(false);
      setSelectedQuotation(null);
      resetResponseForm();
      toast({ 
        title: "Resposta enviada com sucesso!",
        description: "O cliente receberá um email com sua resposta."
      });
    },
    onError: () => {
      toast({ 
        title: "Erro ao enviar resposta", 
        variant: "destructive" 
      });
    }
  });

  // Mutation para atualizar status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest(`/api/quotations/${id}/status`, { 
        method: "PATCH", 
        body: { status } 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      toast({ title: "Status atualizado com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar status", 
        variant: "destructive" 
      });
    }
  });

  const resetResponseForm = () => {
    setResponseForm({
      message: "",
      totalValue: "",
      validUntil: "",
      status: "pending"
    });
  };

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setResponseForm({
      message: quotation.responseMessage || "",
      totalValue: quotation.totalValue || "",
      validUntil: quotation.validUntil ? new Date(quotation.validUntil).toISOString().split('T')[0] : "",
      status: quotation.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedQuotation) return;

    const data = {
      message: responseForm.message,
      totalValue: responseForm.totalValue,
      validUntil: responseForm.validUntil ? new Date(responseForm.validUntil).toISOString() : null,
      status: responseForm.status
    };

    respondQuotationMutation.mutate({
      id: selectedQuotation.id,
      data
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'responded':
        return <Badge variant="secondary"><Reply className="h-3 w-3 mr-1" />Respondida</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Cotações Recebidas</h1>
              </div>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Cotações</span>
              <Badge variant="outline">
                {quotations.length} cotações
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando cotações...</p>
              </div>
            ) : quotations.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma cotação encontrada</h3>
                <p className="text-gray-600">As cotações dos clientes aparecerão aqui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations.map((quotation: Quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell>
                          <div className="font-medium">{quotation.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {quotation.company || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {quotation.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {quotation.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(quotation.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {formatDate(quotation.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewQuotation(quotation)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Ver Detalhes
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para ver/responder cotação */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Detalhes da Cotação #{selectedQuotation?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedQuotation && (
              <div className="space-y-6">
                {/* Informações do Cliente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Nome</Label>
                        <p className="font-medium">{selectedQuotation.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Empresa</Label>
                        <p>{selectedQuotation.company || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p>{selectedQuotation.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                        <p>{selectedQuotation.phone}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Data da Solicitação</Label>
                      <p>{formatDate(selectedQuotation.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Produtos Solicitados */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produtos Solicitados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{selectedQuotation.products}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulário de Resposta */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resposta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitResponse} className="space-y-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={responseForm.status} 
                          onValueChange={(value) => setResponseForm({...responseForm, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="responded">Respondida</SelectItem>
                            <SelectItem value="approved">Aprovada</SelectItem>
                            <SelectItem value="rejected">Rejeitada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Mensagem de Resposta</Label>
                        <Textarea
                          id="message"
                          value={responseForm.message}
                          onChange={(e) => setResponseForm({...responseForm, message: e.target.value})}
                          placeholder="Digite sua resposta para o cliente..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalValue">Valor Total (opcional)</Label>
                          <Input
                            id="totalValue"
                            value={responseForm.totalValue}
                            onChange={(e) => setResponseForm({...responseForm, totalValue: e.target.value})}
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="validUntil">Válido até (opcional)</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={responseForm.validUntil}
                            onChange={(e) => setResponseForm({...responseForm, validUntil: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={respondQuotationMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          <Reply className="h-4 w-4" />
                          {respondQuotationMutation.isPending ? "Enviando..." : "Enviar Resposta"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setSelectedQuotation(null);
                            resetResponseForm();
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}