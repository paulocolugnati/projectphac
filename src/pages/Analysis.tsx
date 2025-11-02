import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Analysis = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Análise de Vulnerabilidade</h2>
          <p className="text-muted-foreground">
            Escaneie seus scripts em busca de falhas de segurança comuns (Em breve)
          </p>
        </div>

        <Card className="glass-strong p-12 text-center border-accent/20">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-accent" />
          <h3 className="text-2xl font-bold mb-2">Funcionalidade em Desenvolvimento</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            O módulo completo de análise de vulnerabilidade com IA está sendo implementado e estará disponível em breve. 
            Use a página de Criptografia para proteger seus scripts agora.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analysis;
