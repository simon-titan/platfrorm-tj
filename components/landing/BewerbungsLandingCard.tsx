"use client";

import { Box, Button, Collapse, Stack, Text } from "@chakra-ui/react";
import { ChevronDown, Lock } from "lucide-react";
import NextLink from "next/link";
import { useId, useState } from "react";

/** Gleiches CTA-Muster wie HeroSection (Desktop) / MobileCTAFooter auf der Bewerbungs-Landingpage. */
const landingApplyCtaSx = {
  background: "var(--ink, #0E0E0C)",
  boxShadow:
    "0 4px 16px rgba(14,14,12,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
  border: "none",
  cursor: "pointer",
  transition: "all 220ms cubic-bezier(0.16, 1, 0.3, 1)",
  textDecoration: "none",
  color: "var(--paper, #FCFCFD)",
  _hover: {
    background: "var(--forest-deep, #122620)",
    boxShadow: "0 6px 22px rgba(18,38,32,0.35)",
    transform: "translateY(-1px)",
    textDecoration: "none",
  },
  _active: {
    transform: "translateY(0px)",
    boxShadow: "0 2px 8px rgba(14,14,12,0.30)",
  },
};

export function BewerbungsLandingCard() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <Box
      className="glass-card"
      p={{ base: 4, md: 5 }}
      w="full"
      maxW="360px"
      mt={10}
      borderWidth="1px"
      borderStyle="solid"
      borderColor="rgba(74, 124, 92, 0.38)"
      boxShadow="
        0 8px 40px rgba(14, 14, 12, 0.55),
        0 0 0 1px rgba(74, 124, 92, 0.16),
        0 0 24px rgba(45, 84, 67, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.06)
      "
    >
      <Button
        type="button"
        variant="unstyled"
        w="full"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
        textAlign="left"
        py={0}
        px={0}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((v) => !v)}
        _hover={{ opacity: 0.92 }}
        _focusVisible={{
          boxShadow: "0 0 0 2px rgba(74, 124, 92, 0.55)",
          borderRadius: "8px",
        }}
      >
        <Text
          as="span"
          className="inter"
          fontWeight="600"
          fontSize="md"
          color="var(--color-text-primary, #F0F0F2)"
          lineHeight="1.45"
          flex="1"
        >
          Noch kein Mitglied?
        </Text>
        <Box
          as="span"
          color="var(--leaf, #4A7C5C)"
          display="flex"
          alignItems="center"
          flexShrink={0}
          transition="transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
          sx={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <ChevronDown size={22} strokeWidth={2.25} />
        </Box>
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          id={panelId}
          spacing={3}
          textAlign="center"
          pt={3}
          mt={3}
          borderTop="1px solid rgba(255,255,255,0.08)"
        >
          <Text className="inter" fontSize="sm" color="rgba(240, 240, 242, 0.55)" lineHeight="1.65">
            Bewirb dich jetzt und sichere dir deinen Platz in der exklusiven T&J Consulting Community.
          </Text>
          <Box
            as={NextLink}
            href="/insight"
            w="full"
            minH="52px"
            borderRadius="12px"
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.02em"
            color="var(--paper, #FCFCFD)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            className="inter"
            sx={landingApplyCtaSx}
          >
            <Lock size={15} strokeWidth={2.5} />
            Zur Bewerbung
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
}
