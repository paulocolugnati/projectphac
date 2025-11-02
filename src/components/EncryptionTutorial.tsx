import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code2, FileCode, Settings } from "lucide-react";

interface EncryptionTutorialProps {
  fileName: string;
}

export const EncryptionTutorial = ({ fileName }: EncryptionTutorialProps) => {
  return (
    <Card className="glass-strong border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          Tutorial de Instalação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <FileCode className="h-4 w-4 text-accent" />
          <AlertDescription>
            Siga os passos abaixo para instalar o script criptografado no seu servidor FiveM
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              1
            </div>
            <div>
              <p className="font-medium">Substitua o arquivo original</p>
              <p className="text-sm text-muted-foreground">
                Copie o código do loader e substitua o conteúdo do arquivo <code className="text-accent">{fileName}</code>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              2
            </div>
            <div>
              <p className="font-medium">Atualize o fxmanifest.lua</p>
              <p className="text-sm text-muted-foreground">
                Certifique-se de que o arquivo está listado corretamente no fxmanifest.lua
              </p>
              <pre className="mt-2 p-2 rounded bg-background/50 text-xs overflow-x-auto">
                <code>{`fx_version 'cerulean'\ngame 'gta5'\n\nclient_script '${fileName}'`}</code>
              </pre>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              3
            </div>
            <div>
              <p className="font-medium">Reinicie o resource</p>
              <p className="text-sm text-muted-foreground">
                Execute <code className="text-accent">restart nome-do-resource</code> no console do servidor
              </p>
            </div>
          </div>
        </div>

        <Alert className="bg-accent/10 border-accent/30">
          <Code2 className="h-4 w-4 text-accent" />
          <AlertDescription className="text-xs">
            <strong>Importante:</strong> Mantenha o nome original do arquivo ({fileName}). O loader injeta o código automaticamente no nome correto.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};