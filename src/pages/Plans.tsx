import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Shield, X, Infinity, Lock, Key, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Plans = () => {
  const [currentPlan, setCurrentPlan] = useState<string>("trial");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (data) {
      setCurrentPlan(data.plan);
    }
    setLoading(false);
  };

  const plans = [
    {
      id: "trial",
      name: "INICIAL",
      badge: "Grátis para Começar",
      price: "Gratuito",
      priceMonthly: null,
      priceYearly: null,
      credits: "10 Créditos",
      persistence: "24 Horas",
      maxKeys: "1 Chave",
      features: [
        "10 créditos iniciais",
        "Limite: 1 chave de licença",
        "Criptografia padrão (4 créditos)",
        "Análise de vulnerabilidade (2 créditos)",
        "Arquivos armazenados por 24h",
        "Suporte via email"
      ],
      limitations: [
        "Sem acesso a níveis avançados",
        "Limite de 1 chave",
        "Persistência de apenas 24h"
      ],
      icon: Shield,
      color: "text-muted-foreground",
      borderColor: "border-border"
    },
    {
      id: "basic",
      name: "BÁSICO",
      badge: "Ideal para Pequenas Lojas",
      price: "R$ 29,90",
      pricePeriod: "/mês",
      priceMonthly: 29.90,
      priceYearly: 299.00,
      credits: "40 Créditos",
      persistence: "72 Horas",
      maxKeys: "10 Chaves",
      features: [
        "40 créditos mensais renováveis",
        "Até 10 chaves de licença",
        "Criptografia padrão (4 créditos)",
        "Análise de vulnerabilidade (2 créditos)",
        "Arquivos armazenados por 72h",
        "Suporte prioritário",
        "Dashboard de métricas"
      ],
      limitations: [
        "Sem acesso a níveis avançados",
        "Limite de 10 chaves",
        "Persistência de apenas 72h"
      ],
      icon: Zap,
      color: "text-accent",
      borderColor: "border-accent/30"
    },
    {
      id: "infinite",
      name: "INFINITE",
      badge: "Recomendado",
      price: "R$ 89,90",
      pricePeriod: "/mês",
      priceMonthly: 89.90,
      priceYearly: 899.00,
      credits: "∞ Ilimitado",
      persistence: "∞ Permanente",
      maxKeys: "∞ Ilimitadas",
      features: [
        "Créditos ilimitados (∞)",
        "Chaves de licença ilimitadas (∞)",
        "Todos os níveis de criptografia",
        "Criptografia padrão (0 créditos)",
        "Criptografia avançada (0 créditos)",
        "Criptografia indetectável (0 créditos)",
        "Análise ilimitada (0 créditos)",
        "Armazenamento permanente (∞)",
        "Suporte premium 24/7",
        "Acesso antecipado a novos recursos"
      ],
      limitations: [],
      icon: Crown,
      color: "text-accent",
      borderColor: "border-accent",
      popular: true
    }
  ];

  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) {
      toast.info("Você já está neste plano");
      return;
    }
    toast.info("Funcionalidade de upgrade em desenvolvimento");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold">Escolha Seu <span className="text-accent">Plano</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proteja sua propriedade intelectual com o plano ideal para o seu negócio
          </p>
        </div>

        {/* Alert sobre persistência */}
        <Alert className="glass-strong border-accent/30 max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm">
            <strong>Importante:</strong> O tempo de persistência determina por quanto tempo seus arquivos criptografados 
            ficam armazenados no sistema. Escolha um plano de acordo com suas necessidades.
          </AlertDescription>
        </Alert>

        {/* Cards de Planos */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`glass-strong p-6 relative hover:scale-[1.02] transition-smooth ${
                  plan.popular ? `border-2 ${plan.borderColor}` : plan.borderColor
                } ${isCurrentPlan ? 'ring-2 ring-accent' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent hover:bg-accent/90 text-white px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-success hover:bg-success/90 text-white">
                      Seu Plano
                    </Badge>
                  </div>
                )}

                <div className="space-y-6 mt-2">
                  {/* Header */}
                  <div className="text-center space-y-3 pb-4 border-b border-border/50">
                    <Icon className={`h-12 w-12 mx-auto ${plan.color}`} />
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                      {!plan.popular && (
                        <p className="text-xs text-muted-foreground">{plan.badge}</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-accent">
                          {plan.price}
                        </span>
                        {plan.pricePeriod && (
                          <span className="text-muted-foreground text-sm">
                            {plan.pricePeriod}
                          </span>
                        )}
                      </div>
                      {plan.priceYearly && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ou R$ {plan.priceYearly.toFixed(2)}/ano (economize 17%)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Specs Rápidas */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="glass rounded-lg p-3 text-center">
                      <Lock className="h-4 w-4 mx-auto mb-1 text-accent" />
                      <p className="text-xs font-bold">{plan.credits}</p>
                      <p className="text-[10px] text-muted-foreground">Créditos</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <Key className="h-4 w-4 mx-auto mb-1 text-accent" />
                      <p className="text-xs font-bold">{plan.maxKeys}</p>
                      <p className="text-[10px] text-muted-foreground">Chaves</p>
                    </div>
                    <div className="glass rounded-lg p-3 text-center">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-accent" />
                      <p className="text-xs font-bold">{plan.persistence}</p>
                      <p className="text-[10px] text-muted-foreground">Armazenamento</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-border/50">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground leading-tight">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    variant={isCurrentPlan ? "outline" : "default"}
                    className={`w-full ${!isCurrentPlan && plan.popular ? 'bg-accent hover:bg-accent/90' : ''}`}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "✓ Plano Atual" : "Escolher Plano"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabela de Comparação Detalhada */}
        <Card className="glass-strong p-6 max-w-7xl mx-auto border-accent/20">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Comparação <span className="text-accent">Detalhada</span></h3>
              <p className="text-sm text-muted-foreground">
                Compare os custos operacionais de cada plano
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-accent/30">
                    <th className="text-left p-4 font-bold">Operação / Recurso</th>
                    <th className="text-center p-4 font-bold">INICIAL</th>
                    <th className="text-center p-4 font-bold">BÁSICO</th>
                    <th className="text-center p-4 font-bold text-accent">INFINITE</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Créditos Iniciais/Mensais</td>
                    <td className="text-center p-4">10 créditos</td>
                    <td className="text-center p-4">40 créditos</td>
                    <td className="text-center p-4 font-bold text-accent">∞ Ilimitado</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Gerar Chave de Licença</td>
                    <td className="text-center p-4">0 C (Máx. 1)</td>
                    <td className="text-center p-4">0 C (Máx. 10)</td>
                    <td className="text-center p-4 font-bold text-accent">0 C (∞)</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Criptografia Padrão</td>
                    <td className="text-center p-4">4 créditos</td>
                    <td className="text-center p-4">4 créditos</td>
                    <td className="text-center p-4 font-bold text-success">0 créditos</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Criptografia Avançada</td>
                    <td className="text-center p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <X className="h-3 w-3" /> Bloqueado
                      </span>
                    </td>
                    <td className="text-center p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <X className="h-3 w-3" /> Bloqueado
                      </span>
                    </td>
                    <td className="text-center p-4 font-bold text-success">0 créditos</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Criptografia Indetectável</td>
                    <td className="text-center p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <X className="h-3 w-3" /> Bloqueado
                      </span>
                    </td>
                    <td className="text-center p-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <X className="h-3 w-3" /> Bloqueado
                      </span>
                    </td>
                    <td className="text-center p-4 font-bold text-success">0 créditos</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Análise de Vulnerabilidade</td>
                    <td className="text-center p-4">2 créditos</td>
                    <td className="text-center p-4">2 créditos</td>
                    <td className="text-center p-4 font-bold text-success">0 créditos</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Tempo de Persistência</td>
                    <td className="text-center p-4">24 horas</td>
                    <td className="text-center p-4">72 horas</td>
                    <td className="text-center p-4 font-bold text-accent">∞ Permanente</td>
                  </tr>
                  <tr className="hover:bg-accent/5 transition-smooth">
                    <td className="p-4 font-medium">Suporte</td>
                    <td className="text-center p-4">Email</td>
                    <td className="text-center p-4">Prioritário</td>
                    <td className="text-center p-4 font-bold text-accent">Premium 24/7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <Card className="glass-strong p-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Perguntas <span className="text-accent">Frequentes</span></h3>
            
            <div className="space-y-4">
              <div className="glass rounded-lg p-4">
                <p className="font-bold mb-2">O que são créditos?</p>
                <p className="text-sm text-muted-foreground">
                  Créditos são usados para realizar operações no PhacProtect, como criptografar scripts (4 créditos) 
                  e analisar vulnerabilidades (2 créditos). O Plano Infinite oferece créditos ilimitados (∞).
                </p>
              </div>

              <div className="glass rounded-lg p-4">
                <p className="font-bold mb-2">O que acontece quando acaba o tempo de persistência?</p>
                <p className="text-sm text-muted-foreground">
                  Após o período (24h, 72h ou permanente), os arquivos criptografados são removidos do sistema por 
                  questões de privacidade. Seus scripts já instalados continuam funcionando normalmente.
                </p>
              </div>

              <div className="glass rounded-lg p-4">
                <p className="font-bold mb-2">Posso fazer upgrade do plano a qualquer momento?</p>
                <p className="text-sm text-muted-foreground">
                  Sim! Você pode fazer upgrade para um plano superior a qualquer momento e os créditos restantes 
                  do plano atual serão mantidos.
                </p>
              </div>

              <div className="glass rounded-lg p-4">
                <p className="font-bold mb-2">O Plano Infinite é realmente ilimitado?</p>
                <p className="text-sm text-muted-foreground">
                  Sim! Com o Plano Infinite você tem créditos ilimitados (∞), chaves ilimitadas (∞) e 
                  armazenamento permanente (∞) de todos os seus arquivos criptografados.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Plans;
