"use client";

import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Mail,
  RefreshCw,
  TrendingDown,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FunnelWindow {
  registrations: number;
  applicationsReviewed: number;
  approved: number;
  rejected: number;
  approvalRatePct: number;
  paidAfterApproval: number;
  paidConversionPct: number;
}

interface PaymentLogRow {
  id: string;
  userName: string | null;
  userEmail: string | null;
  amountEur: number;
  currency: string;
  status: string;
  type: "monthly" | "lifetime" | "unknown";
  createdAt: string;
  paidAt: string | null;
  stripeInvoiceId: string | null;
}

interface CancellationRow {
  id: string;
  userName: string | null;
  userEmail: string | null;
  structuredReason: string | null;
  reason: string | null;
  feedback: string | null;
  canceledAt: string;
}

interface EmailPerfRow {
  sequence: string;
  step: number;
  sent: number;
  opened: number;
  clicked: number;
  openRatePct: number;
  clickRatePct: number;
}

interface AnalyticsResponse {
  ok: true;
  generatedAt: string;
  mrr: {
    mrrEur: number;
    monthlyActiveSubs: number;
    lifetimeActive: number;
    lifetimeRevenue30dEur: number;
    monthlyPriceEur: number;
  };
  churn: {
    canceled30d: number;
    activeAtStart: number;
    churnRate30dPct: number;
  };
  funnel: { "7d": FunnelWindow; "30d": FunnelWindow };
  paymentsLog: PaymentLogRow[];
  cancellations: CancellationRow[];
  emailPerformance: EmailPerfRow[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

const eurFmt = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurFmtCents = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateOnlyFmt = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });

const STRUCTURED_REASON_LABELS: Record<string, string> = {
  too_expensive: "Zu teuer",
  not_enough_value: "Wenig Mehrwert",
  tech_issues: "Technische Probleme",
  other: "Anderer Grund",
};

const PAYMENT_STATUS_FILTERS = [
  { id: "all", label: "Alle" },
  { id: "succeeded", label: "Succeeded" },
  { id: "failed", label: "Failed" },
] as const;

type PaymentFilter = (typeof PAYMENT_STATUS_FILTERS)[number]["id"];

// ── Tab Button ─────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="xs"
      onClick={onClick}
      bg={active ? "rgba(74,124,92,0.18)" : "transparent"}
      color={active ? "var(--leaf)" : "var(--mute)"}
      border="1px solid"
      borderColor={active ? "rgba(74,124,92,0.35)" : "rgba(255,255,255,0.10)"}
      _hover={{ bg: active ? "rgba(74,124,92,0.22)" : "rgba(255,255,255,0.06)" }}
      fontFamily="var(--font-sans)"
    >
      {children}
    </Button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      const json = (await res.json()) as
        | AnalyticsResponse
        | { ok: false; error: string };
      if (!res.ok || !("ok" in json) || !json.ok) {
        const msg =
          (json as { error?: string }).error ??
          "Analytics konnten nicht geladen werden.";
        setError(msg);
        return;
      }
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <HStack py={20} justify="center">
        <Spinner color="var(--leaf)" />
      </HStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" bg="rgba(229,72,77,0.10)" borderRadius="var(--radius-3)">
        <AlertIcon />
        <Stack spacing={1}>
          <Text fontSize="sm" fontFamily="var(--font-sans)">{error}</Text>
          <Button size="xs" variant="ghost" onClick={() => void load()} fontFamily="var(--font-sans)">
            Erneut versuchen
          </Button>
        </Stack>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <Stack spacing={8}>
      <HStack justify="space-between" flexWrap="wrap" gap={3}>
        <Text fontSize="xs" color="var(--mute)" fontFamily="var(--font-mono)">
          Letzte Aktualisierung: {dateFmt.format(new Date(data.generatedAt))}
        </Text>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw size={14} />}
          onClick={() => void load()}
          isLoading={loading}
          borderColor="rgba(74,124,92,0.35)"
          color="var(--leaf)"
          _hover={{ bg: "rgba(74,124,92,0.10)" }}
          fontFamily="var(--font-sans)"
        >
          Aktualisieren
        </Button>
      </HStack>

      <KpiRow data={data} />
      <FunnelSection funnel={data.funnel} />
      <PaymentsSection payments={data.paymentsLog} />
      <CancellationsSection cancellations={data.cancellations} />
      <EmailPerformanceSection rows={data.emailPerformance} />
    </Stack>
  );
}

// ── KPI Row ────────────────────────────────────────────────────────────────

function KpiRow({ data }: { data: AnalyticsResponse }) {
  const churnIsPositive = data.churn.churnRate30dPct < 5;
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
      <StatWidget
        icon={<Wallet size={18} />}
        label="MRR (Monthly Recurring)"
        value={eurFmt.format(data.mrr.mrrEur)}
        sublabel={`${data.mrr.monthlyActiveSubs} aktive Monats-Abos · ${eurFmt.format(data.mrr.monthlyPriceEur)} / Monat`}
      />
      <StatWidget
        icon={<Wallet size={18} />}
        label="Lifetime-Umsatz · 30d"
        value={eurFmt.format(data.mrr.lifetimeRevenue30dEur)}
        sublabel={`${data.mrr.lifetimeActive} aktive Lifetime-Mitglieder gesamt`}
      />
      <StatWidget
        icon={<TrendingDown size={18} />}
        label="Churn-Rate · 30d"
        value={`${data.churn.churnRate30dPct.toFixed(1)} %`}
        sublabel={`${data.churn.canceled30d} Kündigungen · Basis: ${data.churn.activeAtStart} aktive`}
        trend={churnIsPositive ? "down" : "up"}
        trendInverted
      />
      <StatWidget
        icon={<Users size={18} />}
        label="Registrierungen · 30d"
        value={String(data.funnel["30d"].registrations)}
        sublabel={`${data.funnel["7d"].registrations} in den letzten 7 Tagen`}
      />
    </SimpleGrid>
  );
}

function StatWidget(props: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  trend?: "up" | "down";
  trendInverted?: boolean;
}) {
  const { icon, label, value, sublabel, trend, trendInverted } = props;

  let trendColor: string | undefined;
  if (trend) {
    const positive = trendInverted ? trend === "down" : trend === "up";
    trendColor = positive ? "#4ADE80" : "#F87171";
  }

  return (
    <Box
      bg="rgba(18,38,32,0.50)"
      backdropFilter="blur(20px) saturate(1.6)"
      border="1px solid rgba(74,124,92,0.20)"
      borderRadius="var(--radius-4)"
      p="18px 20px"
      boxShadow="var(--shadow-cool-2)"
      position="relative"
      overflow="hidden"
    >
      <Stack spacing={3}>
        <HStack justify="space-between">
          <HStack spacing={2} color="var(--leaf)">
            {icon}
            <Text
              fontSize="11px"
              fontWeight={500}
              letterSpacing="0.08em"
              textTransform="uppercase"
              color="var(--mute)"
              fontFamily="var(--font-mono)"
            >
              {label}
            </Text>
          </HStack>
          {trend && trendColor ? (
            <HStack spacing={1} color={trendColor}>
              {trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </HStack>
          ) : null}
        </HStack>
        <Text
          fontFamily="var(--font-mono)"
          fontSize="28px"
          fontWeight={700}
          lineHeight="1"
          color="var(--paper)"
        >
          {value}
        </Text>
        {sublabel ? (
          <Text fontSize="xs" color="var(--mute)" fontFamily="var(--font-sans)">
            {sublabel}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
}

// ── Funnel ─────────────────────────────────────────────────────────────────

function FunnelSection({ funnel }: { funnel: AnalyticsResponse["funnel"] }) {
  const [tab, setTab] = useState<"7d" | "30d">("30d");
  const w = funnel[tab];

  const max = Math.max(
    w.registrations,
    w.applicationsReviewed,
    w.approved,
    w.paidAfterApproval,
    1,
  );

  return (
    <SectionCard
      title="Funnel-Konversion"
      icon={<Activity size={16} />}
      right={
        <HStack spacing={1}>
          {(["7d", "30d"] as const).map((id) => (
            <TabButton key={id} active={tab === id} onClick={() => setTab(id)}>
              {id === "7d" ? "7 Tage" : "30 Tage"}
            </TabButton>
          ))}
        </HStack>
      }
    >
      <Stack spacing={5}>
        <FunnelBar label="Registrierungen" value={w.registrations} max={max} />
        <FunnelBar
          label="Bewerbungen reviewed"
          value={w.applicationsReviewed}
          max={max}
          subtext={`${w.approved} angenommen · ${w.rejected} abgelehnt`}
        />
        <FunnelBar
          label="Approved"
          value={w.approved}
          max={max}
          subtext={`Approval-Rate ${w.approvalRatePct.toFixed(1)} %`}
        />
        <FunnelBar
          label="Paid nach Approval"
          value={w.paidAfterApproval}
          max={max}
          subtext={`Paid-Konversion ${w.paidConversionPct.toFixed(1)} %`}
        />
      </Stack>
    </SectionCard>
  );
}

function FunnelBar(props: {
  label: string;
  value: number;
  max: number;
  subtext?: string;
}) {
  const { label, value, max, subtext } = props;
  const pct = max > 0 ? Math.max(0.02, value / max) : 0;

  return (
    <Stack spacing={2}>
      <HStack justify="space-between">
        <Text fontSize="sm" color="var(--paper)" fontFamily="var(--font-sans)">
          {label}
        </Text>
        <Text fontFamily="var(--font-mono)" fontSize="sm" color="var(--paper)">
          {value}
        </Text>
      </HStack>
      <Box bg="rgba(255,255,255,0.06)" borderRadius="var(--radius-full)" overflow="hidden" h="8px">
        <Box
          h="full"
          w={`${(pct * 100).toFixed(2)}%`}
          background="var(--gradient-leaf-glow)"
          borderRadius="var(--radius-full)"
          boxShadow="0 0 8px rgba(74,124,92,0.30)"
          transition="width 600ms cubic-bezier(0.16, 1, 0.3, 1)"
        />
      </Box>
      {subtext ? (
        <Text fontSize="xs" color="var(--mute)" fontFamily="var(--font-sans)">
          {subtext}
        </Text>
      ) : null}
    </Stack>
  );
}

// ── Payments ───────────────────────────────────────────────────────────────

function PaymentsSection({ payments }: { payments: PaymentLogRow[] }) {
  const [filter, setFilter] = useState<PaymentFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return payments;
    if (filter === "succeeded")
      return payments.filter((p) => p.status === "succeeded");
    return payments.filter(
      (p) => p.status === "failed" || p.status.startsWith("payment_failed"),
    );
  }, [payments, filter]);

  return (
    <SectionCard
      title="Payments-Log · letzte 30 Tage"
      icon={<Wallet size={16} />}
      right={
        <HStack spacing={1}>
          {PAYMENT_STATUS_FILTERS.map((f) => (
            <TabButton key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </TabButton>
          ))}
        </HStack>
      }
    >
      <Box
        bg="rgba(14,14,12,0.60)"
        border="1px solid rgba(255,255,255,0.07)"
        borderRadius="var(--radius-3)"
        overflow="hidden"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "140px 1.5fr 100px 110px 110px 60px" }}
          gap={0}
          fontSize="11px"
          fontWeight={500}
          letterSpacing="0.08em"
          textTransform="uppercase"
          color="var(--mute)"
          bg="rgba(255,255,255,0.02)"
          borderBottom="1px solid rgba(255,255,255,0.07)"
          px={4}
          py={3}
          fontFamily="var(--font-mono)"
          display={{ base: "none", md: "grid" }}
        >
          <GridItem>Datum</GridItem>
          <GridItem>User</GridItem>
          <GridItem>Typ</GridItem>
          <GridItem textAlign="right">Betrag</GridItem>
          <GridItem>Status</GridItem>
          <GridItem textAlign="right">Invoice</GridItem>
        </Grid>

        {filtered.length === 0 ? (
          <Text px={4} py={6} fontSize="sm" color="var(--mute)" fontFamily="var(--font-sans)">
            Keine Zahlungen in dieser Ansicht.
          </Text>
        ) : (
          filtered.map((p) => (
            <Grid
              key={p.id}
              templateColumns={{ base: "1fr", md: "140px 1.5fr 100px 110px 110px 60px" }}
              gap={2}
              px={4}
              py={3}
              borderBottom="1px solid rgba(255,255,255,0.05)"
              fontSize="14px"
              color="var(--mute)"
              alignItems="center"
              transition="background var(--duration-fast)"
              _hover={{ bg: "rgba(255,255,255,0.03)" }}
              fontFamily="var(--font-sans)"
            >
              <GridItem fontFamily="var(--font-mono)" fontSize="xs">
                {dateFmt.format(new Date(p.createdAt))}
              </GridItem>
              <GridItem minW={0}>
                <Stack spacing={0}>
                  <Text noOfLines={1} color="var(--paper)" fontSize="sm">
                    {p.userName ?? p.userEmail ?? "—"}
                  </Text>
                  {p.userEmail && p.userName ? (
                    <Text noOfLines={1} fontSize="xs" color="var(--mute)">
                      {p.userEmail}
                    </Text>
                  ) : null}
                </Stack>
              </GridItem>
              <GridItem>
                <PaymentTypeBadge type={p.type} />
              </GridItem>
              <GridItem
                textAlign={{ base: "left", md: "right" }}
                fontFamily="var(--font-mono)"
                color="var(--paper)"
                fontWeight={600}
              >
                {eurFmtCents.format(p.amountEur)}
              </GridItem>
              <GridItem>
                <PaymentStatusBadge status={p.status} />
              </GridItem>
              <GridItem textAlign={{ base: "left", md: "right" }}>
                {p.stripeInvoiceId ? (
                  <Box
                    as="a"
                    href={`https://dashboard.stripe.com/invoices/${p.stripeInvoiceId}`}
                    target="_blank"
                    rel="noreferrer"
                    color="var(--leaf)"
                    display="inline-flex"
                    alignItems="center"
                    _hover={{ color: "var(--glow)" }}
                  >
                    <ExternalLink size={14} />
                  </Box>
                ) : (
                  <Text fontSize="xs" color="var(--mute)">—</Text>
                )}
              </GridItem>
            </Grid>
          ))
        )}
      </Box>
    </SectionCard>
  );
}

function PaymentTypeBadge({ type }: { type: PaymentLogRow["type"] }) {
  const variants: Record<PaymentLogRow["type"], { bg: string; color: string; border: string }> = {
    lifetime: {
      bg: "rgba(45,84,67,0.25)",
      color: "var(--leaf)",
      border: "rgba(74,124,92,0.30)",
    },
    monthly: {
      bg: "rgba(255,255,255,0.06)",
      color: "var(--mute)",
      border: "rgba(255,255,255,0.10)",
    },
    unknown: {
      bg: "rgba(255,255,255,0.04)",
      color: "var(--mute)",
      border: "rgba(255,255,255,0.07)",
    },
  };
  const v = variants[type];
  return (
    <Badge
      bg={v.bg}
      color={v.color}
      border={`1px solid ${v.border}`}
      borderRadius="var(--radius-2)"
      fontSize="11px"
      px={2}
      fontFamily="var(--font-sans)"
      textTransform="capitalize"
    >
      {type === "unknown" ? "—" : type}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const variant =
    lower === "succeeded"
      ? { bg: "rgba(34,197,94,0.10)", color: "#4ADE80", border: "rgba(34,197,94,0.18)" }
      : lower === "failed" || lower.startsWith("payment_failed")
        ? { bg: "rgba(239,68,68,0.10)", color: "#F87171", border: "rgba(239,68,68,0.18)" }
        : { bg: "rgba(255,255,255,0.06)", color: "var(--mute)", border: "rgba(255,255,255,0.08)" };
  return (
    <Badge
      bg={variant.bg}
      color={variant.color}
      border={`1px solid ${variant.border}`}
      borderRadius="var(--radius-2)"
      fontSize="11px"
      px={2}
      fontFamily="var(--font-sans)"
      textTransform="capitalize"
    >
      {status}
    </Badge>
  );
}

// ── Cancellations ──────────────────────────────────────────────────────────

function CancellationsSection({ cancellations }: { cancellations: CancellationRow[] }) {
  return (
    <SectionCard title="Cancellations-Inbox" icon={<XCircle size={16} />}>
      {cancellations.length === 0 ? (
        <Text fontSize="sm" color="var(--mute)" fontFamily="var(--font-sans)">
          Noch keine Kündigungs-Antworten.
        </Text>
      ) : (
        <Stack spacing={3}>
          {cancellations.map((c) => (
            <Box
              key={c.id}
              borderRadius="var(--radius-3)"
              border="1px solid rgba(255,255,255,0.07)"
              bg="rgba(255,255,255,0.03)"
              p={4}
            >
              <HStack justify="space-between" mb={2} flexWrap="wrap" gap={2}>
                <Stack spacing={0}>
                  <Text fontFamily="var(--font-sans)" fontWeight={500} color="var(--paper)" fontSize="sm">
                    {c.userName ?? c.userEmail ?? "Unbekannt"}
                  </Text>
                  {c.userEmail && c.userName ? (
                    <Text fontSize="xs" color="var(--mute)" fontFamily="var(--font-sans)">
                      {c.userEmail}
                    </Text>
                  ) : null}
                </Stack>
                <HStack spacing={2}>
                  {c.structuredReason ? (
                    <Badge
                      bg="rgba(74,124,92,0.16)"
                      color="var(--leaf)"
                      border="1px solid rgba(74,124,92,0.28)"
                      borderRadius="var(--radius-2)"
                      fontSize="11px"
                      px={2}
                      fontFamily="var(--font-sans)"
                    >
                      {STRUCTURED_REASON_LABELS[c.structuredReason] ?? c.structuredReason}
                    </Badge>
                  ) : null}
                  <Text fontSize="xs" color="var(--mute)" fontFamily="var(--font-mono)">
                    {dateOnlyFmt.format(new Date(c.canceledAt))}
                  </Text>
                </HStack>
              </HStack>
              {(c.feedback ?? c.reason) ? (
                <Text
                  fontSize="sm"
                  color="var(--mute)"
                  fontFamily="var(--font-sans)"
                  whiteSpace="pre-wrap"
                  lineHeight="1.6"
                >
                  {c.feedback ?? c.reason}
                </Text>
              ) : (
                <Text fontSize="xs" color="rgba(139,134,126,0.5)" fontFamily="var(--font-sans)" fontStyle="italic">
                  Kein Freitext angegeben.
                </Text>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}

// ── Email Performance ──────────────────────────────────────────────────────

function EmailPerformanceSection({ rows }: { rows: EmailPerfRow[] }) {
  const [groupBy, setGroupBy] = useState<"sequence" | "step">("sequence");

  const aggregated = useMemo(() => {
    if (groupBy === "step") return rows;
    const map = new Map<string, EmailPerfRow>();
    for (const r of rows) {
      const cur = map.get(r.sequence) ?? {
        sequence: r.sequence,
        step: -1,
        sent: 0,
        opened: 0,
        clicked: 0,
        openRatePct: 0,
        clickRatePct: 0,
      };
      cur.sent += r.sent;
      cur.opened += r.opened;
      cur.clicked += r.clicked;
      map.set(r.sequence, cur);
    }
    return Array.from(map.values()).map((r) => ({
      ...r,
      openRatePct: r.sent > 0 ? (r.opened / r.sent) * 100 : 0,
      clickRatePct: r.sent > 0 ? (r.clicked / r.sent) * 100 : 0,
    }));
  }, [rows, groupBy]);

  return (
    <SectionCard
      title="Email-Performance · letzte 60 Tage"
      icon={<Mail size={16} />}
      right={
        <Select
          size="xs"
          maxW="180px"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as "sequence" | "step")}
          bg="rgba(255,255,255,0.04)"
          borderColor="rgba(255,255,255,0.10)"
          color="var(--paper)"
          fontFamily="var(--font-sans)"
        >
          <option value="sequence">Pro Sequence</option>
          <option value="step">Pro Step</option>
        </Select>
      }
    >
      {aggregated.length === 0 ? (
        <Text fontSize="sm" color="var(--mute)" fontFamily="var(--font-sans)">
          Noch keine Email-Logs. Daten werden befüllt, sobald Sequenzen versenden
          und der Resend-Webhook Events liefert.
        </Text>
      ) : (
        <Box
          bg="rgba(14,14,12,0.60)"
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="var(--radius-3)"
          overflow="hidden"
        >
          <Grid
            templateColumns={{ base: "1fr", md: "1.5fr 80px 110px 110px 110px 110px" }}
            px={4}
            py={3}
            bg="rgba(255,255,255,0.02)"
            borderBottom="1px solid rgba(255,255,255,0.07)"
            fontSize="11px"
            fontWeight={500}
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="var(--mute)"
            fontFamily="var(--font-mono)"
            display={{ base: "none", md: "grid" }}
          >
            <GridItem>Sequence</GridItem>
            <GridItem textAlign="right">Step</GridItem>
            <GridItem textAlign="right">Gesendet</GridItem>
            <GridItem textAlign="right">Geöffnet</GridItem>
            <GridItem textAlign="right">Open-Rate</GridItem>
            <GridItem textAlign="right">Click-Rate</GridItem>
          </Grid>
          {aggregated.map((row) => (
            <Grid
              key={`${row.sequence}-${row.step}`}
              templateColumns={{ base: "1fr", md: "1.5fr 80px 110px 110px 110px 110px" }}
              px={4}
              py={3}
              borderBottom="1px solid rgba(255,255,255,0.05)"
              fontSize="14px"
              alignItems="center"
              _hover={{ bg: "rgba(255,255,255,0.03)" }}
            >
              <GridItem color="var(--paper)" fontFamily="var(--font-sans)">
                {row.sequence}
              </GridItem>
              <GridItem
                textAlign={{ base: "left", md: "right" }}
                fontFamily="var(--font-mono)"
                color="var(--mute)"
              >
                {row.step === -1 ? "·" : row.step}
              </GridItem>
              <GridItem
                textAlign={{ base: "left", md: "right" }}
                fontFamily="var(--font-mono)"
                color="var(--paper)"
              >
                {row.sent}
              </GridItem>
              <GridItem
                textAlign={{ base: "left", md: "right" }}
                fontFamily="var(--font-mono)"
                color="var(--mute)"
              >
                {row.opened}
              </GridItem>
              <GridItem
                textAlign={{ base: "left", md: "right" }}
                fontFamily="var(--font-mono)"
                color="var(--leaf)"
              >
                {row.openRatePct.toFixed(1)} %
              </GridItem>
              <GridItem
                textAlign={{ base: "left", md: "right" }}
                fontFamily="var(--font-mono)"
                color="var(--leaf)"
              >
                {row.clickRatePct.toFixed(1)} %
              </GridItem>
            </Grid>
          ))}
        </Box>
      )}
    </SectionCard>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────

function SectionCard(props: {
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={4}>
      <HStack justify="space-between" flexWrap="wrap" gap={2}>
        <HStack spacing={2}>
          {props.icon ? (
            <Box color="var(--leaf)">{props.icon}</Box>
          ) : null}
          <Text fontFamily="var(--font-display)" fontSize="lg" color="var(--paper)">
            {props.title}
          </Text>
        </HStack>
        {props.right}
      </HStack>
      <Box>{props.children}</Box>
    </Stack>
  );
}
