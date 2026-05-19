"use client";

import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gem,
  GitMerge,
  HelpCircle,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Newspaper,
  Package,
  PenLine,
  Radio,
  Star,
  Unlock,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const links: NavItem[] = [
  { href: "/admin",                  label: "Übersicht",          icon: LayoutDashboard },
  { href: "/admin/dashboard",        label: "Analytics",          icon: BarChart2 },
  { href: "/admin/applications",     label: "Bewerbungen",        icon: ClipboardList },
  { href: "/admin/ht-applications",  label: "High-Ticket",        icon: Gem },
  { href: "/admin/step2-applications", label: "Step-2 Bewerbungen", icon: GitMerge },
  { href: "/admin/kurse",            label: "Kurse & Module",     icon: BookOpen },
  { href: "/admin/free-kurs",        label: "Free Kurs",          icon: Unlock },
  { href: "/admin/quiz",             label: "Quiz",               icon: HelpCircle },
  { href: "/admin/events",           label: "Events",             icon: CalendarDays },
  { href: "/admin/hausaufgaben",     label: "Hausaufgaben",       icon: PenLine },
  { href: "/admin/mitglieder",       label: "Mitglieder",         icon: Users },
  { href: "/admin/discord",          label: "Discord",            icon: MessageSquare },
  { href: "/admin/arsenal",          label: "Arsenal",            icon: Package },
  { href: "/admin/live-sessions",    label: "Live Sessions",      icon: Video },
  { href: "/admin/stream",           label: "Live Stream",        icon: Radio },
  { href: "/admin/news",             label: "News",               icon: Newspaper },
  { href: "/admin/reviews",          label: "Bewertungen",        icon: Star },
  { href: "/admin/tracking",         label: "Tracking Links",     icon: Link2 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Box
      w="240px"
      minH="100vh"
      position="sticky"
      top={0}
      flexShrink={0}
      borderRight="1px solid rgba(255,255,255,0.08)"
      bg="rgba(7,8,10,0.98)"
      overflowY="auto"
      overflowX="hidden"
    >
      <Box px={4} pt={5} pb={4}>
        <Box mb={5} maxW="180px">
          <Logo variant="onDark" priority />
        </Box>

        <Text
          mb={3}
          fontSize="10px"
          fontWeight={500}
          letterSpacing="0.10em"
          textTransform="uppercase"
          color="rgba(139,134,126,0.6)"
          fontFamily="var(--font-mono)"
        >
          Navigation
        </Text>

        <Stack gap={1}>
          {links.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;

            return (
              <Box
                key={item.href}
                as={Link}
                href={item.href}
                display="flex"
                alignItems="center"
                h="40px"
                px={3}
                gap={2}
                borderRadius="var(--radius-3)"
                transition="all var(--duration-base)"
                bg={isActive ? "rgba(74,124,92,0.18)" : "transparent"}
                border="1px solid"
                borderColor={isActive ? "rgba(74,124,92,0.35)" : "transparent"}
                color={isActive ? "var(--leaf)" : "rgba(252,252,253,0.55)"}
                _hover={{
                  bg: isActive ? "rgba(74,124,92,0.22)" : "rgba(255,255,255,0.05)",
                  color: isActive ? "var(--leaf)" : "var(--paper)",
                  textDecoration: "none",
                }}
              >
                <HStack spacing={2} flex={1} overflow="hidden">
                  <Box flexShrink={0}>
                    <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                  </Box>
                  <Text
                    fontSize="13px"
                    fontWeight={isActive ? 500 : 400}
                    fontFamily="var(--font-sans)"
                    noOfLines={1}
                    color="inherit"
                  >
                    {item.label}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
