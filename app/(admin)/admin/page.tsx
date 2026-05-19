"use client";

import {
  BarChart2,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gem,
  GitMerge,
  HelpCircle,
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
import { Box, SimpleGrid, Text, Heading } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

interface NavCard {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const NAV_CARDS: NavCard[] = [
  {
    href: "/admin/dashboard",
    label: "Analytics",
    description: "MRR, Churn, Funnel, E-Mail-Performance",
    icon: BarChart2,
  },
  {
    href: "/admin/applications",
    label: "Bewerbungen",
    description: "Neue Bewerbungen prüfen & entscheiden",
    icon: ClipboardList,
  },
  {
    href: "/admin/ht-applications",
    label: "High-Ticket",
    description: "1-on-1 Coaching Bewerbungen",
    icon: Gem,
  },
  {
    href: "/admin/step2-applications",
    label: "Step-2",
    description: "Zweite Bewerbungsstufe verwalten",
    icon: GitMerge,
  },
  {
    href: "/admin/kurse",
    label: "Kurse & Module",
    description: "Kursinhalte, Module & Reihenfolge",
    icon: BookOpen,
  },
  {
    href: "/admin/free-kurs",
    label: "Free Kurs",
    description: "Öffentlicher Einstiegskurs",
    icon: Unlock,
  },
  {
    href: "/admin/quiz",
    label: "Quiz",
    description: "Fragen erstellen & verwalten",
    icon: HelpCircle,
  },
  {
    href: "/admin/events",
    label: "Events",
    description: "Live-Events & Kalender",
    icon: CalendarDays,
  },
  {
    href: "/admin/hausaufgaben",
    label: "Hausaufgaben",
    description: "Aufgaben vergeben & auswerten",
    icon: PenLine,
  },
  {
    href: "/admin/mitglieder",
    label: "Mitglieder",
    description: "User, Tiers, Zugänge verwalten",
    icon: Users,
  },
  {
    href: "/admin/discord",
    label: "Discord",
    description: "Discord-Rollen & Integration",
    icon: MessageSquare,
  },
  {
    href: "/admin/arsenal",
    label: "Arsenal",
    description: "Tools & Ressourcen-Bibliothek",
    icon: Package,
  },
  {
    href: "/admin/live-sessions",
    label: "Live Sessions",
    description: "Sessions planen & verwalten",
    icon: Video,
  },
  {
    href: "/admin/stream",
    label: "Live Stream",
    description: "Stream-Steuerung & Status",
    icon: Radio,
  },
  {
    href: "/admin/news",
    label: "News",
    description: "Artikel & Ankündigungen",
    icon: Newspaper,
  },
  {
    href: "/admin/reviews",
    label: "Bewertungen",
    description: "Member-Bewertungen ansehen",
    icon: Star,
  },
  {
    href: "/admin/tracking",
    label: "Tracking Links",
    description: "Insight-Links & Analytics-URLs",
    icon: Link2,
  },
];

export default function AdminPage() {
  return (
    <Box>
      <Box mb={8}>
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight={400}
          fontFamily="var(--font-display)"
          color="var(--paper)"
          letterSpacing="-0.02em"
          lineHeight={1.2}
        >
          Admin Panel
        </Heading>
        <Text
          mt={1}
          fontSize="sm"
          color="var(--mute)"
          fontFamily="var(--font-sans)"
        >
          T&amp;J Consulting — internes Verwaltungs-Dashboard
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {NAV_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Box
              key={card.href}
              as={Link}
              href={card.href}
              p={5}
              bg="rgba(18,38,32,0.40)"
              border="1px solid rgba(74,124,92,0.18)"
              borderRadius="var(--radius-3)"
              transition="all var(--duration-base)"
              _hover={{
                bg: "rgba(18,38,32,0.65)",
                borderColor: "rgba(74,124,92,0.40)",
                textDecoration: "none",
                transform: "translateY(-2px)",
                boxShadow: "var(--shadow-cool-2)",
              }}
              display="block"
            >
              <Box
                mb={3}
                w={8}
                h={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="rgba(74,124,92,0.14)"
                borderRadius="var(--radius-2)"
                color="var(--leaf)"
              >
                <Icon size={16} strokeWidth={1.5} />
              </Box>
              <Text
                fontSize="14px"
                fontWeight={500}
                fontFamily="var(--font-sans)"
                color="var(--paper)"
                mb={1}
              >
                {card.label}
              </Text>
              <Text
                fontSize="12px"
                fontFamily="var(--font-sans)"
                color="var(--mute)"
                lineHeight={1.4}
              >
                {card.description}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
