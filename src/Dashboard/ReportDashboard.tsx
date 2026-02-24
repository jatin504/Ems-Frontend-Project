// src/components/ReportDashboard.tsx
import React, { useMemo } from "react";
import {
  Box, Heading, VStack, Text, Flex, Button, Select, useToast,
  Table, Thead, Tbody, Tr, Th, Td, Input, Radio, RadioGroup, Stack, Checkbox,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
} from "@chakra-ui/react";
import ReactSelect, { components as reactSelectComponents } from "react-select";
import useReports from "../hooks/useReports";
import useReportTemplate from "../hooks/useReportTemplate";
import useReportsApi from "../hooks/useReportsApi";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRightIcon } from "@chakra-ui/icons";

const PAGE_SIZE = 10;

const LIVE_OPTIONS = [
  { value: "last_1_hour", label: "Last 1 hour" },
  { value: "current_day_so_far", label: "Current day so far" },
  { value: "current_week_so_far", label: "Current week so far" },
  { value: "current_month_so_far", label: "Current month so far" },
];

export default function ReportDashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const editTemplate = (location.state as any)?.editTemplate;
  const { updateTemplate } = useReportTemplate();
  const { saveOrSchedule } = useReportsApi();
  // helper to format ms -> datetime-local string
  const formatMsToLocalInput = (ms?: number | string | null) => {
    if (ms === undefined || ms === null) return "";
    // if already a datetime-local string, return as-is
    if (typeof ms === "string" && ms.includes("T")) return ms as string;
    const d = new Date(Number(ms));
    if (Number.isNaN(d.getTime())) return "";
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
  };
  const {
    allDeviceTypes, allDeviceIds,
    selectedDeviceTypes, setSelectedDeviceTypes,
    selectedDeviceIds, setSelectedDeviceIds,
    selectedParams, setSelectedParams,
    selectedDateType, setSelectedDateType,
    selectedFrequency, setSelectedFrequency,
    selectedInterval, setSelectedInterval,
    reportData, clearSelections, allDeviceColumns,
    startTs, setStartTs, endTs, setEndTs,
  } = useReports();

  const [page, setPage] = React.useState(0);
  const [reportName, setReportName] = React.useState(editTemplate?.reportName ?? "");
  const [schedule, setSchedule] = React.useState(editTemplate?.email ? "email" : "self");
  const [email, setEmail] = React.useState(editTemplate?.email ?? "");
  const [scheduleTime, setScheduleTime] = React.useState(editTemplate?.scheduleTime ?? "");
  const [scheduleLive, setScheduleLive] = React.useState(editTemplate?.scheduleLive ?? "");
  // ⭐ NEW (5 minute scheduler support)
  const [scheduleMinute, setScheduleMinute] = React.useState(
    editTemplate?.scheduleMinute ?? "0"
  );


  React.useEffect(() => {
    if (!editTemplate?.configuration) return;
    const cfg = editTemplate.configuration;
    // support legacy and compact keys from saved templates
    if (cfg.selectedDeviceTypes) setSelectedDeviceTypes(cfg.selectedDeviceTypes);
    if (cfg.deviceTypes) setSelectedDeviceTypes(cfg.deviceTypes);

    if (cfg.selectedDeviceIds) setSelectedDeviceIds(cfg.selectedDeviceIds);
    if (cfg.deviceIds) setSelectedDeviceIds(cfg.deviceIds);

    if (cfg.selectedParams) setSelectedParams(cfg.selectedParams);
    if (cfg.params) setSelectedParams(cfg.params);

    // date type - support multiple key names
    const dt = cfg.selectedDateType || cfg.dateType || cfg.type;
    if (dt) setSelectedDateType(dt);

    // frequency/interval can be saved under different keys
    if (cfg.selectedFrequency) setSelectedFrequency(cfg.selectedFrequency);
    if (cfg.frequency) setSelectedFrequency(cfg.frequency);

    if (cfg.selectedInterval) setSelectedInterval(cfg.selectedInterval);
    if (cfg.interval) setSelectedInterval(cfg.interval);

    // history timestamps may be saved as ms (numbers) — convert to datetime-local input format
    if (cfg.historyStartTs || cfg.startTs) {
      const ms = cfg.historyStartTs ?? cfg.startTs;
      setStartTs(formatMsToLocalInput(ms));
    }
    if (cfg.historyEndTs || cfg.endTs) {
      const ms = cfg.historyEndTs ?? cfg.endTs;
      setEndTs(formatMsToLocalInput(ms));
    }
  }, [editTemplate]);

  // Device ID and Parameter search state (use react-select's internal input)

  // refs to header inputs (not needed for react-select)

  const handleDateTypeChange = (value: "relative" | "live" | "history") => {
    setSelectedDateType(value);
    setSelectedFrequency("");
    if (value !== "history") {
      setStartTs(null);
      setEndTs(null);
    }
  };

  const paginatedRows = useMemo(() => {
    if (!reportData || reportData.length === 0) return [];
    const start = page * PAGE_SIZE;
    return reportData.slice(start, start + PAGE_SIZE);
  }, [reportData, page]);

  const totalPages = reportData ? Math.ceil(reportData.length / PAGE_SIZE) : 1;

  // ---- Color mode tokens (LIGHT → all white w/ black text) ----
  const pageBg = useColorModeValue("#FFFFFF", "#161B1B");
  const fg = useColorModeValue("black", "white");

  const panelBg = useColorModeValue("#FFFFFF", "gray.700");
  const inputBg = useColorModeValue("#FFFFFF", "gray.800");
  const tableBg = useColorModeValue("#FFFFFF", "gray.800");
  const borderClr = useColorModeValue("gray.300", "gray.600");
  const placeholderClr = useColorModeValue("gray.500", "gray.400");

  // ---- Save Template (unchanged) ----
  const handleSaveTemplate = async () => {
    if (!reportName) {
      toast({ title: "Report Name is required.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (schedule === "email" && !email) {
      toast({ title: "Email is required.", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (selectedDateType === "history") {
      if (!startTs || !endTs) {
        toast({ title: "Start and End timestamps are required for History.", status: "warning", duration: 3000, isClosable: true });
        return;
      }
      if (new Date(startTs) > new Date(endTs)) {
        toast({ title: "StartTs must be before EndTs.", status: "warning", duration: 3000, isClosable: true });
        return;
      }
    }

    const token = sessionStorage.getItem("token");
    let userIdFromToken: number | undefined = undefined;
    try {
      if (token) {
        const payload = JSON.parse(atob((token.split(".")[1] || "").replace(/-/g, "+").replace(/_/g, "/")));
        userIdFromToken = payload?.user_id;
      }
    } catch { /* ignore */ }

    const payload = {
      reportName, schedule, email: schedule === "email" ? email : null,
      scheduleTime,
      scheduleMinute,
      scheduleLive,


      selectedDeviceTypes, selectedDeviceIds, selectedParams,
      selectedDateType, selectedFrequency, selectedInterval,
      previewData: reportData || [],
      ...(selectedDateType === "history" ? { startTs, endTs } : {}),
      ...(schedule === "self" && userIdFromToken ? { userId: userIdFromToken } : {}),
    };

    try {
      // If we arrived via editTemplate, update existing template instead of creating
      if (editTemplate?.reportName) {
        await updateTemplate(editTemplate.reportName, payload);
        toast({ title: "Template updated!", description: `Report "${editTemplate.reportName}" updated.`, status: "success", duration: 3000, isClosable: true });
        navigate("/report/template");
        return;
      }
        try {
          await saveOrSchedule(payload, schedule as any);
          toast({
            title: "Template saved!",
            description: `Report "${reportName}" saved for ${schedule}${schedule === "email" ? ` (${email})` : ""}.`,
            status: "success", duration: 3000, isClosable: true,
          });
          try {
            navigate("/report/template");
          } catch (e) {
            // ignore navigation errors in non-router environments
          }
        } catch (err: any) {
          toast({
            title: "Error saving template",
            description: err?.message || "Unknown error",
            status: "error", duration: 3000, isClosable: true,
          });
        }
    } catch (err: any) {
      toast({
        title: "Network error",
        description: err?.message || "Could not save template",
        status: "error", duration: 3000, isClosable: true,
      });
    }
  };

  // ---- chakra-react-select styles (light/dark aware) ----
  const selectMenuBg = useColorModeValue("#FFFFFF", "gray.700");
  const selectOptionBg = useColorModeValue("#FFFFFF", "gray.700");
  const selectOptionBgFocused = useColorModeValue("gray.100", "gray.600");
  const selectMultiBg = useColorModeValue("gray.100", "gray.600");
  const customSelectStyles = {
    container: (p: any) => ({ ...p, w: "100%" }),
    menu: (p: any) => ({ ...p, bg: selectMenuBg, color: fg }),
    option: (p: any, s: any) => ({
      ...p,
      bg: s.isFocused ? selectOptionBgFocused : selectOptionBg,
      color: fg,
    }),
    multiValue: (p: any) => ({ ...p, background: selectMultiBg, color: fg }),
    multiValueLabel: (p: any) => ({ ...p, color: fg }),
    control: (p: any) => ({ ...p, bg: inputBg, borderColor: borderClr }),
    input: (p: any) => ({ ...p, color: fg }),
    singleValue: (p: any) => ({ ...p, color: fg }),
  };

  // Use full option lists; react-select will filter based on typed input
  const filteredDeviceIds = allDeviceIds;
  const filteredParams = allDeviceColumns;

  // ...removed isAllDeviceIdsChecked and isAllParamsChecked...

  // ...removed handleToggleAllDeviceIds and handleToggleAllParams...

  // ...removed DeviceOption and ParamOption...

  // ...removed DeviceIdMenuList and ParamMenuList...
  // ...existing code...
  return (
    <Box p={3} bg={pageBg} minH="100vh" color={fg}>
      <Heading mb={6} mt={5} size="lg" color={fg}>📄 Report Management</Heading>

      <Flex direction="column" align="center" gap={6}>
        {/* Row 1 */}
        <Box bg={panelBg} p={6} rounded="xl" w="80%" border="1px solid" borderColor={borderClr}>
          <Flex gap={6} justify="space-between" wrap="wrap">
            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Date Type</Text>
              <Select value={selectedDateType} onChange={(e) => handleDateTypeChange(e.target.value as any)} color={fg} bg={inputBg} borderColor={borderClr}>
                <option value="relative" style={{ color: "black" }}>Relative</option>
                <option value="live" style={{ color: "black" }}>Live</option>
                <option value="history" style={{ color: "black" }}>History</option>
              </Select>
            </VStack>

            {selectedDateType === "relative" && (
              <VStack align="start" minW="200px" flex="1">
                <Text fontWeight="semibold">Type</Text>
                <Select
                  placeholder="Select"
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  color={fg}
                  bg={inputBg}
                  borderColor={borderClr}
                >
                  <option value="daily" style={{ color: "black" }}>Daily</option>
                  <option value="weekly" style={{ color: "black" }}>Week</option>
                  <option value="monthly" style={{ color: "black" }}>Month</option>
                  <option value="quarterly" style={{ color: "black" }}>Quarter</option>
                </Select>
              </VStack>
            )}

            {selectedDateType === "live" && (
              <VStack align="start" minW="260px" flex="1">
                <Text fontWeight="semibold">Type (Live Range)</Text>
                <Select placeholder="Select range" value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)} color={fg} bg={inputBg} borderColor={borderClr}>
                  {LIVE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ color: "black" }}>{opt.label}</option>
                  ))}
                </Select>
              </VStack>
            )}

            {selectedDateType === "history" && (
              <>
                <VStack align="start" minW="260px" flex="1">
                  <Text fontWeight="semibold">StartTs</Text>
                  <Input type="datetime-local" value={startTs || ""} onChange={(e) => setStartTs(e.target.value)} bg={inputBg} color={fg} borderColor={borderClr} _placeholder={{ color: placeholderClr }} />
                </VStack>
                <VStack align="start" minW="260px" flex="1">
                  <Text fontWeight="semibold">EndTs</Text>
                  <Input type="datetime-local" value={endTs || ""} onChange={(e) => setEndTs(e.target.value)} bg={inputBg} color={fg} borderColor={borderClr} _placeholder={{ color: placeholderClr }} />
                </VStack>
              </>
            )}

            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Interval</Text>
              <Select value={selectedInterval} onChange={(e) => setSelectedInterval(e.target.value)} color={fg} bg={inputBg} borderColor={borderClr}>
                <option value="1min" style={{ color: "black" }}>1 min</option>
                <option value="15min" style={{ color: "black" }}>15 min</option>
                <option value="1hr" style={{ color: "black" }}>1 hour</option>
                <option value="1day" style={{ color: "black" }}>1 day</option>
              </Select>
            </VStack>
          </Flex>
        </Box>

        {/* Row 2 */}
        <Box bg={panelBg} p={6} rounded="xl" w="80%" border="1px solid" borderColor={borderClr}>
          <Flex gap={6} justify="space-between" wrap="wrap">
            {/* Device Type */}
            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Device Type</Text>
              <Box w="200px">
                <ReactSelect
                  isSearchable
                  isMulti={false}
                  placeholder="Select device type"
                  value={selectedDeviceTypes.length > 0 ? [{ label: selectedDeviceTypes[0], value: selectedDeviceTypes[0] }] : null}
                  onChange={(selected) => setSelectedDeviceTypes(selected ? [selected.value] : [])}
                  options={allDeviceTypes.map((type) => ({ label: type, value: type }))}
                  styles={{
                    control: (base) => ({ ...base, background: inputBg, borderColor: borderClr, color: fg }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                    input: (base) => ({ ...base, color: fg }),
                    singleValue: (base) => ({ ...base, color: fg }),
                  }}
                />
              </Box>
            </VStack>

            {/* Device ID */}
            <VStack align="start" minW="420px" flex="2" w="100%">
              <Text fontWeight="semibold">Device ID</Text>
              <Box w="420px">
                <ReactSelect
                  isMulti
                  isSearchable
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  placeholder={selectedDeviceTypes.length === 0 ? "Select type first" : "Select device IDs"}
                  isDisabled={selectedDeviceTypes.length === 0}
                  value={
                    selectedDeviceIds.length === allDeviceIds.length && allDeviceIds.length > 0
                      ? [{ label: "All", value: "__ALL__" }]
                      : allDeviceIds
                        .filter((id) => selectedDeviceIds.includes(id))
                        .map((id) => ({ label: id, value: id }))
                  }
                  onChange={(selected) => {
                    const sel = selected || [];
                    if (sel.some((s: any) => s.value === "__ALL__")) {
                      setSelectedDeviceIds(allDeviceIds);
                    } else {
                      setSelectedDeviceIds(sel ? sel.map((s: any) => s.value) : []);
                    }
                  }}
                  options={[{ label: "All", value: "__ALL__" }, ...allDeviceIds.map((id) => ({ label: id, value: id }))]}
                  blurInputOnSelect={false}
                  openMenuOnFocus
                  filterOption={(option, rawInput) =>
                    String(option.label).toLowerCase().includes(String(rawInput || '').toLowerCase())
                  }
                  styles={{
                    control: (base) => ({ ...base, background: inputBg, borderColor: borderClr, color: fg, minHeight: 44, height: 44, width: 420 }),
                    valueContainer: (base) => ({ ...base, minHeight: 44, height: 44 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                    multiValue: (base) => ({ ...base, background: "#E6F0FF", color: fg }),
                    option: (base, state) => ({ ...base, color: fg, backgroundColor: state.isFocused ? "#EBF8FF" : state.isSelected ? "#E6F0FF" : undefined }),
                    input: (base) => ({ ...base, color: fg }),
                    singleValue: (base) => ({ ...base, color: fg }),
                  }}
                  components={{
                    Option: (props) => (
                      <reactSelectComponents.Option {...props}>
                        <HStack>
                          <Checkbox isChecked={props.isSelected} pointerEvents="none" />
                          <Text noOfLines={1}>{props.label}</Text>
                        </HStack>
                      </reactSelectComponents.Option>
                    ),
                    ValueContainer: (props) => {
                      const count = selectedDeviceIds.length;
                      return (
                        <reactSelectComponents.ValueContainer {...props}>
                          {props.children}
                          {count > 1 && (
                            <HStack pl={2} ml={2} spacing={2} align="center">
                              <Text fontWeight="bold">{count} selected</Text>
                            </HStack>
                          )}
                        </reactSelectComponents.ValueContainer>
                      );
                    },
                  }}
                />
              </Box>
            </VStack>

            {/* Parameter */}
            <VStack align="start" minW="420px" flex="2" w="100%">
              <Text fontWeight="semibold">Parameter</Text>
              <Box w="420px">
                <ReactSelect
                  isMulti
                  isSearchable
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  placeholder="Select parameters"
                  value={
                    selectedParams.length === allDeviceColumns.length && allDeviceColumns.length > 0
                      ? [{ label: "All", value: "__ALL_PARAMS__" }]
                      : allDeviceColumns
                        .filter((p) => selectedParams.includes(p))
                        .map((p) => ({ label: p, value: p }))
                  }
                  onChange={(selected) => {
                    const sel = selected || [];
                    if (sel.some((s: any) => s.value === "__ALL_PARAMS__")) {
                      setSelectedParams(allDeviceColumns);
                    } else {
                      setSelectedParams(sel ? sel.map((s: any) => s.value) : []);
                    }
                  }}
                  options={[{ label: "All", value: "__ALL_PARAMS__" }, ...allDeviceColumns.map((p) => ({ label: p, value: p }))]}
                  blurInputOnSelect={false}
                  openMenuOnFocus
                  filterOption={(option, rawInput) =>
                    String(option.label).toLowerCase().includes(String(rawInput || '').toLowerCase())
                  }
                  styles={{
                    control: (base) => ({ ...base, background: inputBg, borderColor: borderClr, color: fg, minHeight: 44, height: 44, width: 420 }),
                    valueContainer: (base) => ({ ...base, minHeight: 44, height: 44 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                    multiValue: (base) => ({ ...base, background: "#E6F0FF", color: fg }),
                    option: (base, state) => ({ ...base, color: fg, backgroundColor: state.isFocused ? "#EBF8FF" : state.isSelected ? "#E6F0FF" : undefined }),
                    input: (base) => ({ ...base, color: fg }),
                    singleValue: (base) => ({ ...base, color: fg }),
                  }}
                  components={{
                    Option: (props) => (
                      <reactSelectComponents.Option {...props}>
                        <HStack>
                          <Checkbox isChecked={props.isSelected} pointerEvents="none" />
                          <Text noOfLines={1}>{props.label}</Text>
                        </HStack>
                      </reactSelectComponents.Option>
                    ),
                    ValueContainer: (props) => {
                      const count = selectedParams.length;
                      return (
                        <reactSelectComponents.ValueContainer {...props}>
                          {props.children}
                          {count > 1 && (
                            <HStack pl={2} ml={2} spacing={2} align="center">
                              <Text fontWeight="bold">{count} selected</Text>
                            </HStack>
                          )}
                        </reactSelectComponents.ValueContainer>
                      );
                    },
                  }}
                />
              </Box>
            </VStack>
          </Flex>
        </Box>

        {/* Row 3 */}
        <Box bg={panelBg} p={6} rounded="xl" w="80%" border="1px solid" borderColor={borderClr}>
          <Flex gap={6} justify="space-between" wrap="wrap">
            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Report Name</Text>
              <Input placeholder="Enter report name" value={reportName} onChange={(e) => setReportName(e.target.value)} bg={inputBg} color={fg} borderColor={borderClr} _placeholder={{ color: placeholderClr }} />
            </VStack>

            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Schedule</Text>
              <RadioGroup value={schedule} onChange={setSchedule}>
                <Stack direction="row">
                  <Radio value="self">Self</Radio>
                  <Radio value="email">Email</Radio>
                </Stack>
              </RadioGroup>
              {schedule === "email" && (
                <Input mt={2} placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} bg={inputBg} color={fg} borderColor={borderClr} _placeholder={{ color: placeholderClr }} />
              )}
            </VStack>

            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Schedule Time</Text>
              <Input
                type="time"
                value={
                  scheduleTime !== "" || scheduleMinute !== ""
                    ? `${String(scheduleTime).padStart(2, "0")}:${String(scheduleMinute ?? "0").padStart(2, "0")}`
                    : ""
                }
                onChange={(e: any) => {
                  const val = e.target.value || ""; // format HH:MM
                  const [hh = "", mm = ""] = val.split(":");
                  setScheduleTime(hh !== "" ? String(Number(hh)) : "");
                  setScheduleMinute(mm !== "" ? String(Number(mm)) : "0");
                }}
                bg={inputBg}
                color={fg}
                borderColor={borderClr}
              />
            </VStack>

            <VStack align="start" minW="200px" flex="1">
              <Text fontWeight="semibold">Schedule Live</Text>
              <Select placeholder="Select duration" value={scheduleLive} onChange={(e) => setScheduleLive(e.target.value)} color={fg} bg={inputBg} borderColor={borderClr}>
                <option value="7" style={{ color: "black" }}>7 Days</option>
                <option value="30" style={{ color: "black" }}>30 Days</option>
              </Select>
            </VStack>
          </Flex>
        </Box>

        <Flex direction="row" gap={3} w="80%" justify="flex-end">
          <Button colorScheme="blue" variant="outline" onClick={clearSelections}>Reset</Button>
          <Button colorScheme="green" onClick={handleSaveTemplate}>Save Template</Button>
        </Flex>

        {/* Report Table */}
        <Box w="80%" bg={tableBg} p={4} rounded="xl" mt={4} border="1px solid" borderColor={borderClr}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color={fg}>Report Data</Heading>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={() => {
                if (!reportData || reportData.length === 0) {
                  toast({
                    title: "No data to download.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                  return;
                }
                const headers = ["Timestamp", ...selectedParams.map(p => p.charAt(0).toUpperCase() + p.slice(1))];
                // Collect all unique keys from all rows to ensure all columns are present
                let allHeadersSet = new Set<string>();
                reportData.forEach(row => Object.keys(row).forEach(k => allHeadersSet.add(k)));
                let allHeaders = Array.from(allHeadersSet);
                if (allHeaders.includes('timestamp')) {
                  allHeaders = ['timestamp', ...allHeaders.filter(h => h !== 'timestamp')];
                }
                // Ensure every row has all columns (fill missing with empty string)
                const rows = reportData.map((row: any) =>
                  allHeaders.map(header => (header in row ? row[header] : ""))
                );
                const csvContent =
                  [allHeaders, ...rows]
                    .map(r => r.map((val: any) => `"${String(val).replace(/"/g, '""')}"`).join(","))
                    .join("\r\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${reportName || "report"}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              isDisabled={!reportData || reportData.length === 0}
            >
              Download CSV
            </Button>
          </Flex>
          {reportData && reportData.length > 0 ? (
            <>
              <Table variant="simple" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th color={fg}>Timestamp</Th>
                    {paginatedRows.length > 0 && Object.keys(paginatedRows[0]).map((param) => (
                      param !== "timestamp" && <Th key={param} color={fg}>{param.charAt(0).toUpperCase() + param.slice(1)}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedRows.map((row: any, idx: number) => (
                    <Tr key={idx}>
                      <Td color={fg}>{row.timestamp}</Td>
                      {Object.keys(row).map((param) => (
                        param !== "timestamp" && <Td key={param} color={fg}>{row[param]}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Flex mt={4} justify="center" align="center" gap={4}>
                <Button size="sm" onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>Prev</Button>
                <Text color={fg}>Page {page + 1} of {totalPages}</Text>
                <Button size="sm" onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page + 1 >= totalPages}>Next</Button>
              </Flex>
            </>
          ) : (
            <Text color={useColorModeValue("gray.600", "gray.400")}>No report data available.</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
