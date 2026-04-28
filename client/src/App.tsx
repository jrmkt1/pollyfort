import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { initializeTracking } from "@/lib/tracking";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { RecentlyViewedProvider } from "@/hooks/use-recently-viewed";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CompanySummary from "@/components/company-summary";
import Home from "@/pages/home";
import Products from "@/pages/products";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import UserRegister from "@/pages/user-register";
import Quotations from "@/pages/quotations";
import CategoriesTest from "@/pages/categories-test";
import MyQuotations from "@/pages/my-quotations";
import QuotationHistory from "@/pages/quotation-history";
import About from "@/pages/about";
import Contacts from "@/pages/contacts";
import Quotation from "@/pages/quotation";
import MaintenancePage from "@/pages/maintenance";
import NotFound from "@/pages/not-found";
import { WhatsAppFloat } from "@/components/whatsapp-float";

// Global error handlers
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Network connection issue detected. The application will retry automatically.');
  event.preventDefault(); // Prevent default browser behavior
});

window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  event.preventDefault(); // Prevent default browser behavior
});

function Router() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location] = useLocation();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [maintenanceChecked, setMaintenanceChecked] = useState<boolean>(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Check maintenance mode only on initial mount, not on every route change
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/maintenance');
        if (response.ok) {
          const config = await response.json();
          setIsMaintenanceMode(config.enabled || false);
        } else {
          // Fallback para localStorage se API falhar
          const maintenanceConfig = localStorage.getItem('maintenanceMode');
          if (maintenanceConfig) {
            const config = JSON.parse(maintenanceConfig);
            setIsMaintenanceMode(config.enabled || false);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar modo de manutenção:', error);
        // Fallback para localStorage
        const maintenanceConfig = localStorage.getItem('maintenanceMode');
        if (maintenanceConfig) {
          const config = JSON.parse(maintenanceConfig);
          setIsMaintenanceMode(config.enabled || false);
        }
      } finally {
        setMaintenanceChecked(true);
      }
    };

    if (!maintenanceChecked) {
      checkMaintenanceMode();
    }
  }, [maintenanceChecked]);

  // Listen for maintenance mode changes via custom event
  useEffect(() => {
    const handleMaintenanceChange = (event: CustomEvent) => {
      setIsMaintenanceMode(event.detail.enabled);
    };

    window.addEventListener('maintenanceToggle', handleMaintenanceChange as EventListener);
    
    return () => {
      window.removeEventListener('maintenanceToggle', handleMaintenanceChange as EventListener);
    };
  }, []);

  // Periodic check for maintenance mode changes (every 30 seconds)
  useEffect(() => {
    const pollMaintenanceMode = async () => {
      try {
        const response = await fetch('/api/maintenance');
        if (response.ok) {
          const config = await response.json();
          const newState = config.enabled || false;
          if (newState !== isMaintenanceMode) {
            setIsMaintenanceMode(newState);
          }
        }
      } catch (error) {
        // Silent error handling - don't log if just polling
      }
    };

    const interval = setInterval(pollMaintenanceMode, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [isMaintenanceMode]);

  const handleQuotationClick = () => {
    const quotationSection = document.getElementById("quotation");
    if (quotationSection) {
      quotationSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle smooth scrolling for same-page navigation
  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to products page for search
    if (window.location.pathname !== "/produtos") {
      window.history.pushState({}, "", "/produtos");
    }
  };

  const isAdminPage = location === "/admin" || location === "/admin-login" || location === "/user-register" || location === "/quotations";

  // If maintenance mode is active and not an admin page, show maintenance page
  if (isMaintenanceMode && !isAdminPage) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Header onQuotationClick={handleQuotationClick} onSearch={handleSearch} />}
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={() => <Home searchQuery={searchQuery} />} />
          <Route path="/produtos" component={() => <Products searchQuery={searchQuery} />} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/user-register" component={UserRegister} />
          <Route path="/quotations" component={Quotations} />
          <Route path="/categories-test" component={CategoriesTest} />
          <Route path="/my-quotations" component={MyQuotations} />
          <Route path="/quotation-history" component={QuotationHistory} />
          <Route path="/sobre-nos" component={About} />
          <Route path="/contatos" component={Contacts} />
          <Route path="/cotacao" component={Quotation} />
          <Route path="/maintenance" component={MaintenancePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {!isAdminPage && <CompanySummary />}
      {!isAdminPage && <Footer />}
      
      {/* WhatsApp Float Button - always visible except in admin pages and maintenance mode */}
      {!isAdminPage && !isMaintenanceMode && <WhatsAppFloat />}
    </div>
  );
}

function App() {
  useEffect(() => {
    initializeTracking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <RecentlyViewedProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </RecentlyViewedProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
