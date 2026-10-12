import React, { useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  useAlarmHistory,
  PAGE_SIZE_OPTIONS,
} from "../hooks/useAlarmHistory";

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

export default function AlarmHistory() {
  const navigate = useNavigate();

  const {
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
    fetchHistory,
  } = useAlarmHistory(10);

  const [startTs, setStartTs] = useState("");
  const [endTs, setEndTs] = useState("");

  const formatLocalDateTime = (local: string) => {
    // datetime-local format: "2026-02-05T16:11" → "2026-02-05 16:11:00" (no UTC conversion)
    return (local.replace("T", " ") + ":00").substring(0, 19);
  };

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
    { label: "Alarm", href: "/alarms/latest" },
    { label: "History" },
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
          {/* <Heading size="lg">Alarm History</Heading> */}
          <Box width="100%" mt={5} display="flex" justifyContent="flex-end">
            <HStack spacing={3}>
              <Button
                size="sm"
                colorScheme="green"
                variant="outline"
                onClick={() => downloadCSV(pageRows, "alarm_history.csv")}
              >
                Download CSV
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => navigate("/alarms/latest")}
              >
                Latest
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/alarms/history")}
              >
                History
              </Button>
            </HStack>
          </Box>
        </HStack>

        {/* Search Bar */}
        <HStack spacing={3} flexWrap="wrap" mt={4} p={3} bg={useColorModeValue("white", "gray.800")} borderRadius="md">
          <Box>
            <Text fontSize="sm">Start Time</Text>
            <Input
              type="datetime-local"
              size="sm"
              value={startTs}
              onChange={(e) => setStartTs(e.target.value)}
            />
          </Box>
          <Box>
            <Text fontSize="sm">End Time</Text>
            <Input
              type="datetime-local"
              size="sm"
              value={endTs}
              onChange={(e) => setEndTs(e.target.value)}
            />
          </Box>
          <Button
            size="sm"
            colorScheme="blue"
            mt={5}
            onClick={() => {
              if (!startTs || !endTs) return;
              const startDate = new Date(startTs);
              const endDate = new Date(endTs);
              if (startDate > endDate) {
                alert("Start Time cannot be greater than End Time");
                return;
              }
              const start = formatLocalDateTime(startTs);
              const end = formatLocalDateTime(endTs);
              fetchHistory(start, end);
            }}
          >
            Search
          </Button>
          <Button
            size="sm"
            variant="outline"
            mt={5}
            onClick={() => {
              setStartTs("");
              setEndTs("");
              fetchHistory();
            }}
          >
            Reset
          </Button>
        </HStack>

        {/* Table */}
        <Box overflowX="auto" mt={4}>
          <Table
            size="sm"
            sx={{
              "& td": {
                padding: "6px 12px",
                fontSize: "12px",
                lineHeight: "1.2",
                whiteSpace: "nowrap",
                height: "40px",
              },
            }}
          >
            <Thead bg="gray.700">
              <Tr>
                <Th color="gray.200">DEVICE</Th>
                <Th color="gray.200">CREATED TIME</Th>
                <Th color="gray.200">CLEAR TIME</Th>
                <Th color="gray.200">DESCIPTION</Th>
                <Th color="gray.200">SEVERITY</Th>
                <Th color="gray.200">STATUS</Th>
                <Th color="gray.200">ASSIGNEE</Th>
                <Th color="gray.200">COMMENT</Th>
                <Th color="gray.200">ACK</Th>
                <Th color="gray.200">CLR</Th>
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
                    <Td>{row.device.replace("plant_1_", "").replace(/_/g, " ")}</Td>
                    <Td>{row.time}</Td>
                    <Td>{row.clrTime}</Td>
                    <Td>{row.tag.replace(/_/g, " ")}</Td>
                    <Td>{row.severity}</Td>
                    <Td fontWeight="bold">{row.status}</Td>
                    <Td>{row.assignee}</Td>
                    <Td>
                      <Box
                        bg="whiteAlpha.600"
                        px={2}
                        py={1}
                        borderRadius="md"
                        width="140px"
                        maxWidth="140px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={row.comment}
                      >
                        {row.comment}
                      </Box>
                    </Td>
                    {/* ACK */}
                    <Td>
                      <Popover
                        isOpen={activePopover === globalIndex && !row.ackDisabled}
                        onClose={() => setActivePopover(null)}
                        closeOnBlur={false}
                      >
                        <PopoverTrigger>
                          <Button
                            size="xs"
                            colorScheme="blue"
                            isDisabled={row.ackDisabled}
                            onClick={() => setActivePopover(globalIndex)}
                          >
                            ACK
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
                                onClick={() => handleCommentSave(indexInPage, "ack")}
                              >
                                Save
                              </Button>
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    {/* CLR */}
                    <Td>
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
                    </Td>
                  </Tr>
                );
              })}
              {totalRows === 0 && (
                <Tr>
                  <Td colSpan={9} textAlign="center" color="white">
                    No alarm history
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        {totalRows > 0 && (
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
            <LegendItem color="green.300" label="Self Resolved" />
            <LegendItem color="yellow.300" label="Ack Alarm" />
          </HStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
