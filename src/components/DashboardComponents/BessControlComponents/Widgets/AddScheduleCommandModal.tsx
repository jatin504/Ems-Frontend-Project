import React from "react";
import {
  Box, VStack, HStack, Text, Button, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  InputGroup, Input, InputLeftAddon, InputRightAddon, InputRightElement, Textarea,
  useToast, Alert, AlertIcon, AlertTitle, AlertDescription, Portal,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { FiCalendar, FiUpload, FiEye } from "react-icons/fi";
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
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      h="34px"
      px="14px"
      borderRadius="16px"
      bg={isActive ? "#D9F8F6" : "#EEF2F4"}
      color="#111827"
      border="1px solid"
      borderColor={isActive ? "#55CFC9" : "#E1E6EA"}
      fontSize="12px"
      fontWeight="700"
      _hover={{
        bg: isActive ? "#D9F8F6" : "#EEF2F4",
      }}
      _active={{
        bg: isActive ? "#D9F8F6" : "#EEF2F4",
      }}
    >
      <HStack spacing="6px">
        {isActive && <CheckIcon boxSize="11px" />}
        <Text fontSize="12px">{children}</Text>
      </HStack>
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
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    setForm((f) => ({ ...f, command: cmd }));
  }, [cmd]);

  const softBg      = useColorModeValue("#F3F4F6", "#1C2121");
  const fieldBorder = useColorModeValue("#E5E7EB", "#30383A");
  const labelCol    = useColorModeValue("#475569", "#A6B0B0");
  const modalBg     = useColorModeValue("#FFFFFF", "#161B1B");
  const modalBorder = useColorModeValue("#E5E7EB", "#2A3030");
  const headerText  = useColorModeValue("#0F172A", "#E5E7EB");
  const headerBg    = useColorModeValue("#F8FBFB", "#1A2121");

  const hideDurationTariff = norm === "basic" || norm === "peak";
  const hidePower          = norm === "smart" || norm === "flat";

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
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeAndReset = () => { resetAll(); onClose(); };

  const handleViewSample = () => {
    const link = document.createElement("a");

    link.href = "/sample.xlsx";
    link.download = "BESS_Schedule_Sample.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

    // ==============================
    // EXCEL / CSV BULK UPLOAD
    // ==============================
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/strategy/bulk`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Bulk upload failed");
        }

        toast({
          title: "Commands added successfully",
          description: `${result.inserted_count || 0} commands inserted.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        if (onAdded) {
          await onAdded();
        }

        closeAndReset();
        return;

      } catch (e: any) {
        toast({
          title: "Excel upload failed",
          description: e?.message || "Unable to add schedules from Excel.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-left",
        });

        return;
      }
    }

    // ==============================
    // EXISTING MANUAL FLOW
    // ==============================

    const errors: string[] = [];

    if (!form.from) {
      errors.push("Start time is required.");
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
    // Load input disabled by requirement.
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
        maxW={["86vw", "520px"]}
        maxH="58vh"
        w="full"
        bg={modalBg}
        border="1px solid"
        borderColor={modalBorder}
        borderRadius="16px"
        p="0"
        overflow="hidden"
        boxShadow="0 18px 48px rgba(15, 23, 42, 0.18)"
      >
        <ModalHeader
          p="14px 16px 10px"
          bg={headerBg}
          borderBottom="1px solid"
          borderColor={fieldBorder}
          color={headerText}
          fontSize="md"
          fontWeight={700}
        >
          <HStack justify="space-between" align="center" spacing="8px">
            <VStack align="start" spacing="1px">
              <Text
                fontSize="18px"
                fontWeight="800"
                color="#0F172A"
              >
                Add New Schedule Command
              </Text>

              
            </VStack>
            <HStack spacing="6px">
              <Button
                leftIcon={<FiEye />}
                size="xs"
                height="32px"
                minH="32px"
                px="10px"
                borderRadius="8px"
                fontSize="11px"
                fontWeight="700"
                variant="outline"
                borderColor="#55CFC9"
                color="#168C88"
                bg="#F0FFFD"
                _hover={{ bg: "#D9F8F6" }}
                onClick={handleViewSample}
              >
                View Sample
              </Button>

              <Button
                leftIcon={<FiUpload />}
                size="xs"
                height="32px"
                minH="32px"
                px="10px"
                borderRadius="8px"
                fontSize="11px"
                fontWeight="700"
                variant="outline"
                borderColor={fieldBorder}
                color={headerText}
                _hover={{ bg: useColorModeValue("#F1F5F9", "#1F2828") }}
                onClick={() => fileInputRef.current?.click()}
              >
                Excel Upload
              </Button>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton size="sm" color={headerText} _focus={{ boxShadow: "none" }} />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;

            setSelectedFile(file);

            if (file) {
              toast({
                title: "File selected",
                description: file.name,
                status: "info",
                duration: 2000,
                isClosable: true,
                position: "top-left",
              });
            }
          }}
        />

        <ModalBody
          px="12px"
          py="0"
          overflowY="auto"
        >
          <Box w="full" mx="auto">
            <VStack align="stretch" spacing="8px" w="full">
              {/* Command type */}
              <Box
                bg="#F7FBFC"
                border="1px solid #E5EDF0"
                borderRadius="10px"
                p="8px 10px"
              >
                <VStack align="stretch" spacing="6px">
                  <VStack align="start" spacing="1px">
                    <Text
                      fontSize="13px"
                      fontWeight="800"
                      color="#0F172A"
                    >
                      Command Type
                    </Text>

                    <Text
                      fontSize="10px"
                      color="#64748B"
                    >
                      Select the operation command for this schedule
                    </Text>
                  </VStack>

                  <HStack spacing="8px" flexWrap="wrap">
                    {(["Charge","Discharge","Idle","Grid Support"] as const).map((t) => (
                      <SegButton key={t} isActive={cmd === t} onClick={() => setCmd(t)}>{t}</SegButton>
                    ))}
                  </HStack>
                </VStack>
              </Box>

              {/* Time Window */}
              <Box
                bg="#F7FBFC"
                border="1px solid #E5EDF0"
                borderRadius="10px"
                p="8px 10px"
              >
                <VStack align="stretch" spacing="6px">

                  <VStack align="start" spacing="1px">
                    <Text
                      fontSize="13px"
                      fontWeight="800"
                      color="#0F172A"
                    >
                      Time Window
                    </Text>

                    <Text
                      fontSize="10px"
                      color="#64748B"
                    >
                      Select start and end date & time for this schedule
                    </Text>
                  </VStack>

                  <HStack spacing="8px" w="full">
                    <VStack align="stretch" spacing="4px" flex="1">
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        color="#334155"
                      >
                        Start Date & Time
                      </Text>

                      <InputGroup size="sm" flex="1" maxW="180px">
                        <Input
                          type="datetime-local"
                          placeholder="From"
                          min={minDt}
                          bg="#FFFFFF"
                          borderColor="#D8E1E6"
                          borderRadius="8px"
                          h="36px"
                          fontSize="11px"
                          value={form.from}
                          onChange={(e) => setForm({ ...form, from: e.target.value })}
                          sx={{
                            "&::-webkit-calendar-picker-indicator": {
                              width: "12px",
                              height: "12px",
                              cursor: "pointer",
                              opacity: 0.8,
                            },
                          }}
                        />
                        <InputRightElement pointerEvents="none"><FiCalendar /></InputRightElement>
                      </InputGroup>
                    </VStack>

                    <VStack align="stretch" spacing="4px" flex="1">
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        color="#334155"
                      >
                        End Date & Time
                      </Text>

                      <InputGroup size="sm" flex="1" maxW="180px">
                        <Input
                          type="datetime-local"
                          placeholder="To"
                          min={minDt}
                          bg="#FFFFFF"
                          borderColor="#D8E1E6"
                          borderRadius="8px"
                          h="36px"
                          fontSize="11px"
                          value={form.to}
                          onChange={(e) => setForm({ ...form, to: e.target.value })}
                          sx={{
                            "&::-webkit-calendar-picker-indicator": {
                              width: "12px",
                              height: "12px",
                              cursor: "pointer",
                              opacity: 0.8,
                            },
                          }}
                        />
                        <InputRightElement pointerEvents="none"><FiCalendar /></InputRightElement>
                      </InputGroup>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>

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

              {/* Power + Priority */}
              <HStack
                spacing="8px"
                align="stretch"
                w="full"
              >
                {!hidePower && (
                  <Box
                    flex="1"
                    bg="#F7FBFC"
                    border="1px solid #E5EDF0"
                    borderRadius="10px"
                    p="8px 10px"
                  >
                    <VStack align="stretch" spacing="6px">
                      <VStack align="start" spacing="1px">
                        <Text
                          fontSize="13px"
                          fontWeight="800"
                          color="#0F172A"
                        >
                          Power (kW)
                        </Text>
                        <Text
                          fontSize="10px"
                          color="#64748B"
                        >
                          Set the required discharge/charge power
                        </Text>
                      </VStack>

                      <InputGroup size="sm">
                        <Input
                          type="text"
                          placeholder="100"
                          bg="#FFFFFF"
                          borderColor="#D8E1E6"
                          borderRadius="8px"
                          h="34px"
                          fontSize="11px"
                          value={form.power}
                          onChange={(e) => setForm({ ...form, power: e.target.value })}
                        />
                        <InputRightAddon borderColor={fieldBorder}>kW</InputRightAddon>
                      </InputGroup>
                    </VStack>
                  </Box>
                )}

                <Box
                  flex="1"
                  bg="#F7FBFC"
                  border="1px solid #E5EDF0"
                  borderRadius="10px"
                  p="8px 10px"
                >
                  <VStack align="stretch" spacing="6px">
                    <VStack align="start" spacing="1px">
                      <Text
                        fontSize="13px"
                        fontWeight="800"
                        color="#0F172A"
                      >
                        Priority
                      </Text>
                      <Text
                        fontSize="10px"
                        color="#64748B"
                      >
                        Select the schedule priority level
                      </Text>
                    </VStack>

                    <HStack spacing="8px" w="full">
                      {(["low","medium","high"] as const).map((p) => (
                        <SegButton key={p} isActive={priority === p} onClick={() => setPriority(p)}>
                          {p[0].toUpperCase() + p.slice(1)}
                        </SegButton>
                      ))}
                    </HStack>
                  </VStack>
                </Box>
              </HStack>

              {/* Load */}
              {/*
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
              */}

              {/* SoC section */}
              <Box
                bg="#F7FBFC"
                border="1px solid #E5EDF0"
                borderRadius="10px"
                p="8px 10px"
              >
                <VStack align="stretch" spacing="6px">
                  <VStack align="start" spacing="1px">
                    <Text
                      fontSize="13px"
                      fontWeight="800"
                      color="#0F172A"
                    >
                      SoC Threshold (%)
                    </Text>

                    <Text
                      fontSize="10px"
                      color="#64748B"
                    >
                      Set minimum and maximum state of charge
                    </Text>
                  </VStack>

                  {!form.to && (
                    <HStack spacing="8px" align="stretch" w="full">
                      <InputGroup size="sm" flex="1">
                        <Input
                          placeholder="Min"
                          bg="#FFFFFF"
                          borderColor="#D8E1E6"
                          borderRadius="8px"
                          h="34px"
                          fontSize="11px"
                          value={form.socMin}
                          onChange={(e) => setForm({ ...form, socMin: e.target.value })}
                        />
                      </InputGroup>

                      <InputGroup size="sm" flex="1">
                        <Input
                          placeholder="Max"
                          bg="#FFFFFF"
                          borderColor="#D8E1E6"
                          borderRadius="8px"
                          h="34px"
                          fontSize="11px"
                          value={form.socMax}
                          onChange={(e) => setForm({ ...form, socMax: e.target.value })}
                        />
                      </InputGroup>
                    </HStack>
                  )}
                </VStack>
              </Box>

              {/* Remarks */}
              <Box
                bg="#F7FBFC"
                border="1px solid #E5EDF0"
                borderRadius="10px"
                p="8px 10px"
              >
                <VStack align="stretch" spacing="6px">

                  <VStack align="start" spacing="1px">
                    <Text
                      fontSize="13px"
                      fontWeight="800"
                      color="#0F172A"
                    >
                      Remarks
                    </Text>

                    <Text
                      fontSize="10px"
                      color="#64748B"
                    >
                      Add any additional notes for this schedule
                    </Text>
                  </VStack>

                  <Textarea
                    h="68px"
                    resize="none"
                    bg="#FFFFFF"
                    borderColor="#D8E1E6"
                    borderRadius="8px"
                    fontSize="11px"
                    p="8px 10px"
                    placeholder="Add a note for this schedule..."
                    value={form.remarks}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        remarks: e.target.value,
                      })
                    }
                    _focus={{
                      borderColor: "#2CA7A2",
                      boxShadow: "0 0 0 1px #2CA7A2",
                    }}
                  />

                </VStack>
              </Box>
            </VStack>
          </Box>
        </ModalBody>

        <ModalFooter
          px="14px"
          py="10px"
          borderTop="1px solid #E5EDF0"
        >
          <HStack spacing="8px">
            <Button
              size="sm"
              h="34px"
              px="12px"
              variant="outline"
              borderColor="#D8E1E6"
              borderRadius="8px"
              fontSize="11px"
              fontWeight="700"
              onClick={closeAndReset}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              h="34px"
              px="14px"
              bg="#27AAA5"
              color="white"
              borderRadius="8px"
              fontSize="11px"
              fontWeight="700"
              _hover={{
                bg: "#229893",
              }}
              onClick={validateAndSubmit}
            >
              Add Command
            </Button>
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
            bg={modalBg}
            border="1px solid"
            borderColor={modalBorder}
            borderRadius="16px"
            p="0"
            overflow="hidden"
            boxShadow="0 16px 40px rgba(15, 23, 42, 0.18)"
          >
            <ModalHeader
              p="12px 16px 10px"
              bg={headerBg}
              borderBottom="1px solid"
              borderColor={fieldBorder}
              color={headerText}
              fontSize="sm"
              fontWeight={700}
            >
              Overlapping Schedule Found
            </ModalHeader>
            <ModalCloseButton size="sm" color={headerText} _focus={{ boxShadow: "none" }} />

            <ModalBody p="14px 16px 8px" overflowY="auto">
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
            <ModalFooter p="8px 16px 14px" mt="8px">
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
