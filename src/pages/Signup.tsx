import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Step 1 data
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  // Step 2 data
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password requirements
  const [requirements, setRequirements] = useState({
    length: false,
    special: false,
    number: false,
    letter: false,
  });

  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password),
    });
  }, [password]);

  const allRequirementsMet = Object.values(requirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email || !age) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    if (parseInt(age) < 18) {
      toast.error("Você precisa ter 18 anos ou mais.");
      return;
    }
    setStep(2);
  };

  const [loading, setLoading] = useState(false);

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequirementsMet) {
      toast.error("Por favor, atenda a todos os requisitos de senha.");
      return;
    }
    if (!passwordsMatch) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email,
        password,
        name,
        company_name: company,
        age: parseInt(age),
      });
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-md">
          <div className="glass-strong rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">
                {step === 1 ? "Criar Conta" : "Configurar Segurança"}
              </h1>
              <p className="text-muted-foreground">
                {step === 1 
                  ? "Comece a proteger seus scripts hoje" 
                  : "Defina uma senha forte para sua conta"
                }
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-12 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Nome do Servidor/Loja/Empresa</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Nome da sua empresa"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="glass"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="18+"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="glass"
                    required
                    min="18"
                  />
                  <p className="text-xs text-muted-foreground">
                    Você confirma ter 18 anos ou mais?
                  </p>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg">
                  Avançar para Segurança
                </Button>
              </form>
            ) : (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass"
                    required
                  />
                </div>

                {/* Password requirements */}
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
                        Pelo menos 1 caractere especial (!@#$)
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass"
                    required
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

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="glass" 
                    className="w-full" 
                    size="lg"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full" 
                    size="lg"
                    disabled={!allRequirementsMet || !passwordsMatch || loading}
                  >
                    {loading ? "Criando Conta..." : "Criar Minha Conta Segura"}
                  </Button>
                </div>
              </form>
            )}

            {step === 1 && (
              <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Faça login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
