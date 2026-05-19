"use client";

import { Box, Button, Flex, Heading, Progress, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { InstitutMediaArea } from "@/components/platform/InstitutMediaArea";
import { GlassCard } from "@/components/ui/GlassCard";
import type { LastWatchedModuleData, RecommendedModuleData } from "@/lib/server-data";
import { moduleHref } from "@/lib/module-route";
import { Clock, Play } from "lucide-react";

type LastVideoCardProps = {
  lastWatched: LastWatchedModuleData | null;
  recommended: RecommendedModuleData | null;
};

function formatLessonDurationSeconds(sec: number): string {
  if (!sec || sec <= 0) return "—";
  const m = Math.max(1, Math.round(sec / 60));
  return `${m} Min.`;
}

/** Lektion: Forest-Leaf */
const progressSxLesson = {
  h: "8px",
  borderRadius: "full",
  bg: "rgba(14,14,12,0.08)",
  border: "1px solid rgba(74, 124, 92, 0.18)",
  "& > div": {
    borderRadius: "full",
    background: "linear-gradient(90deg, #2D5443 0%, #4A7C5C 45%, #a8d4bb 100%)",
    boxShadow: "0 0 14px rgba(74, 124, 92, 0.40)",
  },
};

/** Modul: Forest */
const progressSxModule = {
  h: "8px",
  borderRadius: "full",
  bg: "rgba(14,14,12,0.08)",
  border: "1px solid rgba(74, 124, 92, 0.22)",
  "& > div": {
    borderRadius: "full",
    background: "linear-gradient(90deg, #1F3A2E 0%, #4A7C5C 100%)",
    boxShadow: "0 0 12px rgba(74, 124, 92, 0.35)",
  },
};

function ProgressLabeled({
  label,
  value,
  sx,
}: {
  label: string;
  value: number;
  sx: typeof progressSxLesson;
}) {
  return (
    <Box w="100%">
      <Flex justify="space-between" align="center" mb={1.5} gap={3}>
        <Text className="inter-medium" fontSize="sm" color="rgba(252,252,253,0.75)" noOfLines={1}>
          {label}
        </Text>
        <Text className="jetbrains-mono" fontSize="sm" fontWeight={600} color="var(--leaf, #4A7C5C)" flexShrink={0}>
          {value}%
        </Text>
      </Flex>
      <Progress value={value} size="sm" sx={sx} />
    </Box>
  );
}

export function LastVideoCard({ lastWatched, recommended }: LastVideoCardProps) {
  if (lastWatched) {
    const {
      module,
      videoProgressSeconds,
      lastVideoDurationSeconds,
      videoProgressPercent,
      progressPercent,
      durationSecondsTotal,
      lastVideoTitle,
      thumbnailSignedUrl,
      lastVideoStorageKey,
    } = lastWatched;
    const href = moduleHref({ id: module.id, slug: module.slug });
    // Modul-Fortschritt: progressPercent kommt bereits korrekt aus server-data (inkl. Fallback ohne duration)
    const modulePct = Math.min(100, Math.max(0, progressPercent ?? 0));
    // Video-Fortschritt: videoProgressPercent aus server-data (korrekt auch ohne duration_seconds in DB)
    const lessonPct = videoProgressPercent;

    const title = lastVideoTitle || module.title;
    const moduleLine = module.title.startsWith("Modul") ? module.title : `Modul: ${module.title}`;
    const startAtSeconds =
      lastVideoDurationSeconds > 0
        ? Math.min(Math.max(0, videoProgressSeconds), lastVideoDurationSeconds - 0.25)
        : Math.max(0, videoProgressSeconds);

    return (
      <GlassCard dashboard h="100%" overflow="hidden" p={0}>
        <Box className="institut-card-media" position="relative">
          <Box
            position="absolute"
            top={3}
            right={3}
            zIndex={2}
            px={3}
            py={1.5}
            borderRadius="md"
            bg="var(--ink, #0E0E0C)"
            color="var(--paper, #FCFCFD)"
            boxShadow="0 4px 16px rgba(14,14,12,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
          >
            <Text className="inter-semibold" fontSize="xs" letterSpacing="0.06em" textTransform="uppercase">
              Zuletzt angesehen
            </Text>
          </Box>

          <Box position="relative" w="100%" mx="auto">
            <InstitutMediaArea
              videoStorageKey={lastVideoStorageKey}
              thumbnailUrl={thumbnailSignedUrl}
              startAtSeconds={startAtSeconds}
            >
              <Box as={NextLink} href={href} aria-label="Video fortsetzen">
                <Box
                  display="flex"
                  w={{ base: "68px", sm: "76px" }}
                  h={{ base: "68px", sm: "76px" }}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  bg="linear-gradient(145deg, rgba(74,124,92,0.92) 0%, rgba(31,58,46,0.95) 100%)"
                  border="2px solid rgba(74, 124, 92, 0.55)"
                  boxShadow="0 0 32px rgba(74,124,92,0.40), 0 8px 24px rgba(14,14,12,0.45), inset 0 2px 0 rgba(255,255,255,0.18)"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{
                    transform: "scale(1.06)",
                    boxShadow: "0 0 44px rgba(74,124,92,0.55), 0 10px 28px rgba(14,14,12,0.50), inset 0 2px 0 rgba(255,255,255,0.22)",
                  }}
                >
                  <Play size={34} fill="var(--paper, #FCFCFD)" color="var(--paper, #FCFCFD)" strokeWidth={1.2} style={{ marginLeft: 4 }} />
                </Box>
              </Box>
            </InstitutMediaArea>
          </Box>
        </Box>

        <Box className="institut-card-body" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
          <Text className="inter-medium" fontSize="xs" letterSpacing="0.12em" textTransform="uppercase" color="rgba(255,255,255,0.42)" mb={2}>
            Institut
          </Text>
          <Text className="inter" fontSize="sm" color="rgba(252,252,253,0.65)" lineHeight="snug" noOfLines={2} mb={2}>
            {moduleLine}
          </Text>
          <Heading as="h2" size="lg" className="inter-semibold" fontWeight={600} color="var(--paper, #FCFCFD)" lineHeight="short" mb={3}>
            {title}
          </Heading>
          <Flex align="center" gap={2} mb={5} color="rgba(252,252,253,0.50)">
            <Clock size={16} strokeWidth={2} aria-hidden />
            <Text className="inter" fontSize="sm">
              {lastVideoDurationSeconds > 0
                ? formatLessonDurationSeconds(lastVideoDurationSeconds)
                : durationSecondsTotal > 0
                  ? formatLessonDurationSeconds(durationSecondsTotal)
                  : "—"}
            </Text>
          </Flex>

          <Box display="flex" flexDirection="column" gap={5} mb={5}>
            <ProgressLabeled label="Video Fortschritt" value={lessonPct} sx={progressSxLesson} />
            <ProgressLabeled label="Modul Fortschritt" value={modulePct} sx={progressSxModule} />
          </Box>

          <Button
            as={NextLink}
            href={href}
            size="md"
            width={{ base: "full", sm: "auto" }}
            borderRadius="10px"
            bg="var(--forest-deep, #122620)"
            color="var(--paper, #FCFCFD)"
            fontWeight={600}
            _hover={{ bg: "var(--glow, #2D5443)", boxShadow: "0 6px 22px rgba(18,38,32,0.35)" }}
          >
            Weitermachen
          </Button>
        </Box>
      </GlassCard>
    );
  }

  if (recommended) {
    const { module, thumbnailSignedUrl, videoCount, durationSecondsTotal, progressPercent, previewVideoStorageKey } = recommended;
    const href = moduleHref({ id: module.id, slug: module.slug });
    const modulePct = Math.max(0, Math.min(100, progressPercent ?? 0));
    const formatTotal = (s: number) => {
      if (s <= 0) return "—";
      const m = Math.floor(s / 60);
      return `${m} Min.`;
    };
    return (
      <GlassCard dashboard h="100%" overflow="hidden" p={0}>
        <Box className="institut-card-media" position="relative">
          <Box
            position="absolute"
            top={3}
            right={3}
            zIndex={2}
            px={3}
            py={1.5}
            borderRadius="md"
            bg="var(--ink, #0E0E0C)"
            color="var(--paper, #FCFCFD)"
            boxShadow="0 4px 16px rgba(14,14,12,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
          >
            <Text className="inter-semibold" fontSize="xs" letterSpacing="0.06em" textTransform="uppercase">
              Nächstes Video
            </Text>
          </Box>

          <Box position="relative" w="100%" mx="auto">
            <InstitutMediaArea videoStorageKey={previewVideoStorageKey} thumbnailUrl={thumbnailSignedUrl} startAtSeconds={0}>
              <Box as={NextLink} href={href} aria-label="Modul starten">
                <Box
                  display="flex"
                  w={{ base: "68px", sm: "76px" }}
                  h={{ base: "68px", sm: "76px" }}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  bg="linear-gradient(145deg, rgba(74,124,92,0.92) 0%, rgba(31,58,46,0.95) 100%)"
                  border="2px solid rgba(74, 124, 92, 0.55)"
                  boxShadow="0 0 32px rgba(74,124,92,0.40), 0 8px 24px rgba(14,14,12,0.45), inset 0 2px 0 rgba(255,255,255,0.18)"
                  transition="transform 0.2s ease, box-shadow 0.2s ease"
                  _hover={{
                    transform: "scale(1.06)",
                    boxShadow: "0 0 44px rgba(74,124,92,0.55), 0 10px 28px rgba(14,14,12,0.50), inset 0 2px 0 rgba(255,255,255,0.22)",
                  }}
                >
                  <Play size={34} fill="var(--paper, #FCFCFD)" color="var(--paper, #FCFCFD)" strokeWidth={1.2} style={{ marginLeft: 4 }} />
                </Box>
              </Box>
            </InstitutMediaArea>
          </Box>
        </Box>

        <Box className="institut-card-body" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
          <Text className="inter-medium" fontSize="xs" letterSpacing="0.12em" textTransform="uppercase" color="rgba(255,255,255,0.42)" mb={2}>
            Institut
          </Text>
          <Text className="inter" fontSize="sm" color="rgba(252,252,253,0.65)" lineHeight="snug" noOfLines={2} mb={2}>
            {module.courseTitle ? module.courseTitle : `Modul: ${module.title}`}
          </Text>
          <Heading as="h2" size="lg" className="inter-semibold" fontWeight={600} color="var(--paper, #FCFCFD)" lineHeight="short" mb={3}>
            {module.title}
          </Heading>
          <Flex align="center" gap={2} mb={5} color="rgba(252,252,253,0.50)">
            <Clock size={16} strokeWidth={2} aria-hidden />
            <Text className="inter" fontSize="sm">
              {videoCount} {videoCount === 1 ? "Video" : "Videos"}
              {durationSecondsTotal > 0 ? ` · ${formatTotal(durationSecondsTotal)}` : ""}
            </Text>
          </Flex>

          <Box display="flex" flexDirection="column" gap={5} mb={5}>
            <ProgressLabeled label="Video Fortschritt" value={0} sx={progressSxLesson} />
            <ProgressLabeled label="Modul Fortschritt" value={modulePct} sx={progressSxModule} />
          </Box>

          <Button
            as={NextLink}
            href={href}
            size="md"
            width={{ base: "full", sm: "auto" }}
            borderRadius="10px"
            bg="var(--forest-deep, #122620)"
            color="var(--paper, #FCFCFD)"
            fontWeight={600}
            _hover={{ bg: "var(--glow, #2D5443)", boxShadow: "0 6px 22px rgba(18,38,32,0.35)" }}
          >
            Jetzt starten
          </Button>
        </Box>
      </GlassCard>
    );
  }

  return (
    <GlassCard dashboard h="100%">
      <Text className="inter-medium" fontSize="xs" letterSpacing="0.1em" textTransform="uppercase" color="var(--mute, #8B867E)" mb={2}>
        Institut
      </Text>
      <Heading as="h2" size="md" className="inter-semibold" fontWeight={600} color="var(--ink, #0E0E0C)" mb={2}>
        Noch keine Inhalte
      </Heading>
      <Text className="inter" color="rgba(14, 14, 12, 0.55)" fontSize="sm" mb={6}>
        Derzeit sind keine Module verfügbar. Schau später wieder vorbei.
      </Text>
      <Button
        as={NextLink}
        href="/ausbildung"
        size="md"
        width={{ base: "full", sm: "auto" }}
        borderRadius="10px"
        bg="var(--ink, #0E0E0C)"
        color="var(--paper, #FCFCFD)"
        fontWeight={600}
        _hover={{ bg: "var(--forest-deep, #122620)", boxShadow: "0 6px 22px rgba(18,38,32,0.35)" }}
      >
        Zum Institut
      </Button>
    </GlassCard>
  );
}
