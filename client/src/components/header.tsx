import { useState, useEffect } from "react";
import { Link, useLocation, useRouter } from "wouter";
import { Search, Calculator, Menu, X, User, LogIn, LogOut, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import AuthForms from "@/components/auth-forms";
import headerLogo from "@assets/header-logo.png";

interface HeaderProps {
  onQuotationClick: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ onQuotationClick, onSearch }: HeaderProps) {
  const [location] = useLocation();
  const router = useRouter();
  const navigate = router[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [dynamicPages, setDynamicPages] = useState<any[]>([]);
  const { customer, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Load dynamic pages and setup event listeners
  useEffect(() => {
    // Load published pages from localStorage
    const loadDynamicPages = () => {
      const savedPages = localStorage.getItem('publishedPages');
      if (savedPages) {
        const pages = JSON.parse(savedPages);
        setDynamicPages(pages.filter((page: any) => page.showInNavigation !== false));
      }
    };

    loadDynamicPages();

    // Listen for navigation updates from CMS Builder
    const handleNavigationUpdated = (event: CustomEvent) => {
      loadDynamicPages();
    };

    const handlePagePublished = (event: CustomEvent) => {
      loadDynamicPages();
    };

    // Add event listeners
    window.addEventListener('navigationUpdated', handleNavigationUpdated as EventListener);
    window.addEventListener('pagePublished', handlePagePublished as EventListener);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('navigationUpdated', handleNavigationUpdated as EventListener);
      window.removeEventListener('pagePublished', handlePagePublished as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Static navigation items
  const staticNavigation = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/produtos" },
    { name: "Sobre nós", href: "/sobre-nos" },
    { name: "Contatos", href: "/contatos" },
    { name: "Cotação", href: "/cotacao" },
  ];

  // Combine static and dynamic navigation
  const navigation = [
    ...staticNavigation,
    ...dynamicPages.map(page => ({
      name: page.title,
      href: `/${page.slug}`,
      isDynamic: true
    }))
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-modern sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center py-4 px-6">
              <img 
                src={headerLogo} 
                alt="Pollyfort - Rodas e Peças para Empilhadeiras" 
                className="max-h-16 w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-4 xl:space-x-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className={`text-polly-gray hover:text-polly-orange transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                  location === item.href ? "text-polly-orange" : ""
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 lg:w-40 xl:w-48 pl-8 text-sm"
              />
              <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </form>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-polly-gray" />
            ) : (
              <Menu className="h-6 w-6 text-polly-gray" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                    <span className="block text-polly-gray hover:text-polly-orange transition-colors font-medium py-2">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </nav>

              
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
