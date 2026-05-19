import { Box, type BoxProps } from "@chakra-ui/react";

export type GlassCardProps = BoxProps & {
  /** Stärkerer Kontrast + Akzentlinie (z. B. Dashboard-Karten) */
  highlight?: boolean;
  /** Zusätzliche Betonung (z. B. Hausaufgabe, Events) */
  spotlight?: boolean;
  /** Hero-Variante für den Welcome-Bereich */
  hero?: boolean;
  /** Dashboard-Karten im Hero-Subcard-Stil (siehe HERO-UI-SPEZIFIKATION.md) */
  dashboard?: boolean;
};

export function GlassCard({ highlight, spotlight, hero, dashboard, className, children, ...props }: GlassCardProps) {
  const classes = [
    dashboard
      ? "glass-card-dashboard"
      : hero
        ? "glass-card-hero"
        : spotlight
          ? "glass-card-spotlight"
          : highlight
            ? "glass-card-highlight"
            : "glass-card",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner =
    dashboard ? (
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    ) : (
      children
    );

  return (
    <Box
      className={classes}
      p={dashboard ? { base: 4, md: 5 } : 6}
      borderRadius={dashboard ? "var(--radius-5)" : "16px"}
      transition="all 0.2s ease"
      _hover={
        dashboard
          ? {
              borderColor: "rgba(74, 124, 92, 0.28)",
              boxShadow: "0 8px 24px rgba(14,14,12,0.10), 0 0 0 1px rgba(74,124,92,0.16)",
            }
          : hero
            ? { borderColor: "rgba(74, 124, 92, 0.55)", boxShadow: "0 18px 56px rgba(14,14,12,0.35), 0 0 48px rgba(45,84,67,0.18)" }
            : highlight || spotlight
              ? { borderColor: "rgba(74, 124, 92, 0.65)" }
              : { borderColor: "rgba(255,255,255,0.16)" }
      }
      {...props}
    >
      {inner}
    </Box>
  );
}
