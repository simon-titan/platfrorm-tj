import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,

  fonts: {
    heading: "'Fraunces', Georgia, serif",
    body:    "'Geist Sans', system-ui, sans-serif",
    mono:    "'Geist Mono', 'JetBrains Mono', monospace",
  },

  colors: {
    ink:    "#0E0E0C",
    paper:  "#FCFCFD",
    frost:  "#F8F8FA",
    mist:   "#EEEEF1",
    mute:   "#8B867E",
    forest: {
      deep:    "#122620",
      DEFAULT: "#1F3A2E",
      glow:    "#2D5443",
      leaf:    "#4A7C5C",
    },
    /** Semantic brand scale — mapped to forest family */
    brand: {
      50:  "#F0F7F3",
      100: "#D6EBE0",
      200: "#A8D1BB",
      300: "#6EB495",
      400: "#4A7C5C",
      500: "#1F3A2E",
      600: "#1A3128",
      700: "#152820",
      800: "#122620",
      900: "#0D1D18",
    },
  },

  radii: {
    sm:    "4px",
    md:    "8px",
    lg:    "14px",
    xl:    "20px",
    "2xl": "24px",
    full:  "9999px",
  },

  shadows: {
    sm:   "0 1px 2px rgba(14,14,12,0.04), 0 1px 1px rgba(14,14,12,0.03)",
    md:   "0 4px 8px rgba(14,14,12,0.06), 0 2px 4px rgba(14,14,12,0.04)",
    lg:   "0 12px 24px rgba(14,14,12,0.08), 0 4px 8px rgba(14,14,12,0.05)",
    xl:   "0 24px 48px rgba(14,14,12,0.10), 0 8px 16px rgba(14,14,12,0.06)",
    cool: "0 4px 8px rgba(18,38,32,0.08), 0 2px 4px rgba(18,38,32,0.05)",
  },

  styles: {
    global: {
      body: {
        bg:         "var(--paper)",
        color:      "var(--ink)",
        fontFamily: "var(--font-sans)",
        fontOpticalSizing: "auto",
      },
      "::selection": {
        bg:    "rgba(74,124,92,0.20)",
        color: "#0E0E0C",
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        fontFamily:    "var(--font-sans)",
        fontWeight:    500,
        borderRadius:  "var(--radius-2)",
        letterSpacing: "-0.01em",
        _active: { transform: "scale(0.97)" },
      },
      variants: {
        primary: {
          bg:     "var(--ink)",
          color:  "var(--paper)",
          _hover: { bg: "var(--forest-deep)" },
        },
        secondary: {
          bg:     "var(--forest)",
          color:  "var(--paper)",
          _hover: { bg: "var(--glow)" },
        },
        ghost: {
          bg:           "transparent",
          color:        "var(--ink)",
          borderBottom: "1px solid var(--ink)",
          borderRadius: 0,
          px:           0,
          _hover: { color: "var(--forest)", borderColor: "var(--forest)" },
        },
      },
      defaultProps: { variant: "primary" },
    },

    Input: {
      variants: {
        editorial: {
          field: {
            bg:           "var(--frost)",
            border:       "1px solid var(--mist)",
            borderRadius: "var(--radius-2)",
            _focus: {
              borderColor: "var(--leaf)",
              boxShadow:   "0 0 0 3px rgba(74,124,92,0.12)",
            },
          },
        },
      },
      defaultProps: { variant: "editorial" },
    },

    Card: {
      baseStyle: {
        container: {
          bg:           "var(--frost)",
          border:       "1px solid var(--mist)",
          borderRadius: "var(--radius-3)",
          boxShadow:    "var(--shadow-1)",
        },
      },
    },
  },
});
