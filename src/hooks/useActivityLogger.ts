import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = 
  | "CRIACAO_CONTA"
  | "LOGIN"
  | "GERACAO_KEY"
  | "REVOGACAO_KEY"
  | "INICIO_CRIPTOGRAFIA"
  | "CRIPTOGRAFIA_CONCLUIDA"
  | "ANALISE_VULNERABILIDADE"
  | "DEDUZIR_CREDITOS"
  | string;

export type ActivityStatus = "success" | "failed" | "pending";

export interface LogActivityParams {
  action: ActivityAction;
  itemName: string;
  status: ActivityStatus;
  creditsUsed?: number;
  details?: string;
}

export const useActivityLogger = () => {
  const logActivity = async ({
    action,
    itemName,
    status,
    creditsUsed = 0,
    details,
  }: LogActivityParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("activity_logs").insert({
        user_id: user.id,
        action,
        item_name: itemName,
        status,
        credits_used: creditsUsed,
        details: details || null,
      });

      if (error) {
        console.error("Erro ao registrar atividade:", error);
      }
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);
    }
  };

  return { logActivity };
};
