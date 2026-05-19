"use client";

import { Box } from "@chakra-ui/react";

type SkyArchBackgroundProps = {
  children: React.ReactNode;
};

/** Vollflächiger Hintergrund — `public/bg/tj-hero-bg.jpg` + Forest-Overlay. */
export function SkyArchBackground({ children }: SkyArchBackgroundProps) {
  return (
    <Box position="relative" minH="100vh" w="full" overflow="hidden">
      <Box
        position="absolute"
        inset={0}
        bgImage="url(/bg/tj-hero-bg.jpg)"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      />
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, rgba(18, 38, 32, 0.52), rgba(14, 14, 12, 0.88))"
        pointerEvents="none"
      />
      <Box position="relative" zIndex={1} minH="100vh" w="full">
        {children}
      </Box>
    </Box>
  );
}
