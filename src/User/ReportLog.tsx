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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  Tooltip,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon, CalendarIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { authFetch } from "../hooks/useAuth";

type ReportLog = {
  id: number;
  report_name: string;
  run_date: string;
  sent_at: string;
  status: string;
  error?: string | null;
};

function formatIST(iso: string) {
  try {
    const dt = new Date(iso);
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Calcutta",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dt);
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Calcutta",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(dt);
    return `${date.replace(/\//g, "-")}, ${time}`;
  } catch {
    return iso;
  }
}

export default function ReportLog() {
  const [logs, setLogs] = useState<ReportLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
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

      params.append("page", String(page));
      params.append("limit", String(limit));

      if (q) params.append("search", q);

      if (from && to) {
        params.append("startTs", `${from} 00:00:00`);
        params.append("endTs", `${to} 23:59:59`);
      }

      const res = await authFetch(
        `/api/report-delivery-logs?${params.toString()}`
      );

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      setLogs(Array.isArray(data?.logs) ? data.logs : []);

      const totalCount = data?.pagination?.total || 0;

      setTotal(totalCount);
      setTotalPages(Math.ceil(totalCount / limit));

    } catch (e) {
      console.error("Report log fetch error", e);
      setLogs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, limit]);

  useEffect(() => {
    if (from && to) load();
  }, [from, to]);

  function clearFilters() {
    setQ("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Report Log
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
              placeholder="Search (user / message / details)"
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
                <Th minW="140px" color={textCol}>STATUS</Th>
                <Th minW="140px" color={textCol}>REPORT NAME</Th>
                <Th minW="200px" color={textCol}>ERROR</Th>
              </Tr>
            </Thead>
            <Tbody>
              {logs.map((row) => (
                <Tr key={row.id} borderColor={borderCol}>
                  <Td fontFamily="mono" color={textCol}>
                    {formatIST(row.sent_at)}
                  </Td>

                  <Td color={textCol}>
                    {row.status}
                  </Td>

                  <Td color={textCol}>
                    {row.report_name}
                  </Td>

                  <Td color={textCol}>
                    {row.error || "-"}
                  </Td>
                </Tr>
              ))}
              {logs.length === 0 && (
                <Tr>
                  <Td colSpan={4}>
                    <Box py={6} textAlign="center" color="gray.400">
                      No reports found for selected filters.
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
    </Box>
  );
}