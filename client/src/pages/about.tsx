import { useEffect } from "react";
import { Award, Users, Target, Zap, CheckCircle, Clock, Shield, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroBg from "@assets/bg1.jpg";

export default function About() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const stats = [
    { number: "15+", label: "Anos de Experiência" },
    { number: "5000+", label: "Clientes Satisfeitos" },
    { number: "50000+", label: "Peças Entregues" },
    { number: "24h", label: "Suporte Técnico" }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-polly-orange" />,
      title: "Qualidade Garantida",
      description: "Todas as nossas peças passam por rigoroso controle de qualidade e atendem aos mais altos padrões industriais."
    },
    {
      icon: <Clock className="h-8 w-8 text-polly-orange" />,
      title: "Entrega Rápida",
      description: "Logística otimizada para garantir que suas operações nunca parem. Entregas expressas disponíveis."
    },
    {
      icon: <Users className="h-8 w-8 text-polly-orange" />,
      title: "Equipe Especializada",
      description: "Nossos técnicos possuem ampla experiência em equipamentos industriais e estão sempre prontos para ajudar."
    },
    {
      icon: <Star className="h-8 w-8 text-polly-orange" />,
      title: "Atendimento Premium",
      description: "Suporte personalizado para cada cliente, desde a cotação até o pós-venda, garantindo sua total satisfação."
    }
  ];



  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-32 flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(49, 77, 133, 0.8), rgba(229, 90, 58, 0.8)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Sobre a Pollyfort
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Sua parceira de confiança em soluções completas para empilhadeiras elétricas há mais de 15 anos
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-polly-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Fornecer soluções completas em rodas e peças para empilhadeiras elétricas, 
                garantindo a máxima performance e durabilidade dos equipamentos industriais 
                de nossos clientes.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Acreditamos que cada operação industrial é única e merece atenção especializada. 
                Por isso, oferecemos produtos de alta qualidade, suporte técnico especializado 
                e atendimento personalizado para cada necessidade.
              </p>
              <div className="flex items-center gap-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700 font-medium">Compromisso com a excelência</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700 font-medium">Inovação contínua</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700 font-medium">Sustentabilidade industrial</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroBg} 
                alt="Pollyfort - Qualidade e Inovação"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-polly-blue bg-opacity-20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Os princípios que nos guiam em cada projeto e relacionamento com nossos clientes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-card hover:shadow-modern transition-all duration-300">
                <div className="flex items-center mb-4">
                  {value.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-polly-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Conhecer Nossas Soluções?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Entre em contato conosco e descubra como podemos otimizar suas operações industriais
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={scrollToContact}
              variant="secondary"
              size="lg"
              className="bg-white text-polly-blue hover:bg-gray-100 shadow-lg"
            >
              Fale Conosco
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-polly-blue shadow-lg"
              onClick={() => window.location.href = "/#quotation"}
            >
              Solicitar Cotação
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
