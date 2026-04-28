import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Users, Image, MessageSquare, Settings, Menu, Tags } from "lucide-react";
import CmsPostsManager from "./cms-posts-manager";
import CmsPagesManager from "./cms-pages-manager";
import CmsMediaManager from "./cms-media-manager";
import CmsUsersManager from "./cms-users-manager";
import CmsCommentsManager from "./cms-comments-manager";
import CmsCategoriesManager from "./cms-categories-manager";
import CmsTagsManager from "./cms-tags-manager";
import CmsMenusManager from "./cms-menus-manager";
import CmsSettingsManager from "./cms-settings-manager";

export default function CMSDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pollyfort CMS</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sistema completo de gerenciamento de conteúdo estilo WordPress
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="comments">Comentários</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="menus">Menus</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Publicados e rascunhos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários CMS</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Administradores e editores</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Arquivos de Mídia</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Imagens e documentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comentários</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Aguardando moderação</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setActiveTab("posts")} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Novo Post
                </Button>
                <Button 
                  onClick={() => setActiveTab("pages")} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Criar Nova Página
                </Button>
                <Button 
                  onClick={() => setActiveTab("media")} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Enviar Mídia
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas ações no sistema CMS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Post "Bem-vindos ao Pollyfort CMS" criado</p>
                      <p className="text-xs text-muted-foreground">Sistema CMS inicializado</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Categoria "Notícias" criada</p>
                      <p className="text-xs text-muted-foreground">Categoria padrão configurada</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Menu principal configurado</p>
                      <p className="text-xs text-muted-foreground">Sistema de navegação ativo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <CmsPostsManager />
        </TabsContent>

        <TabsContent value="pages">
          <CmsPagesManager />
        </TabsContent>

        <TabsContent value="media">
          <CmsMediaManager />
        </TabsContent>

        <TabsContent value="comments">
          <CmsCommentsManager />
        </TabsContent>

        <TabsContent value="categories">
          <CmsCategoriesManager />
        </TabsContent>

        <TabsContent value="tags">
          <CmsTagsManager />
        </TabsContent>

        <TabsContent value="menus">
          <CmsMenusManager />
        </TabsContent>

        <TabsContent value="settings">
          <CmsSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}