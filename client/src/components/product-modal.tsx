import { X, Calculator, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@shared/schema";
// Removed unused productImage import

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onQuotationClick: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onQuotationClick }: ProductModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-polly-blue">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-center ${product.imageUrl ? 'hidden' : ''}`}>
              <span className="px-6 text-sm font-bold tracking-widest text-gray-500 uppercase">
                IMAGEM EM BREVE
              </span>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-polly-blue mb-3">Especificações Técnicas</h4>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-gray-700">Diâmetro:</dt>
                  <dd className="text-polly-gray">{product.diameter}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Largura:</dt>
                  <dd className="text-polly-gray">{product.width}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-700">Material:</dt>
                  <dd className="text-polly-gray">{product.material}</dd>
                </div>
                {product.hardness && (
                  <div>
                    <dt className="font-medium text-gray-700">Dureza:</dt>
                    <dd className="text-polly-gray">{product.hardness}</dd>
                  </div>
                )}
                {product.maxLoad && (
                  <div>
                    <dt className="font-medium text-gray-700">Carga Max:</dt>
                    <dd className="text-polly-gray">{product.maxLoad}</dd>
                  </div>
                )}
                {product.application && (
                  <div>
                    <dt className="font-medium text-gray-700">Aplicação:</dt>
                    <dd className="text-polly-gray">{product.application}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-polly-blue mb-3">Descrição</h4>
              <p className="text-polly-gray leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => onQuotationClick(product)}
                className="flex-1 bg-polly-orange text-white hover:bg-polly-orange/90"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Solicitar Cotação
              </Button>
              <Button 
                variant="outline"
                className="bg-polly-blue text-white hover:bg-polly-blue/90 border-polly-blue"
              >
                <Download className="mr-2 h-4 w-4" />
                Ficha Técnica
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
