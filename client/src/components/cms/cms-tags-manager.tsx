import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Hash } from "lucide-react";

export default function CmsTagsManager() {
  const [tags] = useState([
    {
      id: 1,
      name: "CMS",
      slug: "cms",
      count: 1,
      createdAt: new Date()
    }
  ]);

  const [newTag, setNewTag] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tags</h2>
        <p className="text-muted-foreground">Gerencie tags para categorizar seus posts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Tag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Nome da tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags Existentes ({tags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{tag.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tag.count} post{tag.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{tag.slug}</Badge>
                  <Button size="sm" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}