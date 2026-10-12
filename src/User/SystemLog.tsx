import { useState } from "react";

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
  Badge,
  Text,
  HStack,
  Tooltip,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";

import {
  SearchIcon,
  RepeatIcon,
  CalendarIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import {
  useBackendHealthLogs,
} from "../hooks/useBackendHealthLogs";


function formatIST(
  value: string | null
) {
  if (!value) {
    return "-";
  }

  try {
    const dt = new Date(value);

    if (Number.isNaN(dt.getTime())) {
      return value;
    }

    const date =
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Calcutta",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dt);

    const time =
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Calcutta",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(dt);

    return `${date.replace(
      /\//g,
      "-"
    )}, ${time}`;
  } catch {
    return value;
  }
}


function getStatusColor(
  status: string
) {
  switch (
    status?.toUpperCase()
  ) {
    case "UP":
    case "HEALTHY":
    case "OK":
      return "green";

    case "DOWN":
    case "FAILED":
    case "ERROR":
      return "red";

    case "WARNING":
    case "DEGRADED":
      return "orange";

    default:
      return "blue";
  }
}


function formatDuration(
  seconds: number | null
) {
  if (
    seconds === null ||
    seconds === undefined
  ) {
    return "-";
  }

  if (seconds < 60) {
    return `${seconds.toFixed(1)} sec`;
  }

  const minutes = Math.floor(
    seconds / 60
  );

  const remainingSeconds =
    Math.round(seconds % 60);

  if (minutes < 60) {
    return `${minutes} min ${remainingSeconds} sec`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remainingMinutes =
    minutes % 60;

  return `${hours} hr ${remainingMinutes} min`;
}


export default function SystemLog() {
  const {
    logs,
    loading,

    search,
    setSearch,

    from,
    setFrom,

    to,
    setTo,

    page,
    setPage,

    limit,
    setLimit,

    total,
    totalPages,

    clearFilters,
    refresh,
  } = useBackendHealthLogs();


  const bgCard =
    useColorModeValue(
      "white",
      "gray.800"
    );

  const bgTable =
    useColorModeValue(
      "gray.50",
      "#0f141a"
    );

  const bgHeader =
    useColorModeValue(
      "gray.100",
      "gray.700"
    );

  const borderCol =
    useColorModeValue(
      "gray.200",
      "whiteAlpha.300"
    );

  const textCol =
    useColorModeValue(
      "gray.800",
      "gray.100"
    );


  const [
    searchInput,
    setSearchInput,
  ] = useState(search);


  function handleSearch() {
    setSearch(
      searchInput.trim()
    );

    setPage(1);
  }


  function handleClear() {
    setSearchInput("");
    clearFilters();
  }


  return (
    <Box
      w="100%"
    >

      {/* PAGE TITLE */}

      <Heading
        size="md"
        mb={4}
      >
        Backend Health Log
      </Heading>


      {/* FILTERS */}

      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 220px 220px auto",
        }}
        gap={3}
        mb={3}
        alignItems="center"
      >

        {/* SEARCH */}

        <GridItem>
          <InputGroup>

            <InputLeftElement
              pointerEvents="none"
            >
              <SearchIcon opacity={0.7} />
            </InputLeftElement>

            <Input
              placeholder="Search backend / status / log type"
              value={searchInput}
              onChange={(e) =>
                setSearchInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSearch();
                }
              }}
              borderColor={
                borderCol
              }
            />

          </InputGroup>
        </GridItem>


        {/* FROM DATE */}

        <GridItem>
          <InputGroup>

            <InputLeftElement
              pointerEvents="none"
            >
              <CalendarIcon opacity={0.7} />
            </InputLeftElement>

            <Input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(
                  e.target.value
                );

                setPage(1);
              }}
              borderColor={
                borderCol
              }
            />

          </InputGroup>
        </GridItem>


        {/* TO DATE */}

        <GridItem>
          <InputGroup>

            <InputLeftElement
              pointerEvents="none"
            >
              <CalendarIcon opacity={0.7} />
            </InputLeftElement>

            <Input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(
                  e.target.value
                );

                setPage(1);
              }}
              borderColor={
                borderCol
              }
            />

          </InputGroup>
        </GridItem>


        {/* BUTTONS */}

        <GridItem
          justifySelf={{
            base: "stretch",
            md: "end",
          }}
        >
          <HStack
            spacing={2}
            justify="flex-end"
          >

            <Tooltip
              label="Clear filters"
            >
              <IconButton
                aria-label="Clear filters"
                icon={
                  <CloseIcon boxSize={3} />
                }
                onClick={
                  handleClear
                }
                variant="outline"
              />
            </Tooltip>


            <Tooltip
              label="Refresh"
            >
              <IconButton
                aria-label="Refresh"
                icon={
                  <RepeatIcon />
                }
                onClick={
                  refresh
                }
                isLoading={
                  loading
                }
                colorScheme="blue"
              />
            </Tooltip>

          </HStack>
        </GridItem>

      </Grid>


      {/* TABLE */}

      <Box
        bg={bgCard}
        borderWidth="1px"
        borderColor={
          borderCol
        }
        borderRadius="xl"
        overflow="hidden"
      >

        <Box
          overflowX="auto"
        >

          <Table
            size="sm"
            variant="simple"
            bg={bgTable}
            color={textCol}
          >

            <Thead
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                bg: bgHeader,
              }}
            >

              <Tr>

                <Th
                  minW="220px"
                  color={textCol}
                >
                  EVENT TIME
                </Th>

                <Th
                  minW="220px"
                  color={textCol}
                >
                  LOG TYPE
                </Th>

                <Th
                  minW="120px"
                  color={textCol}
                >
                  BACKEND
                </Th>

                <Th
                  minW="100px"
                  color={textCol}
                >
                  STATUS
                </Th>

                <Th
                  minW="220px"
                  color={textCol}
                >
                  DOWN AT
                </Th>

                <Th
                  minW="220px"
                  color={textCol}
                >
                  UP AT
                </Th>

                <Th
                  minW="130px"
                  color={textCol}
                >
                  DURATION
                </Th>

              </Tr>

            </Thead>


            <Tbody>

              {/* LOADING */}

              {loading &&
                logs.length === 0 && (
                  <Tr>

                    <Td colSpan={7}>

                      <Box
                        py={8}
                        textAlign="center"
                        color="gray.400"
                      >
                        Loading backend
                        health logs...
                      </Box>

                    </Td>

                  </Tr>
                )}


              {/* DATA */}

              {logs.map(
                (row) => (
                  <Tr
                    key={`${row.log_type}-${row.id}`}
                    borderColor={
                      borderCol
                    }
                  >

                    {/* EVENT TIME */}

                    <Td
                      fontFamily="mono"
                      color={textCol}
                      whiteSpace="nowrap"
                    >
                      {formatIST(
                        row.event_time
                      )}
                    </Td>


                    {/* LOG TYPE */}

                    <Td
                      color={textCol}
                    >

                      <Badge
                        colorScheme={
                          row.log_type ===
                          "PRIMARY BACKEND HEALTH"
                            ? "purple"
                            : "blue"
                        }
                        variant="subtle"
                        whiteSpace="nowrap"
                      >
                        {row.log_type}
                      </Badge>

                    </Td>


                    {/* BACKEND */}

                    <Td
                      color={textCol}
                    >
                      {row.backend_name ||
                        "-"}
                    </Td>


                    {/* STATUS */}

                    <Td>

                      <Badge
                        colorScheme={
                          getStatusColor(
                            row.status
                          )
                        }
                        variant="solid"
                      >
                        {row.status ||
                          "-"}
                      </Badge>

                    </Td>


                    {/* DOWN AT */}

                    <Td
                      fontFamily="mono"
                      color={textCol}
                      whiteSpace="nowrap"
                    >
                      {formatIST(
                        row.down_at
                      )}
                    </Td>


                    {/* UP AT */}

                    <Td
                      fontFamily="mono"
                      color={textCol}
                      whiteSpace="nowrap"
                    >
                      {formatIST(
                        row.up_at
                      )}
                    </Td>


                    {/* DURATION */}

                    <Td
                      color={textCol}
                      whiteSpace="nowrap"
                    >
                      {formatDuration(
                        row.duration_seconds
                      )}
                    </Td>

                  </Tr>
                )
              )}


              {/* EMPTY */}

              {!loading &&
                logs.length === 0 && (
                  <Tr>

                    <Td
                      colSpan={7}
                    >
                      <Box
                        py={6}
                        textAlign="center"
                        color="gray.400"
                      >
                        No backend health
                        logs found for
                        selected filters.
                      </Box>
                    </Td>

                  </Tr>
                )}

            </Tbody>

          </Table>

        </Box>

      </Box>


      {/* PAGINATION */}

      <Box mt={4}>

        <HStack
          spacing={4}
          justify="space-between"
          align="center"
        >

          {/* ROWS PER PAGE */}

          <HStack spacing={2}>

            <Text
              fontSize="sm"
              color={textCol}
            >
              Rows per page:
            </Text>

            <Select
              w="100px"
              size="sm"
              value={limit}
              onChange={(e) => {
                setLimit(
                  Number(
                    e.target.value
                  )
                );

                setPage(1);
              }}
              bg={bgCard}
              borderColor={
                borderCol
              }
              color={textCol}
            >

              <option value={10}>
                10
              </option>

              <option value={25}>
                25
              </option>

              <option value={50}>
                50
              </option>

              <option value={100}>
                100
              </option>

            </Select>

          </HStack>


          {/* PAGE */}

          <HStack spacing={2}>

            <Text
              fontSize="sm"
              color={textCol}
            >
              Page {page} of{" "}
              {totalPages || 1}{" "}
              ({total} total)
            </Text>


            {/* PREVIOUS */}

            <Tooltip
              label="Previous page"
            >
              <IconButton
                aria-label="Previous page"
                icon={
                  <ChevronLeftIcon />
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      Math.max(
                        1,
                        p - 1
                      )
                  )
                }
                isDisabled={
                  page <= 1 ||
                  loading
                }
                size="sm"
              />
            </Tooltip>


            {/* NEXT */}

            <Tooltip
              label="Next page"
            >
              <IconButton
                aria-label="Next page"
                icon={
                  <ChevronRightIcon />
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      p < totalPages
                        ? p + 1
                        : p
                  )
                }
                isDisabled={
                  page >=
                    totalPages ||
                  loading
                }
                size="sm"
              />
            </Tooltip>

          </HStack>

        </HStack>

      </Box>

    </Box>
  );
}