
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Wrench, AlertCircle } from 'lucide-react';

interface MaintenanceConfig {
  enabled: boolean;
  title: string;
  message: string;
  estimatedTime: string;
  showContacts: boolean;
}

export default function MaintenancePage() {
  const [config, setConfig] = useState<MaintenanceConfig>({
    enabled: true,
    title: 'Site em Manutenção',
    message: 'Estamos realizando melhorias em nosso sistema. Voltaremos em breve!',
    estimatedTime: '',
    showContacts: true
  });

  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    const loadMaintenanceConfig = async () => {
      try {
        const response = await fetch('/api/maintenance');
        if (response.ok) {
          const serverConfig = await response.json();
          if (serverConfig) {
            setConfig(serverConfig);
          }
        } else {
          // Fallback para localStorage
          const savedConfig = localStorage.getItem('maintenanceMode');
          if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configuração de manutenção:', error);
        // Fallback para localStorage
        const savedConfig = localStorage.getItem('maintenanceMode');
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
        }
      }
    };

    loadMaintenanceConfig();

    // Load company logo from theme settings
    const savedTheme = localStorage.getItem('pollyfort-theme');
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      if (theme.logo) {
        setLogoUrl(theme.logo);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            {/* Logo Section */}
            <div className="mb-8">
              {logoUrl ? (
                <div className="mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={logoUrl} 
                      alt="Logo da empresa" 
                      className="mx-auto h-24 w-auto object-contain filter drop-shadow-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
                      <span className="text-white font-bold text-3xl transform -rotate-3">P</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Pollyfort
              </h1>
              <p className="text-xl text-blue-200 font-medium">
                Rodas para Empilhadeiras Elétricas
              </p>
            </div>

            {/* Maintenance Icon */}
            <div className="mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <Wrench className="w-10 h-10 text-white animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {config.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto mb-8">
                {config.message}
              </p>
              
              {config.estimatedTime && (
                <div className="inline-flex items-center gap-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-3 text-blue-100">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span className="font-semibold">
                    Previsão de retorno: {config.estimatedTime}
                  </span>
                </div>
              )}
            </div>

            {/* Loading Animation */}
            <div className="mb-10">
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-300 text-sm">Trabalhando duro para melhorar sua experiência</p>
            </div>

            {/* Contact Information */}
            {config.showContacts && (
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="group">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-green-400/30">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">Telefone</h4>
                    <p className="text-gray-300 font-medium">(19) 9 9912 8023</p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400/30">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                      <Mail className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">E-mail</h4>
                    <p className="text-gray-300 font-medium">contato@pollyfort.com</p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-red-400/30">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-12 transition-transform duration-300">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">Endereço</h4>
                    <p className="text-gray-300 font-medium">São Paulo, SP</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm backdrop-blur-sm bg-white/5 rounded-full px-6 py-2 inline-block border border-white/10">
              © 2025 Pollyfort. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>


    </div>
  );
}
