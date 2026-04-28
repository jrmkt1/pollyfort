import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface QuotationItem {
  product: Product;
  quantity: number;
}

interface QuotationFormProps {
  items?: QuotationItem[];
  quotationItems?: QuotationItem[];
  onRemoveItem?: (productId: number) => void;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onUpdateQuotationQuantity?: (productId: number, quantity: number) => void;
  onRemoveFromQuotation?: (productId: number) => void;
  onClear?: () => void;
  compact?: boolean;
}

export default function QuotationForm({ 
  items, 
  quotationItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onUpdateQuotationQuantity,
  onRemoveFromQuotation,
  onClear,
  compact = false
}: QuotationFormProps) {
  const { toast } = useToast();
  
  // Use quotationItems if provided, otherwise use items
  const actualItems = quotationItems || items || [];
  const actualOnRemoveItem = onRemoveFromQuotation || onRemoveItem;
  const actualOnUpdateQuantity = onUpdateQuotationQuantity || onUpdateQuantity;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const submitQuotationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/contact", {
        method: "POST",
        body: {
          ...data,
          formType: "cotacao",
          subject: "Nova Solicitação de Cotação"
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Cotação enviada com sucesso!",
        description: "Entraremos em contato em breve com sua proposta.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
      onClear();
    },
    onError: () => {
      toast({
        title: "Erro ao enviar cotação",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (actualItems.length === 0) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Adicione produtos à cotação antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    const productsText = actualItems.map(item => 
      `${item.product.name} (${item.product.code}) - Quantidade: ${item.quantity}`
    ).join("\n");

    const message = `
Solicitação de Cotação

Produtos:
${productsText}

Mensagem adicional:
${formData.message || "Nenhuma mensagem adicional."}
    `.trim();

    submitQuotationMutation.mutate({
      ...formData,
      message
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (actualItems.length === 0) {
    return (
      <Card id="quotation" className="mt-12">
        <CardHeader>
          <CardTitle>Sua Cotação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Nenhum produto selecionado para cotação.
            <br />
            Navegue pelos produtos e clique em "Solicitar Cotação" para começar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="quotation" className="mt-12">
      <CardHeader>
        <CardTitle>Solicitar Cotação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Products Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Produtos Selecionados</h3>
            <Button variant="outline" size="sm" onClick={onClear}>
              Limpar Tudo
            </Button>
          </div>
          <div className="space-y-3">
            {actualItems.map(item => (
              <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-center">
                    <span className="px-1 text-[9px] font-bold tracking-wide text-gray-500 uppercase leading-tight">
                      IMAGEM EM BREVE
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">{item.product.code}</p>
                  <p className="text-sm text-gray-500">{item.product.diameter} x {item.product.width}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => actualOnUpdateQuantity?.(item.product.id, parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actualOnRemoveItem?.(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefone *</label>
              <Input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Empresa</label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mensagem Adicional</label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Informações adicionais sobre sua necessidade..."
              rows={4}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitQuotationMutation.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {submitQuotationMutation.isPending ? "Enviando..." : "Enviar Cotação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
