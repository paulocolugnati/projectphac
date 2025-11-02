import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Key, AlertCircle, ArrowRight, TrendingUp, HelpCircle, MessageSquare, Mail, Book, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    protectionAverage: 0,
    creditsRemaining: 0,
    activeLicenses: 0,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar perfil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(profileData);

      // Buscar número de scripts protegidos
      const { count: encryptionCount } = await supabase
        .from("encryption_logs")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("status", "completed");

      // Buscar chaves ativas
      const { count: keysCount } = await supabase
        .from("license_keys")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("status", "active");

      // Buscar análises críticas
      const { count: criticalCount } = await supabase
        .from("analysis_logs")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .eq("risk_level", "high");

      setStats({
        protectionAverage: encryptionCount ? Math.min((encryptionCount / 10) * 100, 100) : 0,
        creditsRemaining: profileData?.credits || 0,
        activeLicenses: keysCount || 0,
        criticalAlerts: criticalCount || 0
      });
    } catch (error: any) {
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="glass-strong rounded-lg p-6">
            <div className="animate-pulse text-center space-y-3">
              <div className="h-12 w-12 bg-primary/20 rounded-full mx-auto"></div>
              <p className="text-muted-foreground text-sm">Carregando sistema...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Card de Saudação */}
        <Card className="glass-strong border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success animate-pulse-glow"></div>
              <span className="text-xs font-bold text-muted-foreground tracking-wider">
                SISTEMA ATIVO
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Olá, {profile?.name || 'Usuário'}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Sua Propriedade Intelectual está protegida.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Servidor/Loja: <span className="text-foreground font-medium">{profile?.company_name || 'N/A'}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Card CTA */}
        <Card className="glass-strong border-primary/10 hover:border-primary/20 transition-smooth cursor-pointer group" onClick={() => navigate("/dashboard/encrypt")}>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Sua Proteção de IP Exige Atenção?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Criptografe seus scripts Lua agora e proteja seu código contra vazamentos e uso não autorizado.
                </p>
              </div>
              <ArrowRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-smooth flex-shrink-0 ml-4" />
            </div>
            
            <Button variant="default" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              Ir para Criptografia de Scripts
            </Button>
          </div>
        </Card>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status de Proteção */}
          <Card className="glass-strong border-primary/10 hover:scale-105 transition-smooth">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wider">
                  STATUS DE PROTEÇÃO
                </p>
                <p className="text-3xl font-bold">
                  {stats.protectionAverage.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Média de Código Protegido
                </p>
              </div>
            </div>
          </Card>

          {/* Créditos Restantes */}
          <Card className="glass-strong border-primary/10 hover:scale-105 transition-smooth">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wider">
                  CRÉDITOS RESTANTES
                </p>
                <p className="text-3xl font-bold text-success">
                  {stats.creditsRemaining}
                </p>
                <p className="text-xs text-muted-foreground">
                  Disponíveis para uso
                </p>
              </div>
            </div>
          </Card>

          {/* Chaves de Licença */}
          <Card className="glass-strong border-primary/10 hover:scale-105 transition-smooth">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wider">
                  CHAVES DE LICENÇA
                </p>
                <p className="text-3xl font-bold">
                  {stats.activeLicenses}
                </p>
                <p className="text-xs text-muted-foreground">
                  Licenças ativas
                </p>
              </div>
            </div>
          </Card>

          {/* Vulnerabilidade */}
          <Card className="glass-strong border-destructive/10 hover:scale-105 transition-smooth">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wider">
                  VULNERABILIDADE
                </p>
                <p className="text-3xl font-bold text-destructive">
                  {stats.criticalAlerts}
                </p>
                <p className="text-xs text-muted-foreground">
                  Alertas Críticos
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Cards de Ação Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="glass-strong border-primary/10 hover:border-primary/20 transition-smooth cursor-pointer group"
            onClick={() => navigate("/dashboard/encrypt")}
          >
            <div className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Criptografar Script</h3>
              <p className="text-sm text-muted-foreground">
                Proteja seus scripts Lua com criptografia indestrutível
              </p>
            </div>
          </Card>

          <Card 
            className="glass-strong border-primary/10 hover:border-primary/20 transition-smooth cursor-pointer group"
            onClick={() => navigate("/dashboard/keys")}
          >
            <div className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Gerenciar Chaves</h3>
              <p className="text-sm text-muted-foreground">
                Crie e controle suas licenças de acesso
              </p>
            </div>
          </Card>

          <Card 
            className="glass-strong border-primary/10 hover:border-primary/20 transition-smooth cursor-pointer group"
            onClick={() => navigate("/dashboard/analysis")}
          >
            <div className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Análise de Segurança</h3>
              <p className="text-sm text-muted-foreground">
                Escaneie vulnerabilidades em seus scripts
              </p>
            </div>
          </Card>
        </div>

        {/* Central de Ajuda */}
        <Card className="glass-strong border-primary/10">
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Central de Ajuda</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Perguntas Frequentes */}
              <Card className="glass border-primary/10 hover:border-primary/20 transition-smooth">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Perguntas Frequentes</h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Como funciona a criptografia?</p>
                    <p>• O que são chaves de licença?</p>
                    <p>• Como analisar vulnerabilidades?</p>
                    <p>• Política de 72 horas de histórico</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Todas as FAQs
                  </Button>
                </div>
              </Card>

              {/* Suporte Técnico */}
              <Card className="glass border-primary/10 hover:border-primary/20 transition-smooth">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Suporte Técnico</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Precisa de ajuda? Nossa equipe está pronta para auxiliar você.
                  </p>
                  <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
                    Abrir Chamado
                  </Button>
                </div>
              </Card>

              {/* Documentação */}
              <Card className="glass border-primary/10 hover:border-primary/20 transition-smooth">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Documentação</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Guias completos e tutoriais para usar o PhacProtect.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Acessar Docs
                  </Button>
                </div>
              </Card>

              {/* Links Rápidos */}
              <Card className="glass border-primary/10 hover:border-primary/20 transition-smooth">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">Links Rápidos</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                      → Termos de Serviço
                    </a>
                    <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                      → Política de Privacidade
                    </a>
                    <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                      → Status do Sistema
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
