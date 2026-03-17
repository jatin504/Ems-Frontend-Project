// src/pages/UserLogDashboard.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  HStack,
  VStack,
  Tooltip,
  useColorModeValue,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import DashboardLog from "./DashboardLog"; // render dashboard log content
import StrategyLog from "./StrategyLog"; // new strategy log tab component
import { SearchIcon, RepeatIcon, CalendarIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { authFetch } from "../hooks/useAuth";

type AuditLog = {
  id: string;
  ts: string;       // ISO timestamp
  message: string;  // "LogOn" | "LogOff" | others
  user?: string;
  rights?: string;
  ip?: string;
};

// dd-mm-yyyy, h:mm:ss am/pm (Asia/Calcutta)
function formatIST(iso: string) {
  try {
    const dt = new Date(iso);
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Calcutta",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dt); // dd/mm/yyyy
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Calcutta",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(dt); // h:mm:ss am/pm
    return `${date.replace(/\//g, "-")}, ${time}`;
  } catch {
    return iso;
  }
}

export default function UserLogDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const bgCard = useColorModeValue("white", "gray.800");
  const bgTable = useColorModeValue("gray.50", "#0f141a");
  const bgHeader = useColorModeValue("gray.100", "gray.700");
  const borderCol = useColorModeValue("gray.200", "whiteAlpha.300");
  const textCol = useColorModeValue("gray.800", "gray.100");

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (from) params.set("from", from);
if (to) params.set("to", to);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await authFetch(`/api/audit/logs?${params.toString()}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      
      setLogs(Array.isArray(data?.logs) ? data.logs : []);
      if (data?.pagination) {
        setTotal(data.pagination.total || 0);
        setTotalPages(data.pagination.total_pages || 0);
      }
    } catch {
      // Demo rows so UI dekhe turant
      setLogs([
        {
          id: "1",
          ts: "2025-05-28T12:39:12Z",
          message: "LOGOFF",
          user: "Operator",
          rights: "Default Rights",
          ip: "10.0.0.14",
        },
        {
          id: "2",
          ts: "2025-05-28T12:39:12Z",
          message: "LOGOFF",
          user: "Operator",
          rights: "Default Rights",
          ip: "10.0.0.14",
        },
        {
          id: "3",
          ts: "2025-04-01T04:28:46Z",
          message: "LOGOFF",
          user: "Admin",
          rights: "Default Rights",
          ip: "-",
        },
        {
          id: "4",
          ts: "2025-03-12T14:45:17Z",
          message: "LOGOFF",
          user: "Viewer",
          rights: "Default Rights",
          ip: "-",
        },
      ]);
      setTotal(4);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  load();
}, [page, limit, from, to]);

  function clearFilters() {
    setQ("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <Box px={{ base: 3, md: 6 }} py={4} minH={"85vh"} w="100%">
      <Tabs defaultIndex={0} variant="soft-rounded" colorScheme="blue">
        <TabList mb={4}>
          <Tab>User Log</Tab>
          <Tab>Control Log</Tab>
          <Tab>Strategy Log</Tab>
        </TabList>

        <TabPanels>

          {/* USER LOG TAB */}
          <TabPanel p={0}>
            <Heading size="md" mb={4}>
              User Log
            </Heading>

            {/* Controls Row */}
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 220px 220px auto" }}
              gap={3}
              mb={3}
              alignItems="center"
            >
              <GridItem>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon opacity={0.7} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search (user / message / IP)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && load()}
                    borderColor={borderCol}
                  />
                </InputGroup>
              </GridItem>

              <GridItem>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CalendarIcon opacity={0.7} />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="dd-mm-yyyy"
                    borderColor={borderCol}
                  />
                </InputGroup>
              </GridItem>

              <GridItem>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CalendarIcon opacity={0.7} />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="dd-mm-yyyy"
                    borderColor={borderCol}
                  />
                </InputGroup>
              </GridItem>

              <GridItem justifySelf={{ base: "stretch", md: "end" }}>
                <HStack spacing={2} justify="flex-end">
                  <Tooltip label="Clear filters">
                    <IconButton
                      aria-label="Clear"
                      icon={<CloseIcon boxSize={3} />}
                      onClick={clearFilters}
                      variant="outline"
                    />
                  </Tooltip>
                  <Tooltip label="Refresh">
                    <IconButton
                      aria-label="Refresh"
                      icon={<RepeatIcon />}
                      onClick={load}
                      isLoading={loading}
                      colorScheme="blue"
                    />
                  </Tooltip>
                </HStack>
              </GridItem>
            </Grid>

            {/* Table Card */}
            <Box
              bg={bgCard}
              borderWidth="1px"
              borderColor={borderCol}
              borderRadius="xl"
              overflow="hidden"
            >
              <Box
                overflowX="auto"
                sx={{
                  "tbody tr:hover td": {
                    bg: useColorModeValue("gray.100", "whiteAlpha.100"),
                  },
                }}
              >
                <Table size="sm" variant="simple" bg={bgTable} color={textCol}>
                  <Thead
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      bg: bgHeader,
                    }}
                  >
                    <Tr>
                      <Th minW="240px" color={textCol}>EVENT TIME</Th>
                      <Th minW="140px" color={textCol}>MESSAGE</Th>
                      <Th minW="160px" color={textCol}>USER</Th>
                      {/* RIGHTS column removed */}
                      <Th minW="140px" color={textCol}>IP</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {logs.map((row) => {
                      const msgUpper = String(row.message).toUpperCase();
                      const isOff = msgUpper === "LOGOFF";
                      const isOn = msgUpper === "LOGON";
                      const isFailed = msgUpper.includes("FAILED");
                      return (
                        <Tr key={row.id} borderColor={borderCol}>
                          <Td fontFamily="mono" color={textCol}>{formatIST(row.ts)}</Td>
                          <Td>
                            {isOff ? (
                              <Badge colorScheme={useColorModeValue("red", "red")} variant="solid">
                                LOGOFF
                              </Badge>
                            ) : isOn ? (
                              <Badge colorScheme={useColorModeValue("green", "green")} variant="solid">
                                LOGON
                              </Badge>
                            ) : isFailed ? (
                              <Badge colorScheme={useColorModeValue("orange", "orange")} variant="solid">
                                {row.message}
                              </Badge>
                            ) : (
                              <Text color={textCol}>{row.message}</Text>
                            )}
                          </Td>
                          <Td color={textCol}>{row.user || "-"}</Td>
                          {/* RIGHTS column removed */}
                          <Td color={textCol}>{row.ip || "-"}</Td>
                        </Tr>
                      );
                    })}
                    {logs.length === 0 && (
                      <Tr>
                        <Td colSpan={5}>
                          <Box py={6} textAlign="center" color="gray.400">
                            No logs found for selected filters.
                          </Box>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </Box>

            {/* Pagination Controls */}
            <Box mt={4}>
              <HStack spacing={4} justify="space-between" align="center">
                <HStack spacing={2}>
                  <Text fontSize="sm" color={textCol}>
                    Rows per page:
                  </Text>
                  <Select
                    w="100px"
                    size="sm"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    bg={bgCard}
                    borderColor={borderCol}
                    color={textCol}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Select>
                </HStack>

                <HStack spacing={2}>
                  <Text fontSize="sm" color={textCol}>
                    Page {page} of {totalPages || 1} ({total} total)
                  </Text>
                  <Tooltip label="Previous page">
                    <IconButton
                      aria-label="Previous"
                      icon={<ChevronLeftIcon />}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      isDisabled={page === 1 || loading}
                      size="sm"
                    />
                  </Tooltip>
                  <Tooltip label="Next page">
                    <IconButton
                      aria-label="Next"
                      icon={<ChevronRightIcon />}
                      onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                      isDisabled={page >= totalPages || loading}
                      size="sm"
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            </Box>
          </TabPanel>

          {/* DASHBOARD LOG TAB */}
          <TabPanel p={0}>
            {/* render DashboardLog component so tab content isn't blank */}
            <DashboardLog />
          </TabPanel>

          {/* STRATEGY LOG TAB */}
          <TabPanel p={0}>
            <StrategyLog />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
