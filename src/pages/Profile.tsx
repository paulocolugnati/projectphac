import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { User, Building, Calendar, Shield, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [requirements, setRequirements] = useState({
    length: false,
    special: false,
    number: false,
    letter: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setRequirements({
      length: newPassword.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      number: /\d/.test(newPassword),
      letter: /[a-zA-Z]/.test(newPassword),
    });
  }, [newPassword]);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Erro ao carregar perfil");
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const handlePasswordChange = async () => {
    if (!allRequirementsMet || !passwordsMatch) {
      toast.error("Verifique os requisitos de senha");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("A nova senha deve ser diferente da antiga");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Senha alterada com sucesso!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar senha");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !profile) {
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
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-3xl font-bold mb-2">Perfil</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações de segurança
          </p>
        </div>

        {/* Informações do Perfil */}
        <Card className="glass-strong p-6 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informações Pessoais
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome
              </Label>
              <Input
                className="glass"
                value={profile.name}
                disabled
              />
              {profile.name_change_used && (
                <p className="text-xs text-muted-foreground">
                  Nome já foi alterado (limite: 1 alteração)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Empresa/Servidor
              </Label>
              <Input
                className="glass"
                value={profile.company_name}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Idade
              </Label>
              <Input
                className="glass"
                value={profile.age}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Plano
              </Label>
              <Input
                className="glass uppercase font-bold"
                value={profile.plan}
                disabled
              />
            </div>
          </div>
        </Card>

        {/* Alteração de Senha */}
        <Card className="glass-strong p-6 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Segurança da Conta
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Senha Atual</Label>
              <Input
                type="password"
                className="glass"
                placeholder="Digite sua senha atual"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input
                type="password"
                className="glass"
                placeholder="Digite a nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {newPassword && (
              <div className="space-y-2 text-sm">
                <p className="font-medium">Requisitos de senha:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {requirements.length ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                    <span className={requirements.length ? 'text-success' : 'text-muted-foreground'}>
                      Mínimo de 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {requirements.special ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                    <span className={requirements.special ? 'text-success' : 'text-muted-foreground'}>
                      Pelo menos 1 caractere especial
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {requirements.number ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                    <span className={requirements.number ? 'text-success' : 'text-muted-foreground'}>
                      Pelo menos 1 número
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {requirements.letter ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                    <span className={requirements.letter ? 'text-success' : 'text-muted-foreground'}>
                      Pelo menos 1 letra
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
              <Input
                type="password"
                className="glass"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {passwordsMatch ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-success">Senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-destructive" />
                      <span className="text-destructive">Senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="hero"
              onClick={handlePasswordChange}
              disabled={!oldPassword || !allRequirementsMet || !passwordsMatch || updating}
            >
              {updating ? "Atualizando..." : "Alterar Senha"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
