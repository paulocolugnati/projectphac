import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const faqs = [
  {
    question: "O que é Criptografia Bytecode LUA?",
    answer: "É o processo de converter seu código-fonte em um formato binário ilegível antes de aplicar camadas de ofuscação e bind de licença, tornando a desofuscação extremamente difícil."
  },
  {
    question: "Como faço o loader funcionar no meu fxmanifest.lua?",
    answer: "Copie e cole o código do Loader/Injector no topo do seu fxmanifest.lua e certifique-se de que o script criptografado está na pasta do recurso."
  },
  {
    question: "Meu arquivo ZIP está corrompido, o que faço?",
    answer: "Se a cópia do código funcionar, o problema é local. Tente desabilitar o firewall temporariamente ou use o download individual dos arquivos."
  },
  {
    question: "Como funciona o BIND da Chave de Licença?",
    answer: "A sua chave (Key) é criptografada dentro do script. Ele só será executado no servidor cuja chave corresponda à chave embutida, protegendo contra vazamentos para outros servidores."
  },
  {
    question: "Por que meus dados são excluídos após 72 horas?",
    answer: "É uma política de segurança rigorosa para garantir que seu código-fonte nunca permaneça armazenado em nossos servidores por muito tempo, protegendo sua privacidade."
  },
  {
    question: "Qual a diferença entre o Plano Inicial e o Básico?",
    answer: "O Plano Básico oferece 40 Créditos/mês e a capacidade de criar 10 Chaves de Licença, enquanto o Plano Inicial é limitado a 1 Chave e 10 Créditos."
  },
  {
    question: "Posso mudar o nome do meu script após a criptografia?",
    answer: "Sim, o arquivo criptografado mantém o nome original. Você deve garantir que o arquivo ofuscado substitua o original na sua pasta."
  },
  {
    question: "O que é a Análise de Vulnerabilidade e por que devo usá-la?",
    answer: "É um scan que verifica seu código antes da criptografia em busca de comandos perigosos ou variáveis que possam ser exploradas por hackers."
  },
  {
    question: "Como faço para revogar uma chave de licença?",
    answer: "Vá em Gerenciamento de Keys, clique na chave e selecione 'Revogar'. O script vinculado a essa chave deixará de funcionar imediatamente no servidor de jogo."
  },
  {
    question: "Posso alterar meu Nome/Empresa mais de uma vez?",
    answer: "Não. Para fins de segurança e integridade de licença, a alteração é limitada a apenas uma vez."
  }
];

export const HelpCenter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="glass-strong border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-accent" />
          Central de Ajuda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Precisa de ajuda? Confira nossas perguntas mais frequentes ou entre em contato.
        </p>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full group">
              Ver todas as FAQs
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong max-w-4xl max-h-[85vh] overflow-y-auto border-primary/20">
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-3 text-3xl">
                <HelpCircle className="h-8 w-8 text-primary" />
                Central de Ajuda - FAQs
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Encontre respostas rápidas para as dúvidas mais comuns sobre o PhacProtect
              </p>
            </DialogHeader>
            
            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="glass border-primary/10 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:text-primary transition-smooth py-4">
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-bold text-sm mt-0.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-semibold">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 pb-4 pl-9">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};