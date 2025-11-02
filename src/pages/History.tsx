import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { History as HistoryIcon, CheckCircle2, XCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error("Erro ao carregar histórico");
    } else {
      setLogs(data || []);
    }
    setLoading(false);
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
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Histórico de Atividades</h2>
          <p className="text-muted-foreground">
            Acompanhe todas as ações realizadas em sua conta
          </p>
        </div>

        {logs.length === 0 ? (
          <Card className="glass-strong p-12 text-center">
            <HistoryIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Nenhuma atividade registrada</h3>
            <p className="text-muted-foreground">
              Suas atividades aparecerão aqui conforme você usar o sistema
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Card 
                key={log.id} 
                className={`glass-strong p-6 transition-smooth ${
                  log.status === 'failed' ? 'hover:border-destructive/30 cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (log.status === 'failed') {
                    setSelectedLog(log);
                    setShowErrorModal(true);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {log.status === 'success' ? (
                      <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                    ) : log.status === 'failed' ? (
                      <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <XCircle className="h-5 w-5 text-destructive" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-warning" />
                      </div>
                    )}
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-bold text-lg">{log.action}</p>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                          {log.status === 'success' ? '🟢 Sucesso' : log.status === 'failed' ? '🔴 Falha' : '⚠️ Pendente'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground font-medium">{log.item_name}</p>
                      
                      {log.status === 'failed' && (
                        <div className="flex items-center gap-2 text-xs text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Clique para ver detalhes do erro</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {log.credits_used > 0 && (
                      <span className="text-sm font-bold text-primary">
                        -{log.credits_used} créditos
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Detalhes de Erro */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="glass-strong border-destructive/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                Detalhes do Erro
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre a falha ocorrida
              </DialogDescription>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-4 mt-4">
                <div className="glass border-primary/10 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ação:</span>
                    <span className="font-bold">{selectedLog.action}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Item:</span>
                    <span className="font-medium">{selectedLog.item_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data/Hora:</span>
                    <span className="text-sm">{new Date(selectedLog.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="destructive">🔴 Falha</Badge>
                  </div>
                </div>

                <div className="glass border-destructive/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-destructive font-bold">
                    <Info className="h-4 w-4" />
                    <span>Mensagem de Erro:</span>
                  </div>
                  <p className="text-sm text-muted-foreground bg-destructive/5 p-3 rounded-md font-mono">
                    {selectedLog.details || 'Erro desconhecido. Entre em contato com o suporte para mais informações.'}
                  </p>
                </div>

                <div className="glass border-primary/10 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Dica:</strong> Se o problema persistir, entre em contato com o suporte técnico 
                    informando o ID do log: <code className="bg-primary/10 px-2 py-1 rounded">{selectedLog.id}</code>
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default History;
