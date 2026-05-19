import { Box, Heading, HStack, Text } from "@chakra-ui/react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function AdminPageHeader({ title, subtitle, right }: AdminPageHeaderProps) {
  return (
    <Box mb={8}>
      <HStack justify="space-between" align="flex-start" gap={4} flexWrap="wrap">
        <Box>
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight={400}
            fontFamily="var(--font-display)"
            color="var(--paper)"
            lineHeight={1.2}
            letterSpacing="-0.02em"
          >
            {title}
          </Heading>
          {subtitle && (
            <Text
              mt={1}
              fontSize="sm"
              color="var(--mute)"
              fontFamily="var(--font-sans)"
              lineHeight={1.5}
            >
              {subtitle}
            </Text>
          )}
        </Box>
        {right && <Box flexShrink={0}>{right}</Box>}
      </HStack>
    </Box>
  );
}
