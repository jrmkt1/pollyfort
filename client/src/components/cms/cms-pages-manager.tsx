import CmsPostsManager from "./cms-posts-manager";

export default function CmsPagesManager() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Páginas</h2>
        <p className="text-muted-foreground">Crie e gerencie páginas estáticas do seu site</p>
      </div>
      
      {/* Reutiliza o componente de posts mas filtra apenas páginas */}
      <div className="[&_[data-type-filter]]:hidden">
        <CmsPostsManager />
      </div>
    </div>
  );
}