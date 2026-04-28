import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Globe, Lock, Mail, Palette } from "lucide-react";

export default function CmsSettingsManager() {
  const [settings] = useState({
    site_title: "Pollyfort CMS",
    site_description: "Sistema de gestão de conteúdo da Pollyfort",
    site_url: "https://pollyfortrodas.com.br",
    admin_email: "comercial@pollyfortrodas.com.br",
    allow_registration: false,
    moderate_comments: true,
    posts_per_page: 10,
    theme: "default"
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações do CMS</h2>
        <p className="text-muted-foreground">Configure as opções gerais do sistema</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Configurações Gerais</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="site-title">Título do Site</Label>
                <Input 
                  id="site-title" 
                  defaultValue={settings.site_title}
                  placeholder="Nome do seu site"
                />
              </div>

              <div>
                <Label htmlFor="site-description">Descrição do Site</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue={settings.site_description}
                  placeholder="Breve descrição do seu site"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="site-url">URL do Site</Label>
                <Input 
                  id="site-url" 
                  defaultValue={settings.site_url}
                  placeholder="https://seusite.com"
                />
              </div>

              <div>
                <Label htmlFor="admin-email">E-mail do Administrador</Label>
                <Input 
                  id="admin-email" 
                  type="email"
                  defaultValue={settings.admin_email}
                  placeholder="admin@seusite.com"
                />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="posts-per-page">Posts por Página</Label>
                <Input 
                  id="posts-per-page" 
                  type="number"
                  defaultValue={settings.posts_per_page}
                  min="1"
                  max="50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Permitir HTML em Posts</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite código HTML nos posts e páginas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Gerar Excerpts Automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Cria resumos automáticos quando não especificado
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Comentários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Permitir Comentários</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativa o sistema de comentários nos posts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Moderar Comentários</Label>
                  <p className="text-sm text-muted-foreground">
                    Comentários precisam de aprovação antes de aparecer
                  </p>
                </div>
                <Switch defaultChecked={settings.moderate_comments} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificar por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar e-mail quando novos comentários forem enviados
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <CardTitle>Configurações de Usuários</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Permitir Registro de Usuários</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que novos usuários se registrem no sistema
                  </p>
                </div>
                <Switch defaultChecked={settings.allow_registration} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Verificação de E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Exige verificação de e-mail para novos usuários
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label htmlFor="default-role">Função Padrão para Novos Usuários</Label>
                <select id="default-role" className="w-full p-2 border rounded">
                  <option value="contributor">Colaborador</option>
                  <option value="author">Autor</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativa página de manutenção para visitantes
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cache de Posts</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativa cache para melhorar performance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Logs de Atividade</Label>
                  <p className="text-sm text-muted-foreground">
                    Registra atividades dos usuários no sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
