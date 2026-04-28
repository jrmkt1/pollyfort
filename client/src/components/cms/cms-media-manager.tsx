import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image, File, Trash2 } from "lucide-react";

export default function CmsMediaManager() {
  const [media] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Biblioteca de Mídia</h2>
          <p className="text-muted-foreground">Gerencie imagens, documentos e outros arquivos</p>
        </div>
        
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Enviar Arquivo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arquivos ({media.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Image className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum arquivo encontrado</p>
              <p className="text-sm">Faça upload de imagens e documentos para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Grid de arquivos será implementado aqui */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}