import { Box } from "@chakra-ui/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" bg="var(--ink)">
      <AdminTopbar />
      <Box display="flex">
        <AdminSidebar />
        <Box
          flex="1"
          minW={0}
          px={{ base: 4, md: 8 }}
          py={8}
          maxW="var(--admin-max-width)"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
