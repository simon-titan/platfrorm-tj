"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "Übersicht",
  "/admin/dashboard": "Analytics",
  "/admin/applications": "Bewerbungen",
  "/admin/ht-applications": "High-Ticket",
  "/admin/step2-applications": "Step-2 Bewerbungen",
  "/admin/kurse": "Kurse & Module",
  "/admin/free-kurs": "Free Kurs",
  "/admin/quiz": "Quiz",
  "/admin/events": "Events",
  "/admin/hausaufgaben": "Hausaufgaben",
  "/admin/mitglieder": "Mitglieder",
  "/admin/discord": "Discord",
  "/admin/arsenal": "Arsenal",
  "/admin/live-sessions": "Live Sessions",
  "/admin/stream": "Live Stream",
  "/admin/news": "News",
  "/admin/reviews": "Bewertungen",
  "/admin/tracking": "Tracking Links",
};

function resolveLabel(pathname: string): string {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  for (const [route, label] of Object.entries(ROUTE_LABELS)) {
    if (pathname.startsWith(route + "/")) return label;
  }
  return "Admin";
}

export function AdminTopbar() {
  const pathname = usePathname();
  const label = resolveLabel(pathname);

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={20}
      h="64px"
      bg="rgba(14,14,12,0.92)"
      backdropFilter="blur(16px) saturate(1.4)"
      borderBottom="1px solid rgba(255,255,255,0.08)"
    >
      <HStack h="full" px={6} justify="space-between">
        <HStack spacing={3}>
          <Box
            px={2}
            py={1}
            bg="rgba(74,124,92,0.16)"
            border="1px solid rgba(74,124,92,0.30)"
            borderRadius="var(--radius-2)"
          >
            <Text
              fontSize="10px"
              fontWeight={600}
              letterSpacing="0.10em"
              textTransform="uppercase"
              color="var(--leaf)"
              fontFamily="var(--font-mono)"
            >
              Admin
            </Text>
          </Box>
          <Text
            fontSize="14px"
            color="var(--paper)"
            fontFamily="var(--font-sans)"
            fontWeight={500}
          >
            {label}
          </Text>
        </HStack>

        <Text
          fontSize="10px"
          fontWeight={500}
          letterSpacing="0.10em"
          textTransform="uppercase"
          color="var(--mute)"
          fontFamily="var(--font-mono)"
        >
          T&amp;J Consulting
        </Text>
      </HStack>
    </Box>
  );
}
