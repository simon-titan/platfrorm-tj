import { Box, Grid, GridItem, Heading, HStack, Text, Tooltip, VStack } from "@chakra-ui/react";
import { CalendarDays, Check, Flame } from "lucide-react";
import { formatLearningDurationDe, type LearningWeekDay } from "@/lib/learning-daily";
import type { WelcomeDashboardMetrics } from "@/lib/welcome-metrics";
import { WelcomeLearningWeek } from "@/components/platform/WelcomeLearningWeek";
import { WelcomeModuleRings } from "@/components/platform/WelcomeModuleRings";

function firstName(displayName: string): string {
  const t = displayName.trim();
  if (!t) return "du";
  return t.split(/\s+/)[0] ?? t;
}

type WelcomeCardProps = {
  displayName: string;
  dateLabel: string;
  memberDays: number;
  streakDays: number;
  /** YYYY-MM-DD (Berlin): Tag mit gespeichertem Fortschritt / Streak-Aktivität */
  streakActivityByDay: Record<string, boolean>;
  learningLabel: string;
  welcomeMetrics: WelcomeDashboardMetrics;
  learningWeekDays: LearningWeekDay[];
  weekLearningLabel: string;
};

export function WelcomeCard({
  displayName,
  dateLabel,
  memberDays,
  streakDays,
  streakActivityByDay,
  learningLabel,
  welcomeMetrics,
  learningWeekDays,
  weekLearningLabel,
}: WelcomeCardProps) {
  const name = firstName(displayName);
  const streakPraise =
    streakDays >= 7
      ? `Fantastisch — dein Streak steht bei ${streakDays} Tagen. Das ist echte Konstanz!`
      : streakDays >= 3
        ? `Stark: ${streakDays} Tage Streak in Folge — genau so baust du Routine auf.`
        : streakDays >= 1
          ? `Du bist ${streakDays} ${streakDays === 1 ? "Tag" : "Tage"} am Stück dabei — weiter so!`
          : "Starte heute deinen Streak: ein kurzer Besuch reicht, um die Serie zu beginnen.";

  return (
    <Box
      bg="rgba(255,255,255,0.07)"
      backdropFilter="blur(12px) saturate(1.3)"
      border="1px solid rgba(255,255,255,0.10)"
      borderRadius="var(--radius-5)"
      boxShadow="0 2px 16px rgba(14,14,12,0.08)"
      p={{ base: 4, md: 5 }}
      position="relative"
    >
        <VStack spacing={{ base: 4, md: 5 }} align="stretch" w="100%">
          <Grid
            templateColumns={{ base: "1fr", md: "minmax(0,1fr) minmax(0,1fr)" }}
            gap={{ base: 4, md: 5 }}
            alignItems="stretch"
            w="100%"
          >
          <GridItem display="flex" flexDirection="column">
            <Box mb={3}>
              <Text
                className="fraunces-italic"
                fontSize={{ base: "lg", md: "xl" }}
                color="rgba(252, 252, 253, 0.72)"
                lineHeight={1.35}
                fontWeight={300}
              >
                Willkommen zurück. Lass uns weitermachen.
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontFamily="var(--font-sans)"
              fontWeight={600}
              lineHeight={1.15}
              letterSpacing="-0.02em"
              color="var(--leaf, #4A7C5C)"
              mb={3}
            >
              Hallo {name}!
            </Heading>
            <Text className="inter" color="rgba(252,252,253,0.80)" fontSize={{ base: "sm", md: "md" }} lineHeight="tall" maxW="56ch">
              {streakPraise}
            </Text>

            <Box
              mt={4}
              display="inline-flex"
              alignItems="center"
              gap={3}
              alignSelf="flex-start"
              px={4}
              py={3}
              borderRadius="14px"
              border="1px solid rgba(74, 124, 92, 0.32)"
              bg="linear-gradient(135deg, rgba(74, 124, 92, 0.10) 0%, rgba(14, 14, 12, 0.35) 100%)"
              boxShadow="inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.25)"
            >
              <Box borderRadius="full" p={2} bg="rgba(74, 124, 92, 0.18)" color="var(--leaf, #4A7C5C)" aria-hidden>
                <CalendarDays size={20} strokeWidth={1.75} />
              </Box>
              <Box>
                <Text
                  className="inter-medium"
                  fontSize="xs"
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                  color="rgba(255,255,255,0.45)"
                  mb={0.5}
                >
                  Heute
                </Text>
                <Text className="inter-semibold" fontSize={{ base: "sm", md: "md" }} color="var(--color-text-primary)" lineHeight={1.35}>
                  {dateLabel}
                </Text>
              </Box>
            </Box>
          </GridItem>

          <GridItem display="flex" flexDirection="column">
            <Box
              className="welcome-streak-hot"
              borderRadius="18px"
              p={{ base: 3, md: 4 }}
              position="relative"
              overflow="hidden"
              flex="1"
              minH={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                position="relative"
                zIndex={1}
                w="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
                textAlign="center"
              >
                <Box display="flex" alignItems="center" gap={4} flexShrink={0} justifyContent="center">
                  <Box
                    className="welcome-streak-flame"
                    borderRadius="16px"
                    p={3}
                    bg="rgba(255,255,255,0.08)"
                    border="1px solid rgba(255,255,255,0.15)"
                    boxShadow="0 0 12px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.10)"
                    aria-hidden
                  >
                    <Flame size={28} strokeWidth={1.6} color="rgba(255,255,255,0.85)" fill="rgba(255,255,255,0.12)" />
                  </Box>
                  <Box>
                    <Text className="inter-medium" fontSize="xs" letterSpacing="0.12em" textTransform="uppercase" color="rgba(255,255,255,0.50)" mb={1}>
                      Streak
                    </Text>
                    <Text
                      className="jetbrains-mono"
                      fontSize={{ base: "3xl", md: "4xl" }}
                      lineHeight={0.95}
                      fontWeight={800}
                      sx={{
                        background: "linear-gradient(135deg, #a8d4bb 0%, #4A7C5C 45%, #1F3A2E 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {streakDays}
                    </Text>
                    <Text className="inter" fontSize="sm" color="rgba(255,255,255,0.55)" mt={1}>
                      {streakDays === 1 ? "Tag in Folge" : "Tage in Folge"}
                    </Text>
                  </Box>
                </Box>
                <Box flex="1" minW={0} w="100%" maxW="420px" mx="auto">
                  <Text className="inter-medium" fontSize="xs" color="rgba(255,255,255,0.45)" mb={2} letterSpacing="0.06em">
                    Letzte 7 Tage
                  </Text>
                  <HStack spacing={{ base: 0.5, sm: 1 }} justify="center" align="flex-start" w="100%">
                    {learningWeekDays.map((d) => {
                      const active = d.seconds > 0 || Boolean(streakActivityByDay[d.dayKey]);
                      const detail =
                        d.seconds > 0
                          ? `${d.labelDe}: aktiv (${formatLearningDurationDe(d.seconds)})`
                          : streakActivityByDay[d.dayKey]
                            ? `${d.labelDe}: Streak-Aktivität (Fortschritt gespeichert)`
                            : `${d.labelDe}: keine erfasste Aktivität`;
                      return (
                        <Tooltip
                          key={d.dayKey}
                          label={detail}
                          placement="top"
                          hasArrow
                          bg="rgba(12, 12, 12, 0.95)"
                          color="var(--color-text-primary)"
                          borderWidth="1px"
                          borderColor="rgba(74, 124, 92, 0.40)"
                          px={3}
                          py={2}
                          borderRadius="md"
                          fontSize="sm"
                        >
                          <Box flex="1" minW={0} textAlign="center" cursor="default">
                            <Text className="inter-medium" fontSize="10px" color="rgba(255,255,255,0.5)" textTransform="capitalize" noOfLines={1}>
                              {d.weekdayShort}
                            </Text>
                            <Box display="flex" justifyContent="center" mt={1.5} aria-hidden>
                              {active ? (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  w="26px"
                                  h="26px"
                                  borderRadius="full"
                                  bg="rgba(74, 124, 92, 0.18)"
                                  border="1px solid rgba(74, 124, 92, 0.45)"
                                >
                                  <Check size={15} strokeWidth={2.6} color="#4A7C5C" aria-hidden />
                                </Box>
                              ) : (
                                <Box
                                  w="26px"
                                  h="26px"
                                  borderRadius="full"
                                  border="1px dashed rgba(255,255,255,0.18)"
                                  bg="rgba(0,0,0,0.2)"
                                />
                              )}
                            </Box>
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </HStack>
                  <Text className="inter" fontSize="10px" color="rgba(255,255,255,0.38)" mt={2} lineHeight="short" textAlign="center">
                    Haken = Lernzeit oder Streak-Aktivität (Fortschritt). 
                  </Text>
                </Box>
              </Box>
            </Box>
          </GridItem>
          </Grid>

          <Grid
            templateColumns={{ base: "1fr", sm: "minmax(0, 1fr) minmax(0, 1fr)" }}
            gap={{ base: 4, md: 5 }}
            alignItems="stretch"
            w="100%"
          >
            <GridItem minW={0} w="100%" display="flex" flexDirection="column">
              <WelcomeModuleRings metrics={welcomeMetrics} />
            </GridItem>
            <GridItem minW={0} w="100%" display="flex" flexDirection="column">
              <WelcomeLearningWeek days={learningWeekDays} weekTotalLabel={weekLearningLabel} />
            </GridItem>
          </Grid>

          <Box
              borderRadius="12px"
              border="1px solid rgba(74, 124, 92, 0.22)"
              bg="rgba(0,0,0,0.25)"
              px={4}
              py={3}
              display="flex"
              gap={4}
              justifyContent="space-between"
              alignItems="center"
              flexWrap="nowrap"
            >
              <Box minW={0}>
                <Text className="inter-medium" fontSize="xs" letterSpacing="0.08em" color="rgba(255,255,255,0.45)" mb={0.5}>
                  Mitgliedschaft
                </Text>
                <Text className="inter-semibold" fontSize="md" color="rgba(245, 236, 210, 0.95)" noOfLines={1}>
                  {memberDays} {memberDays === 1 ? "Tag" : "Tage"}
                </Text>
              </Box>
              <Box minW={0} textAlign="right">
                <Text className="inter-medium" fontSize="xs" letterSpacing="0.08em" color="rgba(255,255,255,0.45)" mb={0.5}>
                  Lernzeit gesamt
                </Text>
                <Text className="inter-semibold" fontSize="md" color="var(--leaf, #4A7C5C)" noOfLines={1}>
                  {learningLabel}
                </Text>
              </Box>
          </Box>
        </VStack>
    </Box>
  );
}
