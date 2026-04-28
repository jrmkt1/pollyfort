import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Minus, Calculator, X, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import type { Product } from "@shared/schema";

const bulkQuotationSchema = z.object({
  customerName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  companyName: z.string().optional(),
  message: z.string().optional(),
});

type BulkQuotationData = z.infer<typeof bulkQuotationSchema>;

interface BulkQuotationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkQuotation({ isOpen, onClose }: BulkQuotationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BulkQuotationData>({
    resolver: zodResolver(bulkQuotationSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      companyName: "",
      message: "",
    },
  });

  const createBulkQuotation = useMutation({
    mutationFn: async (data: BulkQuotationData & { items: Array<{ productId: number; quantity: number }> }) => {
      const response = await fetch('/api/quotations/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create bulk quotation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotations'] });
      toast({
        title: "Cotação criada com sucesso!",
        description: `Cotação de ${items.length} produtos enviada. Entraremos em contato em breve.`,
      });
      clearCart();
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar cotação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BulkQuotationData) => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de solicitar cotação.",
        variant: "destructive",
      });
      return;
    }

    const quotationItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    await createBulkQuotation.mutateAsync({
      ...data,
      items: quotationItems
    });
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cotação em Lote - {items.length} produtos ({getTotalItems()} itens)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cart Items Review */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Produtos Selecionados
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded p-3 flex items-center gap-3">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.product.code}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">{item.product.diameter}</Badge>
                      <Badge variant="outline" className="text-xs">{item.product.material}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quotation Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem Adicional</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Informações adicionais sobre sua cotação..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={createBulkQuotation.isPending || items.length === 0}
                  className="bg-polly-orange text-white hover:bg-polly-orange/90"
                >
                  {createBulkQuotation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Solicitar Cotação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
