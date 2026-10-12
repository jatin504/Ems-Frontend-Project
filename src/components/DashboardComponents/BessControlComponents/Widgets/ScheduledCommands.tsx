import React from "react";
import {
  Box, VStack, HStack, Text, Button, Select,
  useColorModeValue, useDisclosure, Icon, Input,
} from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; //  UPDATED: for navigation
import AddScheduleCommandModal from "./AddScheduleCommandModal";
import { useFetchSchedules } from "../../../../hooks/energy_strategy/useFetchSchedules";
import { useCurrentStrategy } from "../../../../hooks/current_strategy/useCurrentStrategy";

type Status = "Scheduled" | "Waiting" | "Skipped" | "Executing";
const statusDot: Record<Status, "green" | "red" | "gray"> = {
  Scheduled: "green", Waiting: "gray", Skipped: "red", Executing: "green",
};

const monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ordinal = (n: number) => { const j=n%10,k=n%100; if(j===1&&k!==11)return"st"; if(j===2&&k!==12)return"nd"; if(j===3&&k!==13)return"rd"; return"th"; };
const formatTime = (ts: number | string) => new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const formatDate = (ts: number | string) => { const d=new Date(ts); const day=d.getDate(); return `${day}${ordinal(day)} ${monthShort[d.getMonth()]} ${d.getFullYear()}`; };

// overlap helpers
const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
  aStart < bEnd && bStart < aEnd;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay   = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

// list item
const Item = ({ title, start, duration, dot="green" }: {title:string;start:string;duration:string;dot?: "green"|"red"|"gray"}) => {
  const itemBg = useColorModeValue("white", "#1C2121");
  const itemTitle = useColorModeValue("gray.800", "#E8ECEC");
  const itemLabel = useColorModeValue("gray.600", "#A6B0B0");
  const itemValue = useColorModeValue("gray.800", "#E8ECEC");
  const dotColorMap = { green: "green.400", red: "red.400", gray: "gray.400" } as const;
  return (
    <VStack align="stretch" spacing={1} p={3} bg={itemBg} borderRadius="md">
      <HStack justify="space-between">
        <Text fontSize="sm" color={itemTitle} fontWeight={700} fontFamily="Poppins, sans-serif">{title}</Text>
        <Box as="span" w="8px" h="8px" borderRadius="full" bg={dotColorMap[dot]} />
      </HStack>
      <HStack justify="space-between" fontSize="xs" color={itemLabel}>
        <Text>Start Time</Text><Text>Duration</Text>
      </HStack>
      <HStack justify="space-between" fontSize="xs" color={itemValue}>
        <Text>{start}</Text><Text>{duration}</Text>
      </HStack>
    </VStack>
  );
};

// normalize
function normalizeStrategy(val: unknown): "basic"|"smart"|"flat"|"peak"|"disable" {
  const s = String(val ?? "").trim().toLowerCase();
  if (s === "0" || s.includes("basic")) return "basic";
  if (s === "3" || s.includes("smart")) return "smart";
  if (s === "4" || s.includes("flat")) return "flat";
  if (s === "5" || s.includes("peak")) return "peak";
  if (s === "200" || s.includes("disable")) return "disable";
  return "basic";
}

export default function ScheduledCommands() {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "#202525");
  const headerText = useColorModeValue("#111827", "#E5E7EB");
  const chipBg = useColorModeValue("#1118270d", "#232829");
  const chipText = useColorModeValue("#0F172A", "#E8ECEC");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const fetchSchedules = useFetchSchedules();
  const navigate = useNavigate(); //  UPDATED

  // initial from hook
  const { strategy, strategyName } = (useCurrentStrategy() as any) ?? {};
  const initialNorm = normalizeStrategy(strategyName ?? strategy ?? "basic");
  const [normStrategy, setNormStrategy] = React.useState<"basic"|"smart"|"flat"|"peak"|"disable">(initialNorm);
  
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const next = normalizeStrategy(detail.name ?? detail.code);
      setNormStrategy(next);
    };
    window.addEventListener("ems:strategy-changed", handler as EventListener);
    return () => window.removeEventListener("ems:strategy-changed", handler as EventListener);
  }, []);
  React.useEffect(() => {
    setNormStrategy(normalizeStrategy(strategyName ?? strategy ?? normStrategy));
  }, [strategy, strategyName]);

  // filter + date
  const [filter, setFilter] = React.useState<"today" | "all">("today");
  const [pickedDate, setPickedDate] = React.useState<Date | null>(null);

  // always fetch all; client-side filter
  const [rawRows, setRawRows] = React.useState<any[]>([]);
  const [scheduleList, setScheduleList] = React.useState<{ title: string; start: string; duration: string; status: Status }[]>([]);

  // date input overlayed on the calendar button (not off-screen)
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // fetchSchedules may be recreated by the hook; keep a ref to call the latest impl
  const fetchSchedulesRef = React.useRef(fetchSchedules);
  React.useEffect(() => { fetchSchedulesRef.current = fetchSchedules; }, [fetchSchedules]);
  
  const refresh = React.useCallback(async () => {
    try {
      const data = await fetchSchedulesRef.current("all");

      console.log("[ScheduledCommands] list response:", data);
      console.log("[ScheduledCommands] type:", typeof data);
      console.log("[ScheduledCommands] isArray:", Array.isArray(data));

      if (Array.isArray(data)) {
        setRawRows(data);
      } else {
        console.error(
          "[ScheduledCommands] Expected array but received:",
          data
        );
        setRawRows([]);
      }
    } catch (error) {
      console.error("[ScheduledCommands] refresh failed:", error);
      setRawRows([]);
    }
  }, []);

  // load once on mount
  React.useEffect(() => { refresh(); }, []);

  // compute visible list
  React.useEffect(() => {
    const rows = rawRows;
    let filtered = rows;

    let dayStart: Date | null = null;
    let dayEnd: Date | null = null;

    if (pickedDate) {
      dayStart = startOfDay(pickedDate);
      dayEnd = endOfDay(pickedDate);
    } else if (filter === "today") {
      const today = new Date();
      dayStart = startOfDay(today);
      dayEnd = endOfDay(today);
    }

    if (dayStart && dayEnd) {
      filtered = rows.filter((item: any) => {
        const s = new Date(item.start_ts);
        const e = item.end_ts
          ? new Date(item.end_ts)
          : (item.duration ? new Date(new Date(item.start_ts).getTime() + Number(item.duration) * 60_000) : new Date(item.start_ts));
        return overlaps(dayStart!, dayEnd!, s, e);
      });
    }

    const mapped = filtered.map((item: any) => {
      const startTs = item.start_ts;
      const endTs = item.end_ts ?? (item.duration ? new Date(new Date(startTs).getTime() + Number(item.duration) * 60_000).toISOString() : startTs);
      const startTime = formatTime(startTs);
      const range = `${formatDate(startTs)} - ${formatDate(endTs)}`;
      return { title: item.type, start: startTime, duration: range, status: "Scheduled" as Status };
    });

    setScheduleList(mapped);
  }, [rawRows, filter, pickedDate]);

  const emptyMsg =
    pickedDate
      ? `No schedules found for ${pickedDate.toLocaleDateString()}.`
      : filter === "today"
        ? "No schedules found for today."
        : "No schedules found.";

  return (
    <>
      <Box bg={cardBg} border="1px solid" borderColor={cardBorder} borderRadius="12px" w="302px" h="578px" p={0} opacity={1} overflow="hidden">
        <VStack align="stretch" spacing={0} h="full">
          <Box w="302px" h="96px" p="16px" borderBottomWidth="1px" borderColor={cardBorder}>
            <VStack align="stretch" spacing="8px" h="full" justify="flex-start">
              <Text w="300px" h="24px" color={headerText} fontFamily="'Poppins', sans-serif" fontWeight={700} fontSize="16px" lineHeight="1" noOfLines={1}>
                Scheduled Commands
              </Text>
              <HStack w="100%" h="32px" align="center">
                <HStack w="300px" h="32px" spacing="8px" align="center">
                  <Box w="96px" h="32px" bg={useColorModeValue("#F5F7F8", "#242929")} borderRadius="8px" px="10px" py="4px" display="flex" alignItems="center">
                    <Select
                      variant="unstyled"
                      value={filter}
                      onChange={(e) => { setFilter(e.target.value as "today" | "all"); setPickedDate(null); }}
                      color={chipText}
                      iconColor={chipText}
                      fontSize="sm"
                    >
                      <option value="today">Today</option>
                      <option value="all">All</option>
                    </Select>
                  </Box>

                  {/* Calendar button + overlaid invisible input (now non-interactive) */}
                  <Box position="relative" w="32px" h="32px">
                    <Button
                      h="32px" w="32px" minW="32px" p={0}
                      bg={useColorModeValue("#F5F7F8", chipBg)}
                      color={useColorModeValue(chipText, "white")}
                      borderRadius="8px"
                      _hover={{ bg: useColorModeValue("#EEF1F2", chipBg) }}
                      _active={{ bg: useColorModeValue("#E7EAEC", chipBg) }}
                      aria-label="Open calendar dashboard"
                      onClick={() => navigate("/calendar")} //  UPDATED: navigate to Calendar Dashboard
                      title="Open Calendar"
                    >
                      <Icon as={FiCalendar} boxSize="16px" />
                    </Button>

                    {/* Keep the input in DOM but disable interaction so click goes to button */}
                    <Input
                      type="date"
                      ref={dateInputRef}
                      position="absolute"
                      top={0}
                      left={0}
                      w="32px"
                      h="32px"
                      opacity={0}
                      pointerEvents="none"   //  UPDATED: don't intercept clicks
                      tabIndex={-1}
                      aria-hidden
                      onChange={(e) => {
                        const val = e.target.value; // yyyy-mm-dd
                        if (val) {
                          const [y, m, d] = val.split("-").map(Number);
                          setPickedDate(new Date(y, m - 1, d));
                          setFilter("today");
                        }
                      }}
                    />
                  </Box>
                </HStack>

                <Button
                  ml="auto" w="53px" minW="53px" h="31px" px="12px" py="5px"
                  bg="#33D2D2" color={useColorModeValue("white", "#0b1516")}
                  fontWeight={700} borderRadius="6px" _hover={{ bg: "#2ac4c4" }} onClick={onOpen}
                >
                  Add
                </Button>
              </HStack>
            </VStack>
          </Box>

          <Box w="332px" h="482px" p="16px">
            <VStack align="stretch" spacing="10px" h="full" overflowY="auto" pr="4px">
              {scheduleList.map((row, i) => (
                <Item key={i} title={row.title} start={row.start} duration={row.duration} dot={statusDot[row.status]} />
              ))}
              {scheduleList.length === 0 && (
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                  {emptyMsg}
                </Text>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>

      <AddScheduleCommandModal
        isOpen={isOpen}
        onClose={onClose}
        onAdded={refresh}
        currentStrategy={normStrategy}
      />
    </>
  );
}
