import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLicenseKeys = () => {
  const queryClient = useQueryClient();

  const { data: keys, isLoading } = useQuery({
    queryKey: ['license_keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('license_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createKey = useMutation({
    mutationFn: async (keyName: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('license_keys')
        .insert({ user_id: user.id, key_name: keyName })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['license_keys'] });
      toast.success('Chave criada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar chave: ${error.message}`);
    },
  });

  const revokeKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('license_keys')
        .update({ status: 'revoked' })
        .eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['license_keys'] });
      toast.success('Chave revogada com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao revogar chave: ${error.message}`);
    },
  });

  const deleteKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('license_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['license_keys'] });
      toast.success('Chave excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir chave: ${error.message}`);
    },
  });

  return {
    keys,
    isLoading,
    createKey,
    revokeKey,
    deleteKey,
  };
};