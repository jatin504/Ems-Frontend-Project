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
  Spinner,
} from "@chakra-ui/react";

import {
  SearchIcon,
  RepeatIcon,
  CalendarIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import { useEffect, useState } from "react";

export default function DashboardLog() {
  const bgCard = useColorModeValue("white", "gray.800");
  const bgTable = useColorModeValue("gray.50", "#0f141a");
  const bgHeader = useColorModeValue("gray.100", "gray.700");
  const borderCol = useColorModeValue("gray.200", "whiteAlpha.300");
  const textCol = useColorModeValue("gray.800", "gray.100");

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("limit", String(limit * page));

      if (search) params.append("search", search);

      if (startDate && endDate) {
        params.append("startTs", `${startDate} 00:00:00`);
        params.append("endTs", `${endDate} 23:59:59`);
      }

      const res = await fetch(
        `http://75.119.146.115:5179/api/dashboard/logs?${params.toString()}`
      );

      const data = await res.json();

      setLogs(data);
    } catch (err) {
      console.error("Log fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [limit, page]);

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    fetchLogs();
  };

  const currentRows = logs.slice((page - 1) * limit, page * limit);

  return (
    <Box px={{ base: 3, md: 6 }} py={4} minH="85vh" w="100%">
      <Heading size="md" mb={4}>
        Control Log
      </Heading>

      {/* Filters */}
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
              placeholder="Search user / action / module"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderColor={borderCol}
              onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              borderColor={borderCol}
            />
          </InputGroup>
        </GridItem>

        <GridItem justifySelf={{ base: "stretch", md: "end" }}>
          <HStack spacing={2}>
            <Tooltip label="Clear filters">
              <IconButton
                aria-label="Clear"
                icon={<CloseIcon boxSize={3} />}
                variant="outline"
                onClick={clearFilters}
              />
            </Tooltip>

            <Tooltip label="Refresh">
              <IconButton
                aria-label="Refresh"
                icon={<RepeatIcon />}
                colorScheme="blue"
                onClick={() => {
                  setPage(1);
                  fetchLogs();
                }}
                isLoading={loading}
              />
            </Tooltip>
          </HStack>
        </GridItem>
      </Grid>

      {/* Table */}
      <Box
        bg={bgCard}
        borderWidth="1px"
        borderColor={borderCol}
        borderRadius="xl"
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table size="sm" bg={bgTable} color={textCol}>
            <Thead bg={bgHeader}>
              <Tr>
                <Th>EVENT TIME</Th>
                <Th>ACTION</Th>
                <Th>CONTROL</Th>
                <Th>MODULE</Th>
                <Th>USER</Th>
                <Th>STATUS</Th>
              </Tr>
            </Thead>

            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10}>
                    <Spinner />
                  </Td>
                </Tr>
              ) : currentRows.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10} color="gray.400">
                    No dashboard logs.
                  </Td>
                </Tr>
              ) : (
                currentRows.map((log, i) => (
                  <Tr key={i}>
                    <Td>{new Date(log.event_time).toLocaleString()}</Td>
                    <Td>{log.action}</Td>
                    <Td>{log.control_type}</Td>
                    <Td>{log.module}</Td>
                    <Td>{log.username}</Td>
                    <Td
                      color={
                        log.status === "SUCCESS"
                          ? "green.400"
                          : log.status === "FAILED"
                          ? "red.400"
                          : "yellow.400"
                      }
                      fontWeight="bold"
                    >
                      {log.status}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Pagination */}
      <Box mt={4}>
        <HStack justify="space-between">
          <HStack>
            <Text fontSize="sm">Rows per page:</Text>
            <Select
              size="sm"
              w="100px"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Select>
          </HStack>

          <HStack>
            <IconButton
              aria-label="Prev"
              icon={<ChevronLeftIcon />}
              size="sm"
              isDisabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            />

            <Text fontSize="sm">Page {page}</Text>

            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              size="sm"
              isDisabled={logs.length < limit * page}
              onClick={() => setPage((p) => p + 1)}
            />
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
}