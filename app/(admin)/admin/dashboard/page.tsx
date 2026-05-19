import { redirect } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsDashboardPage() {
  const { error } = await requireAdmin();
  if (error) {
    redirect("/dashboard");
  }

  return (
    <Box maxW="var(--admin-max-width)">
      <AdminPageHeader
        title="Analytics"
        subtitle="Live-Kennzahlen für Funnel, Revenue, Churn und E-Mail-Performance. Daten werden bei jedem Aufruf frisch aus Supabase geladen."
      />
      <AnalyticsDashboard />
    </Box>
  );
}
