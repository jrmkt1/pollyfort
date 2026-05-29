import { Facebook, Instagram, Linkedin, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import headerLogo from "@assets/header-logo.png";

export default function Footer() {
  return (
    <footer className="bg-polly-blue text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-8">
              <img
                src={headerLogo}
                alt="Pollyfort - Rodas e Pecas para Empilhadeiras"
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-blue-100 mb-8 max-w-md text-lg leading-relaxed">
              Especialistas em rodas e pecas para empilhadeiras eletricas. Oferecemos solucoes completas
              com qualidade e durabilidade incomparaveis.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-blue-200 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/10">
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Links Rapidos</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Inicio</Link></li>
              <li><Link href="/produtos" className="text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Produtos</Link></li>
              <li><Link href="/sobre-nos" className="text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Sobre nos</Link></li>
              <li><Link href="/contatos" className="text-blue-100 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Contatos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start group">
                <div className="bg-white/10 p-2 rounded-lg mr-4 group-hover:bg-white/20 transition-colors">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-blue-100 group-hover:text-white transition-colors">
                  vendas@pollyfortrodas.com.br<br />
                  comercial@pollyfortrodas.com.br
                </span>
              </div>
              <div className="flex items-start group">
                <div className="bg-white/10 p-2 rounded-lg mr-4 group-hover:bg-white/20 transition-colors">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-blue-100 group-hover:text-white transition-colors">
                  R Antonio do Valle Melo, 88<br />
                  Centro, Sumare - SP<br />
                  CEP: 13170-010
                </span>
              </div>
              <div className="flex items-start group">
                <div className="bg-white/10 p-2 rounded-lg mr-4 group-hover:bg-white/20 transition-colors">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-blue-100 group-hover:text-white transition-colors">
                  Isabelle Grandolfi: (19) 9 8228-5152<br />
                  Juliano Malagezi: (19) 9 9419-4339
                </span>
              </div>
              <div className="flex items-center group">
                <div className="bg-white/10 p-2 rounded-lg mr-4 group-hover:bg-white/20 transition-colors">
                  <div className="h-5 w-5 text-white text-xs font-bold flex items-center justify-center">CNPJ</div>
                </div>
                <span className="text-blue-100 group-hover:text-white transition-colors">45.647.003/0001-50</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-16 pt-10 text-center">
          <p className="text-blue-100 text-lg">&copy; 2024 Pollyfort. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
