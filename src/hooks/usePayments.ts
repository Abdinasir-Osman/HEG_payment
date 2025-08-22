import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentPlan {
  id: string;
  name: string;
  amount: number;
  duration_months: number;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id: string;
  amount_paid: number;
  amount_remaining: number;
  status: "paid" | "unpaid" | "partial";
  payment_date: string | null;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    full_name: string;
    phone_number: string;
    email?: string;
  };
  payment_plans: {
    id: string;
    name: string;
    amount: number;
  };
}

export interface CreatePaymentData {
  user_id: string;
  plan_id: string;
  amount_paid: number;
  amount_remaining: number;
  status: "paid" | "unpaid" | "partial";
  payment_date?: string;
}

export function usePaymentPlans() {
  return useQuery({
    queryKey: ["payment-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_plans")
        .select("*")
        .order("duration_months");
      
      if (error) throw error;
      return data as PaymentPlan[];
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          users (id, full_name, phone_number, email),
          payment_plans (id, name, amount)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Payment[];
    },
  });
}

export function useUserPayments(userId: string) {
  return useQuery({
    queryKey: ["payments", "user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          payment_plans (id, name, amount)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: CreatePaymentData) => {
      const { data, error } = await supabase
        .from("payments")
        .insert([paymentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, paymentData }: { id: string; paymentData: Partial<CreatePaymentData> }) => {
      const { data, error } = await supabase
        .from("payments")
        .update(paymentData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ["payment-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("status");
      
      if (error) throw error;
      
      const stats = data.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total: data.length,
        paid: stats.paid || 0,
        unpaid: stats.unpaid || 0,
        partial: stats.partial || 0,
      };
    },
  });
}