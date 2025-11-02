import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, FileCode, X, AlertCircle, Loader2, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { EncryptionTutorial } from "@/components/EncryptionTutorial";
import { useLicenseKeys } from "@/hooks/useLicenseKeys";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const Encrypt = () => {
  const [file, setFile] = useState<File | null>(null);
  const [protectionLevel, setProtectionLevel] = useState("standard");
  const [licenseKeyId, setLicenseKeyId] = useState("");
  const [customName, setCustomName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [result, setResult] = useState<{
    loaderCode: string;
    fileName: string;
  } | null>(null);

  const { keys } = useLicenseKeys();
  const { data: profile } = useProfile();

  const activeKeys = keys?.filter(k => k.status === 'active') || [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFile = acceptedFiles[0];
    if (validFile) {
      const ext = validFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'lua') {
        setFile(validFile);
        setCustomName(validFile.name.replace('.lua', ''));
      } else {
        toast.error("Apenas arquivos .lua são permitidos");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.lua'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
    setCustomName("");
  };

  const handleProcess = async () => {
    if (!file) {
      toast.error("Adicione um arquivo");
      return;
    }
    if (!licenseKeyId) {
      toast.error("Selecione uma chave de licença");
      return;
    }
    if (!customName.trim()) {
      toast.error("Digite um nome para identificar esta criptografia");
      return;
    }

    // Check plan limitations
    if (profile?.plan === 'trial' || profile?.plan === 'basic') {
      if (protectionLevel !== 'standard') {
        toast.error("Níveis avançados disponíveis apenas no Plano Infinite");
        return;
      }
    }

    // Check credits
    const creditsNeeded = 4;
    if (profile?.plan !== 'infinite' && (profile?.credits || 0) < creditsNeeded) {
      toast.error("Créditos insuficientes. Faça upgrade do seu plano.");
      return;
    }

    setProcessing(true);
    setShowTutorial(true);

    try {
      const fileContent = await file.text();

      const { data, error } = await supabase.functions.invoke('encrypt-script', {
        body: {
          fileContent,
          fileName: file.name,
          licenseKeyId,
          protectionLevel,
          customName: customName.trim(),
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        loaderCode: data.loaderCode,
        fileName: data.fileName,
      });

      toast.success("Criptografia concluída com sucesso!");
    } catch (error: any) {
      console.error('Encryption error:', error);
      toast.error(error.message || "Erro ao processar arquivo");
    } finally {
      setProcessing(false);
    }
  };

  const copyLoaderCode = () => {
    if (result) {
      navigator.clipboard.writeText(result.loaderCode);
      toast.success("Código do loader copiado!");
    }
  };

  const downloadLoaderCode = () => {
    if (result) {
      const blob = new Blob([result.loaderCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download iniciado!");
    }
  };

  const creditsNeeded = 4;
  const hasEnoughCredits = profile?.plan === 'infinite' || (profile?.credits || 0) >= creditsNeeded;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Criptografia de Scripts</h2>
          <p className="text-muted-foreground">
            Proteja seus scripts Lua com criptografia avançada e ofuscação inteligente
          </p>
        </div>

        {showTutorial && !result && (
          <EncryptionTutorial fileName={file?.name || 'script.lua'} />
        )}

        {result && (
          <Card className="glass-strong border-accent/20 p-6 space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-xl font-bold">Criptografia Concluída!</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Código do Loader - {result.fileName}</Label>
                <div className="relative mt-2">
                  <Textarea
                    readOnly
                    value={result.loaderCode}
                    className="glass font-mono text-xs h-48"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyLoaderCode}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadLoaderCode}>
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
              </div>

              <EncryptionTutorial fileName={result.fileName} />

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setCustomName("");
                  setShowTutorial(false);
                }}
              >
                Criptografar Novo Script
              </Button>
            </div>
          </Card>
        )}

        {!result && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Etapa 1: Upload */}
              <Card className="glass-strong p-6 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">1</span>
                  Upload de Arquivo Lua
                </h3>

                <div
                  {...getRootProps()}
                  className={`
                    glass border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                    transition-smooth hover:border-accent/50
                    ${isDragActive ? 'border-accent bg-accent/5' : 'border-border'}
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-lg">Solte o arquivo aqui...</p>
                  ) : (
                    <>
                      <p className="text-lg mb-2">Arraste e solte seu arquivo .lua aqui</p>
                      <p className="text-sm text-muted-foreground">
                        ou clique para selecionar (máximo: 50MB)
                      </p>
                    </>
                  )}
                </div>

                {file && (
                  <div className="flex items-center justify-between glass p-4 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-3">
                      <FileCode className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Card>

              {/* Etapa 2: Configuração */}
              <Card className="glass-strong p-6 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">2</span>
                  Configuração de Proteção
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Criptografia</Label>
                    <Input
                      className="glass"
                      placeholder="Ex: Script de Roupas v2.0"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use este nome para identificar facilmente no histórico
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Nível de Proteção</Label>
                    <Select value={protectionLevel} onValueChange={setProtectionLevel}>
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          Padrão (4 créditos) - Ofuscação + Bytecode
                        </SelectItem>
                        <SelectItem 
                          value="advanced"
                          disabled={profile?.plan !== 'infinite'}
                        >
                          {profile?.plan !== 'infinite' ? '🔒 ' : ''}Avançado (8 créditos) - Anti-Debug + Múltiplas Camadas
                        </SelectItem>
                        <SelectItem 
                          value="undetectable"
                          disabled={profile?.plan !== 'infinite'}
                        >
                          {profile?.plan !== 'infinite' ? '🔒 ' : ''}Indetectável (16 créditos) - IA-Driven + Máxima Segurança
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {profile?.plan !== 'infinite' && protectionLevel !== 'standard' && (
                      <p className="text-xs text-accent">
                        Níveis avançados disponíveis no Plano Infinite
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Chave de Licença</Label>
                    <Select value={licenseKeyId} onValueChange={setLicenseKeyId}>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Selecione uma chave ativa" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeKeys.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Nenhuma chave ativa encontrada
                          </SelectItem>
                        ) : (
                          activeKeys.map((key) => (
                            <SelectItem key={key.id} value={key.id}>
                              {key.key_name} ({key.scripts_count} scripts)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      O script será vinculado a esta chave de licença
                    </p>
                  </div>
                </div>
              </Card>

              {/* Etapa 3: Processamento */}
              <Card className="glass-strong p-6 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">3</span>
                  Processar e Proteger
                </h3>

                <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Custo estimado</p>
                  <p className="text-2xl font-bold text-accent">
                    {profile?.plan === 'infinite' ? '∞' : creditsNeeded} créditos
                  </p>
                  {!hasEnoughCredits && (
                    <p className="text-sm text-destructive mt-1">
                      Créditos insuficientes
                    </p>
                  )}
                </div>
                  <Button 
                    variant="default"
                    size="lg"
                    onClick={handleProcess}
                    disabled={processing || !file || !licenseKeyId || !customName.trim() || !hasEnoughCredits}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Processar e Proteger'
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Tutorial Lateral */}
            <div className="space-y-4">
              <Card className="glass-strong p-6 space-y-4 border-accent/20">
                <h3 className="text-lg font-bold text-accent">📚 Guia Rápido</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="space-y-1">
                    <p className="font-bold">1. Upload do Script</p>
                    <p className="text-muted-foreground">
                      Selecione o arquivo .lua que deseja proteger
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold">2. Configurar Proteção</p>
                    <p className="text-muted-foreground">
                      Escolha o nível e vincule a uma chave de licença
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold">3. Baixar Loader</p>
                    <p className="text-muted-foreground">
                      Após conclusão, copie ou baixe o código do loader
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold">4. Implementar</p>
                    <p className="text-muted-foreground">
                      Substitua o arquivo original mantendo o nome
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="glass-strong p-6 space-y-2 border-l-4 border-accent">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Importante!</p>
                    <p className="text-xs text-muted-foreground">
                      {profile?.plan === 'trial' 
                        ? 'Plano INICIAL: Arquivos armazenados por 24 horas'
                        : profile?.plan === 'basic'
                        ? 'Plano Básico: Arquivos armazenados por 72 horas'
                        : 'Plano Infinite: Armazenamento permanente'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="glass-strong p-6 space-y-3">
                <h4 className="font-bold text-sm">Seu Plano Atual</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plano:</span>
                    <span className="font-bold uppercase">{profile?.plan || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Créditos:</span>
                    <span className="font-bold text-accent">
                      {profile?.plan === 'infinite' ? '∞' : profile?.credits || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Encrypt;