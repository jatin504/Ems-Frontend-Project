// Helper to convert interval and intervalType to ms
function intervalToMs(value?: number, unit?: string): number {
  if (!value || !unit) return 60_000;
  switch (unit) {
    case "second": return value * 1000;
    case "minute": return value * 60 * 1000;
    case "hour": return value * 60 * 60 * 1000;
    default: return 60_000;
  }
}
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Text,
  Heading,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import SplineGraph from "../../../../components/Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../../../components/Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

type Row = {
  name: string;
  enabled: boolean;
  connected: boolean;
  soh: string;
  soc: string;
  soe: string;
};

// String keys to fetch from API
const STRING_KEYS = [
  { key: "battery_cabin_temperature_1", alias: "Current", keyType: "common" },
  { key: "alarm_1", alias: "Volt", keyType: "common" },
];

// Helper to build string device IDs (adjust as per your device naming convention)
function buildStringDeviceId(bankNum: number, stringNum: number) {
  // Example: BK1.S01, BK2.S12, etc.
  return `BK${bankNum}.S${String(stringNum).padStart(2, "0")}`;
}

// REPLACE ONLY THIS COMPONENT
const Pill: React.FC<{ ok: boolean; label: string; colorText: string }> = ({
  ok,
  label,
  colorText,
}) => {
  const fill = ok ? "#22c55e" : "#ef4444";

  // detect column from label text (calls unchanged)
  const isEnable = /(enabled|disabled)/i.test(label);
  const isConnect = /(connected|disconnected)/i.test(label);

  const icon = isEnable ? (
    // inside colored circle (Disabled = red ○ with white X)
    <Box as="svg" viewBox="0 0 20 20" w="18px" h="18px">
      <circle cx="10" cy="10" r="9" fill={fill} />
      {ok ? (
        <path
          d="M6 10.5l2.2 2.2L14 7"
          stroke="#ffffff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <path d="M6 6l8 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 6l-8 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </Box>
  ) : isConnect ? (
    //link (slash when disconnected) inside colored circle
    <Box as="svg" viewBox="0 0 20 20" w="18px" h="18px">
      <circle cx="10" cy="10" r="9" fill={fill} />
      <path
        d="M7 10h1a3 3 0 003-3h2a3 3 0 110 6h-2a3 3 0 01-3-3H7m-1-3h2a3 3 0 010 6H6a3 3 0 110-6z"
        stroke="#ffffff"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!ok && <path d="M5 15L15 5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />}
    </Box>
  ) : (
    // fallback: tiny dot (shouldn’t be used)
    <Box w="8px" h="8px" borderRadius="full" bg={fill} />
  );

  return (
    <HStack spacing={2}>
      {icon}
      <Text fontSize="sm" color={colorText}>
        {label}
      </Text>
    </HStack>
  );
};

const StringsTable: React.FC<{ bankNum?: number }> = ({ bankNum = 1 }) => {
  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const textColor = useColorModeValue("#0f172a", "gray.300");
  const headingColor = textColor;
  const showHeader = useColorModeValue(false, false);
  const zebra = useColorModeValue("#f8fafc", "#FFFFFF0F");

  // Get timeWindow from hook
  const timeWindow = useTimeHandle();

  // Modal state for chart
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [selectedRawDeviceId, setSelectedRawDeviceId] = useState<string>("");
  const [chartData, setChartData] = useState<any[]>([]);

  const openChartModal = (deviceId: string, rawDeviceId?: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedRawDeviceId(rawDeviceId || deviceId);
    onOpen();
  };

  // --- Timeseries data for chart ---
  const { data: timeseriesData, fetchData: fetchTimeseriesData } = useTimeseriesData();

  // When modal opens, fetch timeseries data for selected device
  useEffect(() => {
    if (!isOpen || !selectedRawDeviceId) return;

    const dataSource = {
      devices: {
        patterns: [],
        ids: [selectedRawDeviceId],
      },
      keys: [
        { key: "bcu_1_soh", alias: "SOH", keyType: "common" },
        { key: "bcu_1_soc", alias: "SOC", keyType: "common" },
        { key: "bcu_1_soe", alias: "SOE", keyType: "common" },
      ],
      aggregation: timeWindow.config.aggregation,
      timeRange: timeWindow.config.timeRange,
      orderBy: "ASC" as const,
    };

    fetchTimeseriesData(dataSource);
  }, [isOpen, selectedRawDeviceId, timeWindow.config.aggregation, timeWindow.config.timeRange]);

  // API data fetching from multiple-latest-devices
  const [dataMap, setDataMap] = React.useState<Record<string, any>>({});

  useEffect(() => {
    fetch(
      `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id_patterns: ["_bank_bank_"],
        }),
      }
    )
      .then((r) => r.json())
      .then((j) => j.success && setDataMap(j.data))
      .catch(console.error);
  }, []);

  // --- Map API data to rows ---
  const [rows, setRows] = useState<Row[]>([]);
  const [deviceIdMap, setDeviceIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const widgetData = dataMap as any;
    if (!widgetData || Object.keys(widgetData).length === 0) {
      setRows([]);
      return;
    }

    // Find all string device IDs in data
    const stringIds = Object.keys(widgetData);
    const idMap: Record<string, string> = {};
    
    const mapped: Row[] = stringIds.map((deviceId) => {
      const d = widgetData[deviceId];

      // Custom formatting: PCS-X Bank-Y
      // Example: plant_1_pcs_2_bank_bank_1 -> PCS-2 Bank-1
      let name = deviceId;
      const pcsMatch = deviceId.match(/pcs_(\d+)/i);
      const bankMatch = deviceId.match(/bank_(\d+)/i);
      if (pcsMatch && bankMatch) {
        name = `PCS-${pcsMatch[1]} Bank-${bankMatch[1]}`;
      }
      else {
        // fallback to BKx.Syy if present
        const match = deviceId.match(/BK(\d+)\.S(\d+)/);
        if (match) name = `BK${match[1]}.S${match[2]}`;
      }

      // Store mapping of display name to raw device ID
      idMap[name] = deviceId;

      // Helper to get value for a key - extract from nested structure
      const getVal = (keyName: string) => {
        const val = d?.[keyName]?.value ?? d?.[keyName];
        if (typeof val !== "number") return val ?? "--";
        return `${val.toFixed(2)}`;
      };

      return {
        name,
        enabled: true,
        connected: true,
        soh: getVal("BCU_1_SOH") || getVal("soh") || getVal("BCU_1_SOH") || "--",
        soc: getVal("BCU_1_SOC") || getVal("soc") || getVal("BCU_1_SOC") || "--",
        soe: getVal("BCU_1_SOE") || getVal("soe") || getVal("BCU_1_SOE") || "--",
      };
    });
    
    setDeviceIdMap(idMap);
    setRows(mapped);
  }, [dataMap]);

  // Helper to transform timeseries data for chart
  const getChartSeriesData = () => {
    if (!timeseriesData || typeof timeseriesData !== "object") return [];

    const allSeries: any[] = [];

    Object.entries(timeseriesData).forEach(([deviceKey, deviceObj]) => {
      if (typeof deviceObj === "object" && deviceObj !== null) {
        // SOH series - handle both array and single object
        const sohData = deviceObj["SOH"];
        if (sohData !== undefined && sohData !== null) {
          let dataPoints: any[] = [];
          if (Array.isArray(sohData)) {
            dataPoints = sohData.map((p: any) => [p.ts, p.value]);
          } else if (typeof sohData === "object" && "value" in sohData) {
            dataPoints = [[Date.now(), (sohData as any).value]];
          }
          if (dataPoints.length > 0) {
            allSeries.push({
              name: "SOH",
              data: dataPoints,
              color: "#3182ce",
              type: "spline",
              marker: { enabled: true },
            });
          }
        }

        // SOC series - handle both array and single object
        const socData = deviceObj["SOC"];
        if (socData !== undefined && socData !== null) {
          let dataPoints: any[] = [];
          if (Array.isArray(socData)) {
            dataPoints = socData.map((p: any) => [p.ts, p.value]);
          } else if (typeof socData === "object" && "value" in socData) {
            dataPoints = [[Date.now(), (socData as any).value]];
          }
          if (dataPoints.length > 0) {
            allSeries.push({
              name: "SOC",
              data: dataPoints,
              color: "#ed8936",
              type: "spline",
              marker: { enabled: true },
            });
          }
        }

        // SOE series - handle both array and single object
        const soeData = deviceObj["SOE"];
        if (soeData !== undefined && soeData !== null) {
          let dataPoints: any[] = [];
          if (Array.isArray(soeData)) {
            dataPoints = soeData.map((p: any) => [p.ts, p.value]);
          } else if (typeof soeData === "object" && "value" in soeData) {
            dataPoints = [[Date.now(), (soeData as any).value]];
          }
          if (dataPoints.length > 0) {
            allSeries.push({
              name: "SOE",
              data: dataPoints,
              color: "#48bb78",
              type: "spline",
              marker: { enabled: true },
            });
          }
        }
      }
    });

    return allSeries;
  };

  // Sort rows by string number ASC (BK1.S01, BK1.S02, ...)
  // Sort rows by device id (name) ASC for IDs like plant_1_pcs_2_bank_bank_1, plant_1_pcs_2_bank_bank_2, ...
  const sortedRows = [...rows].sort((a, b) => {
    // Try to extract the last number from the id for natural sort
    const numA = Number((a.name.match(/(\d+)(?!.*\d)/) || [])[0]);
    const numB = Number((b.name.match(/(\d+)(?!.*\d)/) || [])[0]);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    // fallback to string compare
    return a.name.localeCompare(b.name);
  });

  return (
    <Box
      bg={cardBg}
      borderRadius="12px"
      p={4}
      border={`1px solid ${cardBorder}`}
      w="930px"
      h="534px"
      opacity={1}
    >
      <Heading
        as="h3"
        size="sm"
        color={headingColor}
        mb={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <span>Strings</span>
      </Heading>

      <Box
        overflowX="auto"
        maxWidth="100%"
        maxHeight="470px"
        overflowY="auto"
        sx={{
          scrollbarWidth: "thin",
          scrollbarColor: `${cardBorder} #e5e7eb`,
          '&::-webkit-scrollbar': {
            height: '8px',
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: cardBorder,
            borderRadius: '4px',
          },
        }}
      >
        <Table size="sm" variant="simple" minWidth="900px" style={{maxWidth: '100%'}} sx={{
          "td:not(:last-child), th:not(:last-child)": {
            borderRight: `1px solid ${cardBorder}`,
          },
        }}>
          {showHeader && (
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Enable</Th>
                <Th>Connect</Th>
                <Th>SOH</Th>
                <Th>SOC</Th>
                <Th>SOE</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
          )}

          <Tbody color={textColor}>
            {sortedRows.map((r, idx) => (
              <Tr key={r.name} bg={idx % 2 === 0 ? zebra : undefined}>
                <Td fontWeight="semibold" color={textColor}>
                  {r.name}
                </Td>
                <Td>
                  <Pill
                    ok={r.enabled}
                    label={r.enabled ? "Enabled" : "Disabled"}
                    colorText={textColor}
                  />
                </Td>
                <Td>
                  <Pill
                    ok={r.connected}
                    label={r.connected ? "Connected" : "Disconnected"}
                    colorText={textColor}
                  />
                </Td>
                <Td color={textColor}>
                  <HStack spacing={1}>
                    <Text fontSize="xs" fontWeight="600">SOH:</Text>
                    <Text fontSize="sm">{r.soh}</Text>
                  </HStack>
                </Td>
                <Td color={textColor}>
                  <HStack spacing={1}>
                    <Text fontSize="xs" fontWeight="600">SOC:</Text>
                    <Text fontSize="sm">{r.soc}</Text>
                  </HStack>
                </Td>
                <Td color={textColor}>
                  <HStack spacing={1}>
                    <Text fontSize="xs" fontWeight="600">SOE:</Text>
                    <Text fontSize="sm">{r.soe}</Text>
                  </HStack>
                </Td>
                <Td>
                  <IconButton
                    aria-label="View chart"
                    icon={<BsThreeDots />}
                    size="sm"
                    variant="ghost"
                    onClick={() => openChartModal(r.name, deviceIdMap[r.name])}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal for viewing chart */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,0.3)" />
        <ModalContent bg={cardBg} maxW="700px" boxShadow="lg" _hover={{ bg: cardBg }}>
          <ModalHeader color={textColor} fontSize="sm" fontWeight="600" _hover={{ color: textColor }} pb={2}>
            {selectedDeviceId}
          </ModalHeader>
          <ModalCloseButton color={textColor} _hover={{ color: textColor }} size="sm" />
          <ModalBody pb={4} px={3}>
            <GraphLayout
              title=""
              width={["100%"]}
              height="400px"
              bg={cardBg}
              fullScreen={false}
              downloadOption={false}
              timeWindow={false}
            >
              <SplineGraph
                apiData={getChartSeriesData()}
                height={350}
                bg={cardBg}
                legendHeight={40}
                props={{
                  legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    floating: false,
                    layout: 'horizontal',
                    useHTML: true,
                    itemStyle: { fontSize: '11px', fontWeight: '500' },
                    symbolPadding: 6,
                    x: 0,
                    y: 0,
                  },
                  plotOptions: {
                    series: {
                      marker: {
                        enabled: true,
                        radius: 3,
                        lineWidth: 0,
                        fillOpacity: 1,
                      },
                      states: {
                        hover: {
                          enabled: true,
                          marker: {
                            enabled: true,
                            radius: 3,
                            lineWidth: 0,
                            fillOpacity: 1,
                          },
                          lineWidth: 2,
                          lineWidthPlus: 0,
                          halo: { size: 0 },
                        },
                        inactive: {
                          opacity: 0.2,
                        },
                      },
                    },
                    spline: {
                      states: {
                        hover: {
                          lineWidth: 2,
                          lineWidthPlus: 0,
                          shadow: false,
                        },
                      },
                    },
                  },
                }}
              />
            </GraphLayout>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StringsTable;
