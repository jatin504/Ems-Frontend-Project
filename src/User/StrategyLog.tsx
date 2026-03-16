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
  Spinner
} from "@chakra-ui/react";

import {
  SearchIcon,
  RepeatIcon,
  CalendarIcon,
  CloseIcon,
} from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

export default function StrategyLog() {

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const buildUrl = () => {

    let url = `${API_BASE}/api/strategy/logs?limit=200`;

    if (search) url += `&search=${search}`;

    if (startDate && endDate) {
      url += `&startTs=${startDate} 00:00:00&endTs=${endDate} 23:59:59`;
    }

    return url;
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(buildUrl());

      setLogs(res.data);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // first load
  useEffect(() => {
    fetchLogs();
  }, []);

  // auto refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, [search, startDate, endDate]);

  const clearFilter = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  const bgCard = useColorModeValue("white", "gray.800");
  const bgTable = useColorModeValue("gray.50", "#0f141a");
  const bgHeader = useColorModeValue("gray.100", "gray.700");
  const borderCol = useColorModeValue("gray.200", "whiteAlpha.300");
  const textCol = useColorModeValue("gray.800", "gray.100");

  return (
    <Box px={{ base: 3, md: 6 }} py={4} minH="85vh">

      <Heading size="md" mb={4}>
        Strategy Log
      </Heading>

      {/* FILTER UI */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 200px 200px auto" }} gap={3} mb={3}>

        <GridItem>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>

            <Input
              placeholder="Search strategy / decision text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderColor={borderCol}
            />
          </InputGroup>
        </GridItem>

        <GridItem>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <CalendarIcon />
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
              <CalendarIcon />
            </InputLeftElement>

            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              borderColor={borderCol}
            />
          </InputGroup>
        </GridItem>

        <GridItem>
          <HStack>

            <Tooltip label="Clear filter">
              <IconButton
                aria-label="clear"
                icon={<CloseIcon />}
                onClick={clearFilter}
              />
            </Tooltip>

            <Tooltip label="Refresh">
              <IconButton
                aria-label="refresh"
                icon={<RepeatIcon />}
                colorScheme="blue"
                onClick={fetchLogs}
              />
            </Tooltip>

            {loading && <Spinner size="sm" />}

          </HStack>
        </GridItem>

      </Grid>

      {/* TABLE */}
      <Box bg={bgCard} borderWidth="1px" borderColor={borderCol} borderRadius="xl">
        <Box overflowX="auto">

          <Table size="sm" bg={bgTable} color={textCol}>

            <Thead bg={bgHeader}>
              <Tr>
                <Th fontWeight="bold" textAlign="center">strategy id</Th>
                <Th fontWeight="bold" textAlign="center">started at</Th>
                <Th fontWeight="bold" textAlign="center">finished at</Th>
                <Th fontWeight="bold" textAlign="center">decision snapshot</Th>
              </Tr>
            </Thead>

            <Tbody>

              {logs.length === 0 && (
                <Tr>
                  <Td colSpan={4}>
                    <Box py={10} textAlign="center" color="gray.400">
                      No strategy logs
                    </Box>
                  </Td>
                </Tr>
              )}

              {logs.map((log: any, i: number) => (
                <Tr key={i}>

                  <Td>
                    <Box textAlign="center" w="100%">
                      {log.strategy_id}
                    </Box>
                  </Td>

                  <Td>
                    <Box textAlign="center" w="100%">
                      {log.started_at
                        ? new Date(log.started_at).toLocaleString()
                        : "-"}
                    </Box>
                  </Td>

                  <Td>
                    <Box textAlign="center" w="100%">
                      {log.finished_at
                        ? new Date(log.finished_at).toLocaleString()
                        : "-"}
                    </Box>
                  </Td>

                  <Td>
                    <Box textAlign="center" w="100%">
                      {log.decision_snapshot || "-"}
                    </Box>
                  </Td>

                </Tr>
              ))}

            </Tbody>

          </Table>

        </Box>
      </Box>

    </Box>
  );
}