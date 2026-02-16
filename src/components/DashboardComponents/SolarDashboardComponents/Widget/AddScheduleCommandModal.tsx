import React from "react";
import {
  Box, VStack, HStack, Text, Button, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  InputGroup, Input, InputLeftAddon, InputRightAddon, InputRightElement, Textarea, Divider,
  useToast, Alert, AlertIcon, AlertTitle, AlertDescription, Portal,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { FiCalendar } from "react-icons/fi";
import { useInsertStrategy } from "../../../../hooks/energy_strategy/useInsertStrategy";
import { useFetchSchedules } from "../../../../hooks/energy_strategy/useFetchSchedules";
import { useDeleteSchedule } from "../../../../hooks/energy_strategy/useDeleteSchedule";

type Normalized = "basic" | "smart" | "flat" | "peak" | "disable";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: () => void;
  currentStrategy?: string | Normalized;
};

function SegButton({
  children, isActive, onClick,
}: { children: React.ReactNode; isActive?: boolean; onClick?: () => void }) {
  const activeBg   = useColorModeValue("#DBF9F7", "#103C3C");
  const activeText = useColorModeValue("#0b1516", "#CFF2F2");
  const idleBg     = useColorModeValue("#EEF2F4", "#262C2C");
  const idleText   = useColorModeValue("#0f172a", "#C7D0D0");
  const borderCol  = useColorModeValue("#E5E7EB", "#30383A");
  return (
    <Button
      onClick={onClick}
      h="30px" px="12px" borderRadius="16px"
      bg={isActive ? activeBg : idleBg} color={isActive ? activeText : idleText}
      border="1px solid" borderColor={borderCol}
      _hover={{ bg: isActive ? activeBg : idleBg }} _active={{ bg: isActive ? activeBg : idleBg }}
    >
      <HStack spacing="6px">{isActive && <CheckIcon boxSize="10px" />}<Text fontSize="sm">{children}</Text></HStack>
    </Button>
  );
}

function normalizeStrategy(val: unknown): Normalized {
  const s = String(val ?? "").trim().toLowerCase();
  if (s === "0" || s.includes("basic")) return "basic";
  if (s === "3" || s.includes("smart")) return "smart";
  if (s === "4" || s.includes("flat")) return "flat";
  if (s === "5" || s.includes("peak")) return "peak";
  if (s === "200" || s.includes("disable") || s.includes("disabled")) return "disable";
  return "basic";
}

// --- Helpers ---
const toDate = (v: string | number | Date) => new Date(v);
const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
  aStart < bEnd && bStart < aEnd;

// convert Date -> "YYYY-MM-DDTHH:mm" local (for <input type="datetime-local" min=...>)
const toLocalInput = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

type ScheduleItem = {
  id?: number | string;
  start_ts: string | number | Date;
  end_ts?: string | number | Date | null;
  duration?: number | string | null;
  type?: string;
  priority?: "low" | "medium" | "high";
};

export default function AddScheduleCommandModal({ isOpen, onClose, onAdded, currentStrategy = "basic" }: Props) {
  const insertStrategy = useInsertStrategy();
  const fetchSchedules = useFetchSchedules();
  const deleteSchedule = useDeleteSchedule();
  const toast = useToast();

  const norm = normalizeStrategy(currentStrategy);

  const [cmd, setCmd] = React.useState<"Charge" | "Discharge" | "Idle" | "Grid Support">("Charge");
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">("low");

  const [form, setForm] = React.useState({
    from: "",
    to: "",
    command: "Charge",
    power: "",
    duration: "",
    socMin: "",
    socMax: "",
    tariff: "",
    load: "",
    remarks: "",
  });

  // min value for datetime inputs (blocks past selection)
  const [minDt, setMinDt] = React.useState<string>(toLocalInput(new Date()));
  React.useEffect(() => {
    if (isOpen) setMinDt(toLocalInput(new Date()));
  }, [isOpen]);

  const [conflictOpen, setConflictOpen] = React.useState(false);
  const [conflicts, setConflicts] = React.useState<ScheduleItem[]>([]);

  React.useEffect(() => {
    setForm((f) => ({ ...f, command: cmd }));
  }, [cmd]);

  const softBg      = useColorModeValue("#F3F4F6", "#1C2121");
  const fieldBorder = useColorModeValue("#E5E7EB", "#30383A");
  const labelCol    = useColorModeValue("#475569", "#A6B0B0");

  const hideDurationTariff = norm === "basic" || norm === "peak";
  const hidePower          = norm === "smart" || norm === "flat";
  const showLoad           = norm === "peak";

  const resetAll = () => {
    setCmd("Charge");
    setPriority("low");
    setForm({
      from: "",
      to: "",
      command: "Charge",
      power: "",
      duration: "",
      socMin: "",
      socMax: "",
      tariff: "",
      load: "",
      remarks: "",
    });
    setConflicts([]);
    setConflictOpen(false);
  };

  const closeAndReset = () => { resetAll(); onClose(); };

  const proceedInsert = async (priorityOverride?: "low" | "medium" | "high") => {
    const payload = { ...form };
    const p = priorityOverride ?? priority;
    try {
      const insertedId = await insertStrategy(payload, p);
      if (insertedId) {
        toast({ title: "Schedule added", status: "success", duration: 2500, isClosable: true, position: "top-left" });
        if (onAdded) await onAdded();
        closeAndReset();
      }
    } catch (e: any) {
      toast({
        title: "Insert failed",
        description: e?.message ?? "Unable to add schedule.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  // Delete only overlaps with SAME priority as the one currently selected, then add
  const handleReplaceSamePriority = async () => {
    setConflictOpen(false);
    try {
      const idsToDelete = conflicts
        .filter((c) => c.priority === priority)
        .map((c) => c.id)
        .filter(Boolean) as Array<number | string>;

      if (idsToDelete.length) {
        await Promise.all(idsToDelete.map((id) => deleteSchedule(id)));
      }
      await proceedInsert(); // uses currently selected `priority`
    } catch (e: any) {
      toast({
        title: "Replace failed",
        description: e?.message || "Could not delete existing schedule(s).",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const validateAndSubmit = async () => {
    const errors: string[] = [];

    if (!form.from || !form.to) {
      errors.push("Start and End times are required.");
    }

    const start = form.from ? new Date(form.from) : null;
    const end   = form.to ? new Date(form.to) : null;
    const now   = new Date();

    if (start && end && start >= end) {
      errors.push("Start time must be before End time.");
    }

    // NEW: disallow past window
    if (start && start < now) {
      errors.push("Start time cannot be in the past.");
    }
    if (end && end <= now) {
      errors.push("End time must be in the future.");
    }

    if (!form.command) errors.push("Command type is required.");
    if (!hidePower && form.power && isNaN(Number(form.power))) {
      errors.push("Power must be a number.");
    }
    if (!hideDurationTariff) {
      if (form.duration && !form.tariff) errors.push("Tariff count must match Duration count.");
      if (form.tariff && !form.duration) errors.push("Duration count must match Tariff count.");
      if (form.tariff && form.duration) {
        const tlen = form.tariff.split(",").length;
        const dlen = form.duration.split(",").length;
        if (tlen !== dlen) errors.push("Tariff and Duration count must be equal.");
      }
    }
    if (showLoad) {
      if (!form.load) errors.push("Load (kW) is required for Peak Shaving.");
      else if (isNaN(Number(form.load))) errors.push("Load must be a number.");
    }
    if (form.socMin && isNaN(Number(form.socMin))) errors.push("Min SoC must be a number.");
    if (form.socMax && isNaN(Number(form.socMax))) errors.push("Max SoC must be a number.");
    if (form.socMin && form.socMax && Number(form.socMin) > Number(form.socMax)) {
      errors.push("Min SoC cannot be greater than Max SoC.");
    }
    if (!priority) errors.push("Priority is required.");

    if (errors.length) {
      toast({
        title: "Validation Error",
        description: errors.join(" "),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    // overlap check
    try {
      const aStart = toDate(form.from);
      const aEnd   = toDate(form.to);
      const existing: ScheduleItem[] = await fetchSchedules("all");
      const found = (existing || []).filter((it) => {
        const bStart = toDate(it.start_ts);
        const bEnd = it.end_ts
          ? toDate(it.end_ts)
          : (it.duration ? new Date(toDate(it.start_ts).getTime() + Number(it.duration) * 60_000) : toDate(it.start_ts));
        return overlaps(aStart, aEnd, bStart, bEnd);
      });
      if (found.length) {
        setConflicts(found);
        setConflictOpen(true);
        return;
      }
    } catch (e) {
      console.warn("Overlap check failed; proceeding anyway:", e);
    }

    await proceedInsert();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAndReset}
      isCentered
      motionPreset="scale"
      scrollBehavior="inside"
      blockScrollOnMount
    >
      <ModalOverlay />
      <ModalContent
        maxW={["92vw", "520px"]}
        maxH={["85vh", "80vh"]}
        w="full"
        bg={useColorModeValue("#FFFFFF", "#161B1B")}
        borderRadius="12px"
        p="20px"
        overflow="hidden"
      >
        <ModalHeader p="0" color="#E5E7EB" fontSize="md">
          Add New Schedule Command
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p="0" mt="20px" overflowY="auto">
          <Box w="full" mx="auto">
            <VStack align="stretch" spacing="20px" w="full">
              {/* Command type */}
              <VStack align="stretch" spacing="6px">
                <Text fontSize="sm" color={labelCol}>Select Command type</Text>
                <HStack spacing="10px" flexWrap="wrap">
                  {(["Charge","Discharge","Idle","Grid Support"] as const).map((t) => (
                    <SegButton key={t} isActive={cmd === t} onClick={() => setCmd(t)}>{t}</SegButton>
                  ))}
                </HStack>
              </VStack>

              {/* Time Window */}
              <VStack align="stretch" spacing="6px">
                <Text fontSize="sm" color={labelCol}>Time Window</Text>
                <HStack spacing="12px">
                  <InputGroup size="sm" flex="1">
                    <Input
                      type="datetime-local"
                      placeholder="From"
                      min={minDt}
                      bg={softBg}
                      borderColor={fieldBorder}
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                    />
                    <InputRightElement pointerEvents="none"><FiCalendar /></InputRightElement>
                  </InputGroup>
                  <InputGroup size="sm" flex="1">
                    <Input
                      type="datetime-local"
                      placeholder="To"
                      min={minDt}
                      bg={softBg}
                      borderColor={fieldBorder}
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: e.target.value })}
                    />
                    <InputRightElement pointerEvents="none"><FiCalendar /></InputRightElement>
                  </InputGroup>
                </HStack>
              </VStack>

              {/* Duration & Tariff */}
              {!hideDurationTariff && (
                <>
                  <HStack spacing="10px" justify="space-between">
                    <Text fontSize="sm" color={labelCol} flex="1" textAlign="left">Duration (min)</Text>
                    <Text fontSize="sm" color={labelCol} flex="1" textAlign="right">Tariff (₹)</Text>
                  </HStack>
                  <HStack spacing="10px">
                    <InputGroup size="sm" flex="1">
                      <Input
                        type="text"
                        placeholder="60,60"
                        bg={softBg}
                        borderColor={fieldBorder}
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      />
                      <InputRightAddon borderColor={fieldBorder}>min</InputRightAddon>
                    </InputGroup>
                    <InputGroup size="sm" flex="1">
                      <InputLeftAddon borderColor={fieldBorder}>₹</InputLeftAddon>
                      <Input
                        type="text"
                        placeholder="4.5,3.5"
                        bg={softBg}
                        borderColor={fieldBorder}
                        value={form.tariff}
                        onChange={(e) => setForm({ ...form, tariff: e.target.value })}
                      />
                    </InputGroup>
                  </HStack>
                </>
              )}

              {/* Power */}
              {!hidePower && (
                <>
                  <Text fontSize="sm" color={labelCol}>Power (kW)</Text>
                  <InputGroup size="sm">
                    <Input
                      type="text"
                      placeholder="100"
                      bg={softBg}
                      borderColor={fieldBorder}
                      value={form.power}
                      onChange={(e) => setForm({ ...form, power: e.target.value })}
                    />
                    <InputRightAddon borderColor={fieldBorder}>kW</InputRightAddon>
                  </InputGroup>
                </>
              )}

              {/* Load */}
              {showLoad && (
                <>
                  <Text fontSize="sm" color={labelCol}>Load (kW)</Text>
                  <InputGroup size="sm">
                    <Input
                      type="text"
                      placeholder="e.g., 800"
                      bg={softBg}
                      borderColor={fieldBorder}
                      value={form.load}
                      onChange={(e) => setForm({ ...form, load: e.target.value })}
                    />
                    <InputRightAddon borderColor={fieldBorder}>kW</InputRightAddon>
                  </InputGroup>
                </>
              )}

              {/* SoC + Priority */}
              <HStack spacing="20px" align="flex-start" flexWrap="wrap">
                <VStack align="stretch" spacing="6px" minW="180px" flex="1">
                  <Text fontSize="sm" color={labelCol}>SoC Threshold</Text>
                  <HStack spacing="8px">
                    <InputGroup size="sm" flex="1">
                      <Input
                        placeholder="Min"
                        bg={softBg}
                        borderColor={fieldBorder}
                        value={form.socMin}
                        onChange={(e) => setForm({ ...form, socMin: e.target.value })}
                      />
                    </InputGroup>
                    <Text color={labelCol}>/</Text>
                    <InputGroup size="sm" flex="1">
                      <Input
                        placeholder="Max"
                        bg={softBg}
                        borderColor={fieldBorder}
                        value={form.socMax}
                        onChange={(e) => setForm({ ...form, socMax: e.target.value })}
                      />
                    </InputGroup>
                  </HStack>
                </VStack>
                <VStack align="stretch" spacing="6px" minW="220px" flex="2">
                  <Text fontSize="sm" color={labelCol}>Select Priority Level</Text>
                  <HStack spacing="10px" flexWrap="wrap">
                    {(["low","medium","high"] as const).map((p) => (
                      <SegButton key={p} isActive={priority === p} onClick={() => setPriority(p)}>
                        {p[0].toUpperCase() + p.slice(1)}
                      </SegButton>
                    ))}
                  </HStack>
                </VStack>
              </HStack>

              {/* Remarks */}
              <Text fontSize="sm" color={labelCol}>Remarks</Text>
              <Textarea
                h="32px"
                resize="none"
                bg={useColorModeValue("#00000059", "#242929")}
                borderColor={fieldBorder}
                placeholder="Comment to this schedule"
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                _focus={{ borderColor: "#33D2D2", boxShadow: "0 0 0 1px #33D2D2" }}
              />
            </VStack>
          </Box>
        </ModalBody>

        <Divider borderColor={fieldBorder} my="16px" />
        <ModalFooter p="0">
          <HStack spacing="10px">
            <Button variant="outline" onClick={closeAndReset}>Cancel</Button>
            <Button colorScheme="teal" onClick={validateAndSubmit}>Add Command</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>

      {/* Conflict Resolver Modal */}
      <Portal>
        <Modal
          isOpen={conflictOpen}
          onClose={() => setConflictOpen(false)}
          isCentered
          size="sm"
          motionPreset="slideInBottom"
          blockScrollOnMount={false}
          trapFocus={false}
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent
            maxW={["92vw", "480px"]}
            maxH="70vh"
            w="full"
            bg={useColorModeValue("#FFFFFF", "#161B1B")}
            borderRadius="12px"
            p="16px"
            overflow="hidden"
          >
            <ModalHeader p="0" color="#E5E7EB" fontSize="md">
              Overlapping Schedule Found
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody p="0" mt="12px" overflowY="auto">
              <VStack align="stretch" spacing="12px">
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <AlertTitle fontSize="sm">
                      A schedule already exists in this time window.
                    </AlertTitle>
                    <AlertDescription fontSize="sm">
                      We will replace only the overlapping schedule(s) with the <b>same priority</b> as selected.
                    </AlertDescription>
                  </VStack>
                </Alert>

                {/* conflict list */}
                <VStack align="stretch" spacing={2}>
                  {conflicts.slice(0, 5).map((c, i) => {
                    const s = toDate(c?.start_ts);
                    const e = c?.end_ts
                      ? toDate(c.end_ts)
                      : (c?.duration ? new Date(toDate(c.start_ts).getTime() + Number(c.duration) * 60_000) : toDate(c.start_ts));
                    const willDelete = c?.priority === priority;
                    return (
                      <Box
                        key={i}
                        fontSize="sm"
                        opacity={0.95}
                        wordBreak="break-word"
                        whiteSpace="normal"
                        fontWeight={willDelete ? 700 : 500}
                      >
                        • {c?.type ?? "Schedule"} — {s.toLocaleString()} → {e.toLocaleString()}
                        {c?.priority ? `  [${c.priority}]` : ""} {willDelete ? "— will replace" : ""}
                      </Box>
                    );
                  })}
                  {conflicts.length > 5 && (
                    <Text fontSize="xs" opacity={0.6}>+ {conflicts.length - 5} more…</Text>
                  )}
                </VStack>
              </VStack>
            </ModalBody>

            {/* one-line, smaller buttons */}
            <ModalFooter p="0" mt="12px">
              <HStack spacing="8px" w="100%" justify="flex-end" wrap="nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  h="28px"
                  px="10px"
                  onClick={() => setConflictOpen(false)}
                >
                  Cancel
                </Button>

                {/* Only one action now: delete same-priority overlaps and add */}
                <Button
                  size="sm"
                  h="28px"
                  px="10px"
                  colorScheme="red"
                  onClick={handleReplaceSamePriority}
                >
                  Delete Previous & Add
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Portal>

    </Modal>
  );
}
