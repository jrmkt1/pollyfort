import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Check, X, Eye } from "lucide-react";

export default function CmsCommentsManager() {
  const [comments] = useState([]);

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      spam: "destructive",
      trash: "outline"
    } as const;
    
    const labels = {
      approved: "Aprovado",
      pending: "Pendente",
      spam: "Spam",
      trash: "Lixeira"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerenciar Comentários</h2>
        <p className="text-muted-foreground">Modere comentários nos posts e páginas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comentários ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum comentário encontrado</p>
              <p className="text-sm">Os comentários aparecerão aqui quando forem enviados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Autor</TableHead>
                  <TableHead>Comentário</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Lista de comentários será implementada aqui */}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}