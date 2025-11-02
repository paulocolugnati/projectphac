import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Key, Copy, CheckCircle2, XCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Keys = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("license_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar chaves");
    } else {
      setKeys(data || []);
    }
    setLoading(false);
  };

  const createKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Digite um nome para a chave");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("license_keys")
      .insert({
        user_id: user.id,
        key_name: newKeyName,
      });

    if (error) {
      toast.error("Erro ao criar chave");
    } else {
      toast.success("Chave criada com sucesso!");
      setNewKeyName("");
      setDialogOpen(false);
      fetchKeys();
    }
  };

  const copyKey = (keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    toast.success("Chave copiada!");
  };

  const toggleKeyStatus = async (keyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from("license_keys")
      .update({ status: newStatus })
      .eq("id", keyId);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success(`Chave ${newStatus === 'active' ? 'ativada' : 'desativada'}!`);
      fetchKeys();
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Gerenciamento de Chaves</h2>
            <p className="text-muted-foreground">
              Gerencie suas chaves de licença para vincular aos scripts protegidos
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Gerar Nova Chave
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Gerar Nova Chave de Licença</DialogTitle>
                <DialogDescription>
                  Crie uma nova chave para vincular aos seus scripts protegidos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nome da Chave</Label>
                  <Input
                    className="glass"
                    placeholder="Ex: Servidor Alpha RP"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <Button variant="hero" className="w-full" onClick={createKey}>
                  Criar Chave
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {keys.length === 0 ? (
          <Card className="glass-strong p-12 text-center">
            <Key className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Nenhuma chave criada</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira chave de licença para começar a proteger seus scripts
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {keys.map((key) => (
              <Card key={key.id} className="glass-strong p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">{key.key_name}</h3>
                      {key.status === 'active' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-success/20 text-success flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Ativa
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-destructive/20 text-destructive flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inativa
                        </span>
                      )}
                    </div>

                    <div className="glass rounded-lg p-3 font-mono text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {key.key_value.substring(0, 8)}...{key.key_value.substring(key.key_value.length - 8)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyKey(key.key_value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Scripts vinculados: {key.scripts_count}</span>
                      <span>•</span>
                      <span>Criada em: {new Date(key.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={key.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleKeyStatus(key.id, key.status)}
                    >
                      {key.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Keys;
