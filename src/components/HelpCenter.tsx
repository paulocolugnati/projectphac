import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const faqs = [
  {
    question: "Como funciona a criptografia do PhacProtect?",
    answer: "O PhacProtect utiliza ofuscação de bytecode Lua combinada com criptografia AES vinculada à sua chave de licença única. Isso garante que apenas servidores autorizados possam executar seus scripts."
  },
  {
    question: "Quanto tempo meus arquivos ficam armazenados?",
    answer: "O tempo de armazenamento depende do seu plano: Plano INICIAL (24 horas), Plano Básico (72 horas) e Plano Infinite (permanente)."
  },
  {
    question: "O que são créditos e como funcionam?",
    answer: "Créditos são usados para realizar operações: Criptografia (4 créditos) e Análise de Vulnerabilidade (2 créditos). O Plano Infinite oferece créditos ilimitados (∞)."
  },
  {
    question: "Como gero uma chave de licença?",
    answer: "Vá até a página 'Gerenciar Chaves', clique em 'Nova Chave', dê um nome e confirme. A chave será gerada automaticamente e poderá ser usada nas suas criptografias."
  },
  {
    question: "Posso revogar uma chave de licença?",
    answer: "Sim! Na página 'Gerenciar Chaves', clique no botão de opções ao lado da chave e selecione 'Revogar'. Isso impedirá que scripts vinculados a essa chave funcionem."
  },
  {
    question: "Como instalo o script criptografado no meu servidor?",
    answer: "Após a criptografia, copie o código do loader fornecido e substitua o conteúdo do seu arquivo original. Não esqueça de atualizar o fxmanifest.lua conforme as instruções."
  },
  {
    question: "Qual a diferença entre os níveis de proteção?",
    answer: "Planos INICIAL e Básico oferecem proteção padrão. O Plano Infinite dá acesso aos Níveis Avançados com camadas extras de segurança e anti-debugging."
  },
  {
    question: "A criptografia afeta a performance do script?",
    answer: "Não! O PhacProtect foi projetado para ter impacto zero na velocidade de execução dos seus scripts."
  },
  {
    question: "O que acontece se meus créditos acabarem?",
    answer: "Você precisará fazer upgrade do plano ou aguardar a renovação mensal (exceto Plano INICIAL). Seus scripts já criptografados continuarão funcionando normalmente."
  },
  {
    question: "Como funciona a análise de vulnerabilidade?",
    answer: "Nossa IA analisa seu código em busca de falhas de segurança comuns (SQL injection, credenciais expostas, etc.) e fornece sugestões de correção."
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
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <HelpCircle className="h-6 w-6 text-accent" />
                Perguntas Frequentes
              </DialogTitle>
            </DialogHeader>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};