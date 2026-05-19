"use client";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";
import NextLink from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export function InsightBanner() {
  return (
    <GlassCard dashboard>
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap={5}
      >
        <HStack spacing={4} align="flex-start">
          <Flex
            align="center"
            justify="center"
            w="48px"
            h="48px"
            borderRadius="14px"
            bg="rgba(74, 124, 92, 0.10)"
            border="1px solid rgba(74, 124, 92, 0.30)"
            color="var(--forest, #1F3A2E)"
            flexShrink={0}
          >
            <Sparkles size={24} strokeWidth={2} />
          </Flex>
          <VStack align="flex-start" spacing={2} maxW={{ md: "520px" }}>
            <Text
              className="inter-medium"
              fontSize="xs"
              letterSpacing="0.1em"
              textTransform="uppercase"
              color="var(--mute, #8B867E)"
            >
              Exklusiver Insight
            </Text>
            <Text className="inter-semibold" fontSize={{ base: "lg", md: "xl" }} color="var(--ink, #0E0E0C)">
              Sichere dir deinen Platz bei T&J Consulting
            </Text>
            <Text className="inter" fontSize="sm" color="rgba(14, 14, 12, 0.60)" lineHeight="tall">
              Fülle die erweiterte Bewerbung aus und erhalte Zugang zu exklusiven Premium-Inhalten und unserer handverlesenen Community.
            </Text>
          </VStack>
        </HStack>
        <Button
          as={NextLink}
          href="/bewerbung"
          size="md"
          borderRadius="10px"
          bg="var(--forest, #1F3A2E)"
          color="var(--paper, #FCFCFD)"
          _hover={{
            bg: "var(--glow, #2D5443)",
            boxShadow: "0 4px 16px rgba(31, 58, 46, 0.30)",
          }}
          flexShrink={0}
          alignSelf={{ base: "stretch", md: "center" }}
          className="inter-semibold"
        >
          Jetzt bewerben
        </Button>
      </Flex>
    </GlassCard>
  );
}
