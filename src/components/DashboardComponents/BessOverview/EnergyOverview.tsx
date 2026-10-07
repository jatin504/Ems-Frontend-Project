import { useEffect, useMemo, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  MdBatteryChargingFull,
  MdOutlineBatteryChargingFull,
  MdTrendingUp,
  MdEco,
} from "react-icons/md";

import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import ColumnGraphNew from "../../Graphs/RevampCharts/ColumnGraphNew";
import WidgetTitle from "../../Common/WidgetTitle";

import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import type { ExportFunctions } from "../../../types/graphExport/export";
import type { TimeseriesDataSource } from "../../../types/timeseries/datasource";

const EnergyOverview = ({ isFullscreen: initialFullscreen = false }: { isFullscreen?: boolean }) => {
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);

  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "last",
    [1, "day"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 7,
        intervalType: "day",
      },
    }
  );

  const { data: socData, fetchData: fetchSoc } = useTimeseriesData();
  const { data: powerData, fetchData: fetchPower } = useTimeseriesData();

  const border = useColorModeValue(
    "rgba(0,0,0,.08)",
    "rgba(255,255,255,.08)"
  );

  const secondary = useColorModeValue(
    "secondaryText.light",
    "secondaryText.dark"
  );
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );

  console.log("fullscreen =", isFullscreen);

  const cards = [
    {
      title: "Charged Energy",
      value: "128.56",
      unit: "MWh",
      color: "#64D53A",
      icon: MdBatteryChargingFull,
    },
    {
      title: "Discharged Energy",
      value: "112.34",
      unit: "MWh",
      color: "#3BA5FF",
      icon: MdOutlineBatteryChargingFull,
    },
    {
      title: "Net Energy",
      value: "16.22",
      unit: "MWh",
      color: "#C94BFF",
      icon: MdTrendingUp,
    },
    {
      title: "CO₂ Saved",
      value: "25.64",
      unit: "t",
      color: "#45C854",
      icon: MdEco,
    },
  ];

  const orderBy: TimeseriesDataSource["orderBy"] = "ASC";

  const socFetch = useMemo<TimeseriesDataSource>(
    () => ({
      devices: {
  patterns: [],
  ids: ["plant_1_pcs_2_bank_bank_1"],
},

      keys: [
        {
          key: "soc",
          alias: "SoC (%)",
          keyType: "common",
        },
      ],

      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy,
    }),
    [timeWindow]
  );

  const powerFetch = useMemo<TimeseriesDataSource>(
    () => ({
      devices: {
        ids: ["plant_1_pcs_2_bank_bank_1"],
        patterns: [],
      },

      keys: [
        {
          key: "energy_charged_today",
          alias: "Charge",
          keyType: "common",
        },
        {
          key: "energy_discharged_today",
          alias: "Discharge",
          keyType: "common",
        },
      ],

      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy,
    }),
    [timeWindow]
  );

  useEffect(() => {
    fetchSoc(socFetch);
    fetchPower(powerFetch);
  }, [socFetch, powerFetch]);

  const mixedSeries = useMemo(() => {
    if (!socData || !powerData) return [];

    const series: Array<{
      type: string;
      name: string;
      data: Array<[number, number]>;
      yAxis: number;
      color: string;
      marker?: { enabled: boolean };
      lineWidth?: number;
      zIndex: number;
    }> = [];

    const socRoot = (socData.data ?? socData) as unknown as Record<string, Record<string, Array<{ ts: number; value: number }>>>;

    const socColors = [
      "#090cb2ff",
      "#16a34a",
      "#dc2626",
      "#7c3aed",
      "#ea580c",
      "#0891b2",
      "#be185d",
      "#65a30d",
      "#1d4ed8",
      "#b45309",
    ];

    Object.keys(socRoot).forEach((device, index) => {
      const pts = socRoot[device]?.["SoC (%)"] as Array<{ ts: number; value: number }> | undefined;

      if (Array.isArray(pts)) {
        series.push({
          type: "spline",
          name: "SOC",
          data: pts.map((p) => [p.ts, Number(p.value)]),
          yAxis: 1,
          color: socColors[index % socColors.length],
          marker: { enabled: false },
          lineWidth: 2,
          zIndex: 1,
        });
      }
    });

    const powerRoot = (powerData.data ?? powerData) as unknown as Record<string, Record<string, Array<{ ts: number; value: number }>>>;
    const dev = Object.keys(powerRoot)[0];

    if (dev) {
      const d = powerRoot[dev];

      const chargeSeries = d["Charge"] as Array<{ ts: number; value: number }> | undefined;
      const dischargeSeries = d["Discharge"] as Array<{ ts: number; value: number }> | undefined;

      if (Array.isArray(chargeSeries)) {
        series.push({
          type: "column",
          name: "Charge (MWh)",
          data: chargeSeries.map((p) => [p.ts, Number(p.value)]),
          yAxis: 0,
          color: "#64D53A",
          zIndex: 3,
        });
      }

      if (Array.isArray(dischargeSeries)) {
        series.push({
          type: "column",
          name: "Discharge (MWh)",
          data: dischargeSeries.map((p) => [p.ts, Number(p.value)]),
          yAxis: 0,
          color: "#3BA5FF",
          zIndex: 3,
        });
      }
    }

    return series;
  }, [socData, powerData]);

  const options = useMemo(
    () => ({
      xAxis: {
        type: "datetime",
        labels: { style: { color: subTextColor } },
        tickAmount: 6,
      },

      yAxis: [
        {
          title: { text: "" },
          labels: { style: { color: textColor } },
          gridLineColor: gridColor,
          tickAmount: 6,
        },
        {
          title: { text: "" },
          opposite: true,
          tickAmount: 6,
          labels: {
            style: {
              color: textColor,
              fontSize: "12px",
            },
          },
        },
      ],

      plotOptions: {
        column: {
          pointWidth: 16,
          borderRadius: 6,
          grouping: true,
        },
      },

      tooltip: {
        shared: true,
        backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"),
        style: { color: textColor },
      },

      legend: {
        align: "center",
        verticalAlign: "bottom",
        itemStyle: { color: textColor },
      },
    }),
    [gridColor, subTextColor, textColor]
  );
    return (
    <GraphLayout
      title={<WidgetTitle color={textColor}>Energy Overview</WidgetTitle>}
      width={["590px"]}
      height="320px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
      onFullscreenChange={setIsFullscreen}
    >
      <HStack
        align="stretch"
        spacing={3}
        h={isFullscreen ? "100%" : "255px"}
        px={2}
        w="100%"
        minW={0}
      >
        {/* Left Summary Cards */}

        {!isFullscreen && (
          <VStack
            w="175px"
            h="100%"
            spacing={2}
            align="stretch"
            justify="space-between"
          >
            {cards.map((item) => (
              <HStack
                key={item.title}
                spacing={3}
                p={2}
                border="1px solid"
                borderColor={border}
                borderRadius="10px"
                bg={useColorModeValue(
                  "gray.50",
                  "rgba(255,255,255,.03)"
                )}
              >
                <Circle
                  size="30px"
                  bg={`${item.color}20`}
                >
                  <Icon
                    as={item.icon}
                    color={item.color}
                    fontSize="18px"
                  />
                </Circle>

                <VStack
                  spacing={0}
                  align="start"
                  flex={1}
                >
                  <Text
                    fontSize="10px"
                    color={secondary}
                  >
                    {item.title}
                  </Text>

                  <HStack spacing={1}>
                    <Text
                      fontSize="16px"
                      fontWeight="700"
                    >
                      {item.value}
                    </Text>

                    <Text
                      fontSize="10px"
                      color={secondary}
                    >
                      {item.unit}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </VStack>
        )}

        {/* Graph */}

        <Box flex={1} h="100%" minW={0} w={isFullscreen ? "100%" : "auto"} overflow="hidden">
          <ColumnGraphNew
  key={isFullscreen ? "fullscreen" : "normal"}
  apiData={mixedSeries}
  height={isFullscreen ? window.innerHeight - 120 : 240}
  barWidth={isFullscreen ? 16 : 10}
barCategoryGap={isFullscreen ? "25%" : "40%"}
barGap={isFullscreen ? "5%" : "8%"}
borderRadius={6}
  onExportReady={setExportFunctions}
/>
        </Box>
      </HStack>
    </GraphLayout>
  );
  };

export default EnergyOverview;

