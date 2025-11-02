import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Zap, Code2 } from "lucide-react";
import heroImage from "@/assets/hero-security.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                PhacProtect: O Escudo de IA Contra{" "}
                <span className="text-accent">Vazamentos de Scripts Lua</span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Use criptografia indestrutível e gerenciamento de licenças para proteger 
                o IP do seu servidor FiveM, sem comprometer a performance.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8 py-6 h-auto bg-accent hover:bg-accent/90 text-white">
                    Começar Agora
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto border-accent/30 hover:bg-accent/10">
                    Fazer Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="glass-strong rounded-2xl p-8 animate-float">
                <img 
                  src={heroImage} 
                  alt="PhacProtect Security Shield" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Proteção <span className="text-accent">Incomparável</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-strong rounded-2xl p-8 space-y-4 hover:scale-105 transition-smooth border border-accent/10">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Criptografia Forte</h3>
              <p className="text-muted-foreground">
                Ofuscação de bytecode Lua e criptografia AES vinculada à sua licença única.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 space-y-4 hover:scale-105 transition-smooth border border-accent/10">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Gerenciamento de Chaves</h3>
              <p className="text-muted-foreground">
                Controle total sobre as licenças. Revogue acesso instantaneamente se necessário.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 space-y-4 hover:scale-105 transition-smooth border border-accent/10">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Performance Zero</h3>
              <p className="text-muted-foreground">
                Proteção máxima sem impacto na velocidade de execução dos seus scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-strong rounded-3xl p-12 text-center space-y-6 border border-accent/20">
            <Code2 className="h-16 w-16 text-accent mx-auto" />
            <h2 className="text-4xl font-bold">
              Proteja Seu Trabalho <span className="text-accent">Hoje</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a milhares de desenvolvedores que confiam no PhacProtect 
              para proteger seu código e propriedade intelectual.
            </p>
            <Link to="/signup">
              <Button variant="hero" size="lg" className="text-lg px-12 py-6 h-auto mt-4 bg-accent hover:bg-accent/90 text-white">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 PhacProtect. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
