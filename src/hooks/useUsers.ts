import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  gender?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  full_name: string;
  phone_number: string;
  email?: string;
  gender?: string;
  address?: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as User[];
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as User | null;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data, error } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<CreateUserData> }) => {
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useSearchUsers(searchTerm: string) {
  return useQuery({
    queryKey: ["users", "search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`full_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as User[];
    },
    enabled: !!searchTerm.trim(),
  });
}