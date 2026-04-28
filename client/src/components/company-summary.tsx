import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CompanySummary() {
  const [, setLocation] = useLocation();

  const handleContactClick = () => {
    setLocation('/contatos');
  };

  const handleLearnMoreClick = () => {
    setLocation('/sobre-nos');
  };
  return (
    <div className="bg-gray-100 py-20">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  Conheça Nossa Empresa
                </div>
                <h2 className="text-4xl font-bold text-[#314D85] mb-6 leading-tight">
                  Sobre a Pollyfort
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  Especialistas em soluções para empilhadeiras elétricas, oferecemos produtos de alta qualidade 
                  para manter seus equipamentos funcionando com máxima eficiência e segurança.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-orange-600 text-lg">🔧</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expertise Técnica</h3>
                    <p className="text-sm text-gray-600">
                      Anos de experiência em manutenção e peças para empilhadeiras
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600 text-lg">⚡</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Entrega Rápida</h3>
                    <p className="text-sm text-gray-600">
                      Logística eficiente para minimizar o tempo de parada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-green-600 text-lg">✓</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Qualidade Garantida</h3>
                    <p className="text-sm text-gray-600">
                      Produtos testados e aprovados para uso industrial
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-purple-600 text-lg">📞</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Suporte Dedicado</h3>
                    <p className="text-sm text-gray-600">
                      Atendimento especializado para suas necessidades
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleContactClick}
                  className="bg-[#314D85] hover:bg-[#4A6FA5] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  Entre em Contato
                </Button>
                <Button 
                  onClick={handleLearnMoreClick}
                  variant="outline"
                  className="border-2 border-orange-400 text-orange-700 hover:bg-orange-100 hover:border-orange-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
            
            {/* Stats/Highlights */}
            <div className="bg-gradient-to-br from-[#314D85] to-[#4A6FA5] rounded-2xl p-8 text-white shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">Por que escolher a Pollyfort?</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-300 mb-2">15+</div>
                  <div className="text-sm text-blue-100">Anos de Experiência</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-300 mb-2">500+</div>
                  <div className="text-sm text-blue-100">Clientes Atendidos</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-300 mb-2">24h</div>
                  <div className="text-sm text-blue-100">Tempo de Resposta</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-300 mb-2">98%</div>
                  <div className="text-sm text-blue-100">Satisfação do Cliente</div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-center text-blue-100">
                  "Nosso compromisso é manter suas operações funcionando sem interrupções, 
                  fornecendo peças de qualidade e suporte técnico especializado."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}