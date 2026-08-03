import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
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

type ModuleRow = {
  id: string;
  maxTemp: string;
  maxVolt: string;
  current: string;
  volt: string;
};

export default function ModulesTable() {
  const [rows, setRows] = useState<ModuleRow[]>([]);
  const [deviceIdMap, setDeviceIdMap] = useState<Record<string, string>>({});
  const [selectedRawDeviceId, setSelectedRawDeviceId] = useState<string>("");

  const cardBg = useColorModeValue("#ffffff", "#161B1B");
  const cardBorder = useColorModeValue("#e5e7eb", "#1c2635");
  const headingColor = useColorModeValue("#0f172a", "gray.300");
  const textColor = useColorModeValue("#0f172a", "gray.300");
  const zebra = useColorModeValue("#f8fafc", "#FFFFFF0F");

  const { data: tableTimeseriesData, fetchData: fetchTableData } = useTimeseriesData();
  const { data: chartTimeseriesData, fetchData: fetchChartData } = useTimeseriesData();
  const { config: timeWindow } = useTimeHandle(
    12,
    "hour",
    "avg",
    [1, "hour"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 12,
        intervalType: "hour",
      },
    }
  );

    const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");

  const openChartModal = (displayId: string, rawDeviceId?: string) => {
    setSelectedModuleId(displayId);
    setSelectedRawDeviceId(rawDeviceId || "");
    console.log("Selected Device:", rawDeviceId);
    onOpen();
  };

  useEffect(() => {
    fetchTableData({
      devices: {
        patterns: ["rack_rack_"],
        ids: [],
      },
      keys: [
        {
          key: "voltage",
          alias: "Volt",
          keyType: "common",
        },
        {
          key: "current",
          alias: "Current",
          keyType: "common",
        },
        {
          key: "max_cell_temperature",
          alias: "max_temp",
          keyType: "common",
        },
        {
          key: "max_cell_voltage",
          alias: "max_volt",
          keyType: "common",
        },
      ],
      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },
      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "minute",
      },
      orderBy: "ASC",
    } as any);
  }, []);

  useEffect(() => {
    if (!tableTimeseriesData || typeof tableTimeseriesData !== "object") {
      setRows([]);
      setDeviceIdMap({});
      return;
    }

    const idMap: Record<string, string> = {};
    const mapped: ModuleRow[] = Object.entries(tableTimeseriesData).map(
      ([deviceId, deviceObj]) => {
        let name = deviceId;
        const rackMatch = deviceId.match(/rack_rack_(\d+)/i);
        if (rackMatch) {
          name = `Rack-${rackMatch[1]}`;
        }

        idMap[name] = deviceId;

        const getLast = (keyName: string) => {
          const points = deviceObj?.[keyName] || [];
          if (!Array.isArray(points) || points.length === 0) return "--";
          const last = points[points.length - 1];
          return last?.value !== undefined && last?.value !== null
            ? typeof last.value === "number"
              ? last.value.toFixed(2)
              : String(last.value)
            : "--";
        };

        const formatValue = (value: string, unit: string) =>
          value === "--" ? value : `${value} ${unit}`;

        return {
          id: name,
          maxTemp: formatValue(getLast("max_temp"), "°C Max."),
          maxVolt: formatValue(getLast("max_volt"), "V Max."),
          current: formatValue(getLast("Current"), "A"),
          volt: formatValue(getLast("Volt"), "V"),
        };
      }
    );

    setDeviceIdMap(idMap);
    setRows(mapped);
  }, [tableTimeseriesData]);

  useEffect(() => {
    if (!isOpen || !selectedRawDeviceId) return;

    const dataSource = {
      devices: {
        patterns: [],
        ids: [selectedRawDeviceId],
      },
      keys: [
        { key: "current", alias: "Current", keyType: "common" },
        { key: "voltage", alias: "Volt", keyType: "common" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any;

    fetchChartData(dataSource);
  }, [isOpen, selectedRawDeviceId, timeWindow.aggregation, timeWindow.timeRange, timeWindow.orderBy]);

  useEffect(() => {
    console.log(chartTimeseriesData);
  }, [chartTimeseriesData]);

  const getChartSeriesData = () => {
    if (!chartTimeseriesData || typeof chartTimeseriesData !== "object") return [];

    const allSeries: any[] = [];

    Object.entries(chartTimeseriesData).forEach(([deviceKey, deviceObj]) => {
      if (typeof deviceObj === "object" && deviceObj !== null) {
        const currentData = deviceObj["Current"];
        const voltData = deviceObj["Volt"];

        if (currentData !== undefined && currentData !== null) {
          const dataPoints = Array.isArray(currentData)
            ? currentData.map((p: any) => [p.ts, p.value])
            : typeof currentData === "object" && "value" in currentData
            ? [[Date.now(), currentData.value]]
            : [];
          if (dataPoints.length > 0) {
            allSeries.push({
              name: "Current",
              data: dataPoints,
              color: "#3182ce",
            });
          }
        }

        if (voltData !== undefined && voltData !== null) {
          const dataPoints = Array.isArray(voltData)
            ? voltData.map((p: any) => [p.ts, p.value])
            : typeof voltData === "object" && "value" in voltData
            ? [[Date.now(), voltData.value]]
            : [];
          if (dataPoints.length > 0) {
            allSeries.push({
              name: "Volt",
              data: dataPoints,
              color: "#ed8936",
            });
          }
        }
      }
    });

    return allSeries;
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="12px"
      p={4}
      border={`1px solid ${cardBorder}`}
      w="1220px"
      h="534px"
      opacity={1}
    >
      <Heading as="h3" size="sm" color={headingColor} mb={3}>
        Modules
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
          <Tbody color={textColor}>
            {rows.map((m, idx) => (
              <Tr key={m.id} bg={idx % 2 === 0 ? zebra : undefined}>
                <Td fontWeight="semibold" color={textColor}>
                  {m.id}
                </Td>
                <Td color={textColor}>{m.maxTemp}</Td>
                <Td color={textColor}>{m.maxVolt}</Td>
                <Td color={textColor}>{m.current}</Td>
                <Td color={textColor}>{m.volt}</Td>
                <Td>
                  <IconButton
                    aria-label="View chart"
                    icon={<BsThreeDots />}
                    size="sm"
                    variant="ghost"
                    onClick={() => openChartModal(m.id, deviceIdMap[m.id])}
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
          <ModalHeader color={textColor} fontSize="sm" fontWeight="600" pb={1} _hover={{ color: textColor }}>
            {selectedModuleId}
          </ModalHeader>
          <ModalCloseButton color={textColor} size="sm" _hover={{ color: textColor }} />
          <ModalBody pb={2} px={2}>
            <GraphLayout
              title=""
              width={["100%"]}
              height="360px"
              bg={cardBg}
              fullScreen={false}
              downloadOption={false}
              timeWindow={false}
            >
              <SplineGraph
                apiData={getChartSeriesData()}
                height={320}
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
}
