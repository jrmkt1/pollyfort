import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface WhatsAppIntegrationProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppIntegration({ product, isOpen, onClose }: WhatsAppIntegrationProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [message, setMessage] = useState("");
  const { items } = useCart();

  const generateWhatsAppMessage = () => {
    let whatsappMessage = `Olá! Gostaria de solicitar uma cotação:\n\n`;

    whatsappMessage += `👤 *Cliente:* ${customerName}\n`;
    whatsappMessage += `📱 *Telefone:* ${customerPhone}\n\n`;

    if (product) {
      whatsappMessage += `🔧 *Produto:*\n`;
      whatsappMessage += `• ${product.name}\n`;
      whatsappMessage += `• Código: ${product.code}\n`;
      if (product.diameter) whatsappMessage += `• Diâmetro: ${product.diameter}\n`;
      if (product.material) whatsappMessage += `• Material: ${product.material}\n\n`;
    } else if (items.length > 0) {
      whatsappMessage += `🛒 *Produtos do Carrinho (${items.length} itens):*\n`;
      items.forEach((item, index) => {
        whatsappMessage += `${index + 1}. ${item.product.name}\n`;
        whatsappMessage += `   • Código: ${item.product.code}\n`;
        whatsappMessage += `   • Quantidade: ${item.quantity}\n`;
        if (item.product.diameter) whatsappMessage += `   • Diâmetro: ${item.product.diameter}\n`;
        whatsappMessage += `\n`;
      });
    }

    if (message.trim()) {
      whatsappMessage += `📝 *Observações:*\n${message}\n\n`;
    }

    whatsappMessage += `Aguardo retorno para prosseguir com a cotação. Obrigado!`;

    return encodeURIComponent(whatsappMessage);
  };

  const handleSendWhatsApp = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      return;
    }

    const whatsappMessage = generateWhatsAppMessage();
    const whatsappNumber = "5519999128023"; // Business WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Enviar via WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Seu Nome *
            </label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Seu Telefone *
            </label>
            <Input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mensagem Adicional
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Informações adicionais sobre sua necessidade..."
              rows={3}
            />
          </div>

          {product && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-1">Produto Selecionado:</h4>
              <p className="text-sm text-gray-600">{product.name}</p>
              <p className="text-xs text-gray-500">{product.code}</p>
            </div>
          )}

          {!product && items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">
                Carrinho: {items.length} produtos ({items.reduce((sum, item) => sum + item.quantity, 0)} itens)
              </h4>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {items.slice(0, 3).map((item) => (
                  <p key={item.product.id} className="text-xs text-gray-600">
                    • {item.product.name} (Qtd: {item.quantity})
                  </p>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-gray-500">+ {items.length - 3} produtos...</p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              disabled={!customerName.trim() || !customerPhone.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}