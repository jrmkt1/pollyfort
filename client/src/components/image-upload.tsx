import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  productId: number;
  onImagesUploaded: (images: any[]) => void;
  existingImages?: any[];
}

export function ImageUpload({ productId, onImagesUploaded, existingImages = [] }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
      formData.append('productId', productId.toString());

      const response = await fetch('/api/products/upload-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload das imagens');
      }

      const uploadedImages = await response.json();
      const newImages = [...images, ...uploadedImages];
      setImages(newImages);
      onImagesUploaded(newImages);

      toast({
        title: "Sucesso",
        description: `${uploadedImages.length} imagem(ns) enviada(s) com sucesso!`,
      });

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar imagens. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageId: number) => {
    try {
      const response = await fetch(`/api/products/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao remover imagem');
      }

      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      onImagesUploaded(updatedImages);

      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover imagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const setPrimaryImage = async (imageId: number) => {
    try {
      const response = await fetch(`/api/products/images/${imageId}/primary`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Falha ao definir imagem principal');
      }

      const updatedImages = images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }));
      setImages(updatedImages);
      onImagesUploaded(updatedImages);

      toast({
        title: "Sucesso",
        description: "Imagem principal definida!",
      });
    } catch (error) {
      console.error('Erro ao definir imagem principal:', error);
      toast({
        title: "Erro",
        description: "Falha ao definir imagem principal. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Imagens do Produto</Label>
        <div className="mt-2">
          <Input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Enviando...' : 'Selecionar Imagens'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Selecione uma ou mais imagens (JPG, PNG, WebP)
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay com controles */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                <Button
                  size="sm"
                  variant={image.isPrimary ? "default" : "secondary"}
                  onClick={() => setPrimaryImage(image.id)}
                  className="text-xs"
                >
                  {image.isPrimary ? "Principal" : "Definir Principal"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {/* Indicador de imagem principal */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Nenhuma imagem carregada</p>
        </div>
      )}
    </div>
  );
}