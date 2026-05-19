"use client";

import { Box } from "@chakra-ui/react";

export function GoldGlowDivider() {
  return (
    <Box
      w="100%"
      h="1px"
      background="linear-gradient(90deg, transparent 0%, rgba(74,124,92,0.45) 40%, rgba(74,124,92,0.45) 60%, transparent 100%)"
      boxShadow="0 0 12px rgba(45,84,67,0.30), 0 0 6px rgba(45,84,67,0.14)"
    />
  );
}
