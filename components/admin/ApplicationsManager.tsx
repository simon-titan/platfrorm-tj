"use client";

import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Collapse,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Status = "pending" | "approved" | "rejected";
type Tab = Status | "all";

interface ApplicationRow {
  id: string;
  userId: string | null;
  email: string;
  name: string | null;
  experience: string;
  biggestProblem: string;
  goal6Months: string;
  status: Status;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewedByName: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

interface Counters {
  pending: number;
  approved: number;
  rejected: number;
  all: number;
}

const TAB_ORDER: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "Alle" },
];

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return iso;
  }
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `vor ${min}m`;
  const h = Math.floor(min / 60);
  if (h < 48) return `vor ${h}h`;
  const d = Math.floor(h / 24);
  return `vor ${d}d`;
}

export function ApplicationsManager() {
  const [tab, setTab] = useState<Tab>("pending");
  const [items, setItems] = useState<ApplicationRow[]>([]);
  const [counters, setCounters] = useState<Counters>({ pending: 0, approved: 0, rejected: 0, all: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const rejectModal = useDisclosure();
  const [rejectTarget, setRejectTarget] = useState<ApplicationRow | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const load = useCallback(async (status: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/applications?status=${status}`);
      const json = (await res.json()) as {
        ok?: boolean;
        items?: ApplicationRow[];
        counters?: Counters;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Bewerbungen konnten nicht geladen werden.");
        return;
      }
      setItems(json.items ?? []);
      if (json.counters) setCounters(json.counters);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        (r.name ?? "").toLowerCase().includes(q),
    );
  }, [items, search]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function approve(row: ApplicationRow) {
    setBusyIds((s) => new Set(s).add(row.id));
    try {
      const res = await fetch(`/api/admin/applications/${row.id}/approve`, {
        method: "POST",
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Annehmen fehlgeschlagen.");
        return;
      }
      await load(tab);
    } finally {
      setBusyIds((s) => {
        const next = new Set(s);
        next.delete(row.id);
        return next;
      });
    }
  }

  function openReject(row: ApplicationRow) {
    setRejectTarget(row);
    setRejectReason("");
    rejectModal.onOpen();
  }

  async function confirmReject() {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      const res = await fetch(`/api/admin/applications/${rejectTarget.id}/reject`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() || undefined }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Ablehnen fehlgeschlagen.");
        return;
      }
      rejectModal.onClose();
      setRejectTarget(null);
      await load(tab);
    } finally {
      setRejecting(false);
    }
  }

  return (
    <Stack spacing={6}>
      <HStack spacing={2} flexWrap="wrap">
        {TAB_ORDER.map((t) => {
          const active = tab === t.id;
          const count =
            t.id === "all"
              ? counters.all
              : t.id === "pending"
                ? counters.pending
                : t.id === "approved"
                  ? counters.approved
                  : counters.rejected;
          return (
            <Button
              key={t.id}
              size="sm"
              variant="outline"
              onClick={() => setTab(t.id)}
              bg={active ? "rgba(74,124,92,0.14)" : "transparent"}
              borderColor={active ? "rgba(74,124,92,0.40)" : "rgba(255,255,255,0.12)"}
              color={active ? "var(--leaf)" : "var(--mute)"}
              _hover={{
                bg: "rgba(255,255,255,0.06)",
                borderColor: "rgba(74,124,92,0.35)",
              }}
              fontFamily="var(--font-sans)"
            >
              {t.label}
              <Badge
                ml={2}
                bg={active ? "rgba(74,124,92,0.16)" : "rgba(255,255,255,0.06)"}
                color={active ? "var(--leaf)" : "var(--mute)"}
                borderRadius="full"
                px={2}
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </HStack>

      <InputGroup maxW="360px">
        <InputLeftElement pointerEvents="none">
          <Search size={16} color="rgba(255,255,255,0.4)" />
        </InputLeftElement>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nach E-Mail oder Name suchen…"
          bg="rgba(255,255,255,0.04)"
          borderColor="rgba(255,255,255,0.12)"
          _hover={{ borderColor: "rgba(74,124,92,0.35)" }}
          _focus={{
            borderColor: "rgba(74,124,92,0.50)",
            boxShadow: "0 0 0 1px rgba(74,124,92,0.35)",
          }}
          color="var(--paper)"
          fontFamily="var(--font-sans)"
        />
      </InputGroup>

      {error && (
        <Alert status="error" variant="subtle" bg="rgba(229,72,77,0.10)" borderRadius="12px">
          <AlertIcon />
          <Text fontSize="sm" fontFamily="var(--font-sans)">{error}</Text>
        </Alert>
      )}

      {loading ? (
        <HStack py={12} justify="center">
          <Spinner color="var(--leaf)" />
        </HStack>
      ) : filtered.length === 0 ? (
        <Box
          py={12}
          textAlign="center"
          color="var(--mute)"
          fontFamily="var(--font-sans)"
          fontSize="sm"
          border="1px dashed rgba(255,255,255,0.08)"
          borderRadius="12px"
        >
          Keine Bewerbungen in dieser Ansicht.
        </Box>
      ) : (
        <Stack spacing={3}>
          {filtered.map((row) => (
            <ApplicationCard
              key={row.id}
              row={row}
              isOpen={expanded.has(row.id)}
              busy={busyIds.has(row.id)}
              onToggle={() => toggleExpand(row.id)}
              onApprove={() => approve(row)}
              onReject={() => openReject(row)}
            />
          ))}
        </Stack>
      )}

      <Modal isOpen={rejectModal.isOpen} onClose={rejectModal.onClose} isCentered>
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.6)" />
        <ModalContent
          bg="rgba(20,20,26,0.96)"
          border="1px solid rgba(255,255,255,0.09)"
          color="var(--paper)"
        >
          <ModalHeader fontFamily="var(--font-display)" fontWeight={400}>
            Bewerbung ablehnen
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Text fontSize="sm" color="var(--mute)" fontFamily="var(--font-sans)">
                Der Grund ist nur intern sichtbar — er taucht NICHT in der E-Mail auf.
              </Text>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Optionaler interner Grund…"
                bg="rgba(255,255,255,0.04)"
                borderColor="rgba(255,255,255,0.12)"
                _focus={{
                  borderColor: "rgba(74,124,92,0.50)",
                  boxShadow: "0 0 0 1px rgba(74,124,92,0.35)",
                }}
                minH="120px"
                fontFamily="var(--font-sans)"
              />
            </Stack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={rejectModal.onClose} fontFamily="var(--font-sans)">
              Abbrechen
            </Button>
            <Button
              onClick={confirmReject}
              isLoading={rejecting}
              loadingText="Ablehnen…"
              bg="rgba(229,72,77,0.18)"
              color="#FCA5A5"
              border="1px solid rgba(229,72,77,0.45)"
              _hover={{ bg: "rgba(229,72,77,0.28)" }}
              fontFamily="var(--font-sans)" fontWeight={600}
            >
              Endgültig ablehnen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

function ApplicationCard(props: {
  row: ApplicationRow;
  isOpen: boolean;
  busy: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { row, isOpen, busy, onToggle, onApprove, onReject } = props;

  return (
    <Box
      borderRadius="14px"
      border="1px solid rgba(255,255,255,0.09)"
      bg="rgba(255,255,255,0.04)"
      overflow="hidden"
      transition="border-color .2s ease, background .2s ease"
      _hover={{ borderColor: "rgba(74,124,92,0.18)" }}
    >
      <HStack
        as="button"
        onClick={onToggle}
        w="full"
        p={4}
        spacing={4}
        align="center"
        justifyContent="space-between"
        textAlign="left"
        _hover={{ bg: "rgba(255,255,255,0.02)" }}
      >
        <HStack spacing={3} align="center" flex="1" minW={0}>
          <StatusDot status={row.status} />
          <Stack spacing={0} flex="1" minW={0}>
            <HStack spacing={2}>
              <Text fontFamily="var(--font-sans)" fontWeight={600} color="var(--paper)" noOfLines={1}>
                {row.name || "(Kein Name)"}
              </Text>
              <Text fontSize="xs" fontFamily="var(--font-sans)" color="var(--mute)">
                · {relativeTime(row.createdAt)}
              </Text>
            </HStack>
            <Text fontSize="xs" fontFamily="var(--font-sans)" color="var(--mute)" noOfLines={1}>
              {row.email}
            </Text>
          </Stack>
        </HStack>

        <HStack spacing={2}>
          <StatusBadge status={row.status} />
          <Box color="var(--mute)">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Box>
        </HStack>
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <Box px={5} pb={5} pt={2} borderTop="1px solid rgba(255,255,255,0.06)">
          <Stack spacing={4}>
            <AnswerBlock label="Erfahrung" value={row.experience} />
            <AnswerBlock label="Größtes Problem" value={row.biggestProblem} />
            <AnswerBlock label="Ziel in 6 Monaten" value={row.goal6Months} />

            {row.status === "pending" ? (
              <HStack justify="flex-end" pt={2} spacing={2}>
                <Button
                  onClick={onReject}
                  isDisabled={busy}
                  variant="outline"
                  borderColor="rgba(229,72,77,0.45)"
                  color="#FCA5A5"
                  bg="rgba(229,72,77,0.08)"
                  _hover={{ bg: "rgba(229,72,77,0.18)" }}
                  leftIcon={<X size={16} />}
                  fontFamily="var(--font-sans)"
                >
                  Ablehnen
                </Button>
                <Button
                  onClick={onApprove}
                  isLoading={busy}
                  loadingText="Annehmen…"
                  bg="linear-gradient(135deg, #4A7C5C 0%, #2D5443 100%)"
                  color="#0a0a0a"
                  _hover={{ filter: "brightness(1.06)" }}
                  leftIcon={<Check size={16} />}
                  fontFamily="var(--font-sans)" fontWeight={600}
                >
                  Annehmen
                </Button>
              </HStack>
            ) : (
              <Stack spacing={1} pt={2}>
                <Text fontSize="xs" fontFamily="var(--font-sans)" color="var(--mute)">
                  {row.status === "approved" ? "✓ Angenommen" : "✗ Abgelehnt"} am{" "}
                  {formatDate(row.reviewedAt)}
                  {row.reviewedByName ? ` durch ${row.reviewedByName}` : ""}
                </Text>
                {row.status === "rejected" && row.rejectionReason && (
                  <Text fontSize="xs" fontFamily="var(--font-sans)" color="var(--mute)">
                    Interner Grund: {row.rejectionReason}
                  </Text>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

function AnswerBlock({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={1}>
      <Text
        fontSize="xs"
        letterSpacing="0.14em"
        textTransform="uppercase"
        color="var(--leaf)"
        fontFamily="var(--font-sans)" fontWeight={600}
      >
        {label}
      </Text>
      <Text
        fontSize="sm"
        color="var(--paper)"
        fontFamily="var(--font-sans)"
        whiteSpace="pre-wrap"
        lineHeight="1.6"
      >
        {value}
      </Text>
    </Stack>
  );
}

function StatusDot({ status }: { status: Status }) {
  const color =
    status === "pending" ? "#F5C84A" : status === "approved" ? "#34D399" : "#F87171";
  return (
    <Box
      w="10px"
      h="10px"
      borderRadius="full"
      bg={color}
      boxShadow={`0 0 12px ${color}55`}
      flexShrink={0}
    />
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "pending") {
    return (
      <Badge
        bg="rgba(245,200,74,0.14)"
        color="#F5C84A"
        border="1px solid rgba(245,200,74,0.4)"
        borderRadius="full"
        px={2}
        py={0.5}
        textTransform="none"
        fontWeight={500}
        fontFamily="var(--font-sans)"
      >
        Pending
      </Badge>
    );
  }
  if (status === "approved") {
    return (
      <Badge
        bg="rgba(52,211,153,0.14)"
        color="#34D399"
        border="1px solid rgba(52,211,153,0.4)"
        borderRadius="full"
        px={2}
        py={0.5}
        textTransform="none"
        fontWeight={500}
        fontFamily="var(--font-sans)"
      >
        Angenommen
      </Badge>
    );
  }
  return (
    <Badge
      bg="rgba(248,113,113,0.14)"
      color="#F87171"
      border="1px solid rgba(248,113,113,0.4)"
      borderRadius="full"
      px={2}
      py={0.5}
      textTransform="none"
      fontWeight={500}
      fontFamily="var(--font-sans)"
    >
      Abgelehnt
    </Badge>
  );
}
