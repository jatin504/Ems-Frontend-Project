// src/pages/AlarmLatest.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorModeValue,
  HStack,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  useAlarmLatest,
  PAGE_SIZE_OPTIONS,
} from "../hooks/useEventLatest";

function downloadCSV(rows: any[], filename: string) {
  if (!rows.length) return;
  const replacer = (key: string, value: any) => value ?? "";
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(","),
    ...rows.map(row =>
      header.map(fieldName =>
        JSON.stringify(row[fieldName], replacer)
      ).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

const EventLatest: React.FC = () => {
  const navigate = useNavigate();

  const {
    rows,
    liveCount,
    ackCount,
    selfResolvedCount,
    pageRows,
    totalRows,
    totalPages,
    pageSize,
    safeCurrentPage,
    startIndex,
    activePopover,
    setActivePopover,
    handleCommentChange,
    handleCommentSave,
    handlePageSizeChange,
    goToFirst,
    goToPrev,
    goToNext,
    goToLast,
    getRowBg,
    searchInput,
    setSearchInput,
    handleSearch,
  } = useAlarmLatest(1000);

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("black", "white");

  const legendBg = useColorModeValue("white", "gray.800");
  const legendBorder = useColorModeValue("blackAlpha.200", "whiteAlpha.300");

  const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <HStack spacing={2}>
      <Box
        w="12px"
        h="12px"
        borderRadius="2px"
        bg={color}
        border="1px solid"
        borderColor="blackAlpha.400"
      />
      <Text fontSize="sm">{label}</Text>
    </HStack>
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Event", href: "/events/latest" },
    { label: "Latest" },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Box
        p={3}
        bg={bgColor}
        width="full"
        minH="100vh"
        color={textColor}
        position="relative"
      >
        <HStack justify="space-between" mt={5}>
          <HStack spacing={6}>
            <Box
              minW="140px"
              px={4}
              py={2}
              borderRadius="md"
              bg="blue.500"
              color="white"
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                Total / Live
              </Text>

              <Text
                fontSize="lg"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                {rows.length} / {liveCount}
              </Text>
            </Box>

            <Box
              minW="170px"
              px={4}
              py={2}
              borderRadius="md"
              bg="green.500"
              color="white"
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                Self Resolve / Ack
              </Text>

              <Text
                fontSize="lg"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                {selfResolvedCount} / {ackCount}
              </Text>
            </Box>
          </HStack>

          <Box width="100%" mt={5}>
            <HStack justify="flex-end" spacing={3} flexWrap="wrap">

    {/* SEARCH */}
    <Box position="relative">
      <Input
        placeholder="Search device, type, severity, status..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        bg="white"
        color="black"
        size="sm"
        width="280px"
        pr="52px"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.300"
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px #3182ce",
        }}
      />

      <Box
        position="absolute"
        top="50%"
        right="8px"
        transform="translateY(-50%)"
        zIndex={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="30px"
        h="30px"
        borderRadius="md"
        bg="white"
        color="blue.500"
        border="1px solid"
        borderColor="gray.300"
        cursor="pointer"
        fontSize="14px"
        fontWeight="bold"
        userSelect="none"
        onClick={handleSearch}
        _hover={{
          bg: "gray.100",
          transform: "translateY(-50%) scale(1.05)",
        }}
        transition="all 0.2s ease"
        boxShadow="sm"
      >
        🔍
      </Box>
    </Box>

    {/* DOWNLOAD */}
    <Button
      size="sm"
      colorScheme="green"
      variant="outline"
      onClick={() => downloadCSV(pageRows, "events_latest.csv")}
    >
      Download CSV
    </Button>

    {/* NAVIGATION */}
    <Button
      size="sm"
      colorScheme="blue"
      onClick={() => navigate("/events/latest")}
    >
      Latest
    </Button>

    <Button
      size="sm"
      variant="outline"
      onClick={() => navigate("/events/history")}
    >
      History
    </Button>

  </HStack>
          </Box>
        </HStack>
        <Box overflowX="auto" mt={4}>
          <Table size="sm">
            <Thead bg="gray.700">
              <Tr>
                <Th color="gray.200">DEVICE</Th>
                <Th color="gray.200">CREATED TIME</Th>
                <Th color="gray.200">TYPE</Th>
                <Th color="gray.200">SEVERITY</Th>
                <Th color="gray.200">STATUS</Th>
                {/* <Th color="gray.200">ASSIGNEE</Th>
                <Th color="gray.200">COMMENT</Th> */}
                <Th color="gray.200">ACK</Th>
                {/* <Th color="gray.200">CLR</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {pageRows.map((row, indexInPage) => {
                const globalIndex = startIndex + indexInPage;
                return (
                  <Tr
                    key={`${row.device}-${row.time}-${globalIndex}`}
                    bg={getRowBg(row.status)}
                    color="black"
                  >
                    <Td>{row.device}</Td>
                    <Td>{row.time}</Td>
                    <Td>{row.type}</Td>
                    <Td>{row.severity}</Td>
                    <Td fontWeight="bold">{row.status}</Td>
                    {/* <Td>{row.assignee}</Td> */}
                    {/* <Td>
                      <Box bg="whiteAlpha.600" px={2} py={1} borderRadius="md">{row.comment}</Box>
                    </Td> */}
                    {/* ACK */}
                    <Td>
                      {/* <Popover
                        isOpen={activePopover === globalIndex && !row.ackDisabled}
                        onClose={() => setActivePopover(null)}
                        closeOnBlur={false}
                      > */}
                        {/* <PopoverTrigger> */}
                          <Button
                            size="xs"
                            colorScheme="blue"
                            isDisabled={row.ackDisabled}
                            onClick={() => handleCommentSave(indexInPage, "ack")}
                          >
                            ACK
                          </Button>
                        {/* </PopoverTrigger>
                        <PopoverContent bg="gray.800" color="white">
                          <PopoverArrow />
                          <PopoverBody>
                            <VStack spacing={2}>
                              <Input
                                size="sm"
                                value={row.inputValue}
                                onChange={(e) => handleCommentChange(indexInPage, e.target.value)}
                                placeholder="Enter comment"
                              />
                              <Button
                                size="sm"
                                width="100%"
                                onClick={() => handleCommentSave(indexInPage, "ack")}
                              >
                                Save
                              </Button>
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover> */}
                    </Td>
                    {/* CLR */}
                    {/* <Td>
                      <Popover
                        isOpen={activePopover === globalIndex + 100 && !row.clrDisabled}
                        onClose={() => setActivePopover(null)}
                        closeOnBlur={false}
                      >
                        <PopoverTrigger>
                          <Button
                            size="xs"
                            colorScheme="red"
                            isDisabled={row.clrDisabled}
                            onClick={() => setActivePopover(globalIndex + 100)}
                          >
                            CLR
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent bg="gray.800" color="white">
                          <PopoverArrow />
                          <PopoverBody>
                            <VStack spacing={2}>
                              <Input
                                size="sm"
                                value={row.inputValue}
                                onChange={(e) => handleCommentChange(indexInPage, e.target.value)}
                                placeholder="Enter comment"
                              />
                              <Button
                                size="sm"
                                width="100%"
                                colorScheme="red"
                                onClick={() => handleCommentSave(indexInPage, "clr")}
                              >
                                Save
                              </Button>
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td> */}
                  </Tr>
                );
              })}
              {rows.length === 0 && (
                <Tr>
                  <Td colSpan={9} textAlign="center">No active alarms</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        {rows.length > 0 && (
          <HStack justify="center" mt={4} spacing={3}>
            <HStack>
              <Text fontSize="sm">Rows per page:</Text>
              <Select
                size="sm"
                width="70px"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </Select>
            </HStack>
            <HStack>
              <Button size="xs" onClick={goToFirst} isDisabled={safeCurrentPage === 1}>{"<<"}</Button>
              <Button size="xs" onClick={goToPrev} isDisabled={safeCurrentPage === 1}>{"<"}</Button>
              <Text fontSize="sm">{safeCurrentPage} / {totalPages}</Text>
              <Button size="xs" onClick={goToNext} isDisabled={safeCurrentPage === totalPages}>{">"}</Button>
              <Button size="xs" onClick={goToLast} isDisabled={safeCurrentPage === totalPages}>{">>"}</Button>
            </HStack>
          </HStack>
        )}
        {/* Legend */}
        <Box
          position="fixed"
          right={4}
          bottom={4}
          bg={legendBg}
          border="1px solid"
          borderColor={legendBorder}
          borderRadius="md"
          px={3}
          py={2}
        >
          <HStack spacing={4}>
            <LegendItem color="red.400" label="Latest Event" />
            <LegendItem color="yellow.300" label="Acknowledged" />
            {/* <LegendItem color="green.300" label="Self Resolved" /> */}
          </HStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default EventLatest;