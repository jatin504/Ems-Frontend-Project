import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Circle,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";

import StripsPieChart from "../../Graphs/StripsPieChart";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface WidgetPoint {
  ts: number;
  value: number;
}
interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

type Props = {
  selectedDevice: string;
};

const stringRows = Array.from(
  { length: 24 },
  (_, i) => i + 1
);

const SummaryPieChart: React.FC<Props> = ({
  selectedDevice,
}) => {

  const { data, fetchData } = useTimeseriesData();

  const bg = useColorModeValue("white", "#071D36");
  const border = `1px solid ${useColorModeValue("#E6EEF2", "#173554")}`;

  useEffect(() => {

    if (!selectedDevice) return;

    const fetchSummaryData = () => {

      fetchData({
        devices: {
          patterns: [],
          ids: [selectedDevice],
        },

        keys: stringRows.map((index) => ({
          key: `string_${index}_current`,
          alias: `string_${index}_current`,
          keyType: "common",
        })),

        aggregation: {
          func: "last",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },

        orderBy: "DESC",
      } as any);

    };

    // INITIAL API HIT
    fetchSummaryData();

    // AUTO REFRESH EVERY 1 MIN
    const interval = setInterval(() => {

      fetchSummaryData();

    }, 60000);

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const summaryData = useMemo(() => {

    const widgetData =
      data as WidgetData | null;

    if (
      !widgetData ||
      !selectedDevice ||
      !widgetData[selectedDevice]
    ) {

      return {
        total: 24,
        online: 0,
        offline: 24,

        maxCurrent: 0,
        maxCurrentString: "---",

        minCurrent: 0,
        minCurrentString: "---",

        avgCurrent: 0,

        onlinePercent: "0",
        offlinePercent: "100",
      };
    }

    const d = widgetData[selectedDevice];

    const latest = (arr?: WidgetPoint[]) => {
      if (!arr?.length) return 0;
      const point = arr.reduce((a, b) => (a.ts > b.ts ? a : b));
      return Number(point.value ?? 0);
    };

    let online = 0;
    let offline = 0;

    stringRows.forEach((index) => {

      const value = latest(
        d[`string_${index}_current`]
      );

      if (value > 0) {
        online += 1;
      } else {
        offline += 1;
      }

    });

    const total = online + offline;

    const stringValues = stringRows.map((index) => {

      const value = latest(
        d[`string_${index}_current`]
      );

      return {
        name: `String ${index}`,
        value,
      };

    });

    const validStrings =
      stringValues.filter(
        (s) => s.value > 0
      );

    const maxString =
      validStrings.length > 0
        ? validStrings.reduce((a, b) =>
            (a.value > b.value ? a : b)
          )
        : { name: "---", value: 0 };

    const minString =
      validStrings.length > 0
        ? validStrings.reduce((a, b) =>
            (a.value < b.value ? a : b)
          )
        : { name: "---", value: 0 };

    const avgCurrent =
      validStrings.length > 0
        ?
          validStrings.reduce(
            (sum, s) => sum + s.value,
            0
          ) / validStrings.length
        : 0;

    // =========================
    // String Health LOGIC
    // =========================

    let good = 0;
    let warning = 0;
    let critical = 0;
    let healthOffline = 0;

    stringValues.forEach((s) => {

      // OFFLINE
      if (s.value <= 0) {
        healthOffline += 1;
        return;
      }

      // CURRENT %
      const currentPercent =
        maxString.value > 0
          ? (s.value / maxString.value) * 100
          : 0;

      // GOOD -> 100% to 90%
      if (currentPercent >= 90) {
        good += 1;
      }

      // WARNING -> 90% to 85%
      else if (
        currentPercent >= 85 &&
        currentPercent < 90
      ) {
        warning += 1;
      }

      // CRITICAL -> <85%
      else {
        critical += 1;
      }

    });

    return {

      total,
      online,
      offline,

      maxCurrent:
        maxString.value,

      maxCurrentString:
        maxString.name,

      minCurrent:
        minString.value,

      minCurrentString:
        minString.name,

      avgCurrent,

      deviation:
        maxString.value > 0
          ? (
              ((maxString.value -
                minString.value) /
                maxString.value) *
              100
            ).toFixed(1)
          : "0",

      onlinePercent:
        total > 0
          ? (
              (online / total) *
              100
            ).toFixed(1)
          : "0",

      offlinePercent:
        total > 0
          ? (
              (offline / total) *
              100
            ).toFixed(1)
          : "0",

      // =========================
      // String Health
      // =========================

      good,
      warning,
      critical,
      healthOffline,

      goodPercent:
        total > 0
          ? (
              (good / total) *
              100
            ).toFixed(1)
          : "0",

      warningPercent:
        total > 0
          ? (
              (warning / total) *
              100
            ).toFixed(1)
          : "0",

      criticalPercent:
        total > 0
          ? (
              (critical / total) *
              100
            ).toFixed(1)
          : "0",

      healthOfflinePercent:
        total > 0
          ? (
              (healthOffline / total) *
              100
            ).toFixed(1)
          : "0",

      stringHealthData: stringValues
        .map((s) => {

          // OFFLINE
          if (s.value <= 0) {
            return {
              name: s.name,
              current: s.value,
              percent: 0,
              status: "Offline",
              color: "#AAB2BD",
            };
          }

          const percent =
            maxString.value > 0
              ? (s.value / maxString.value) * 100
              : 0;

          // GOOD
          if (percent >= 90) {
            return {
              name: s.name,
              current: s.value,
              percent: Number(percent.toFixed(1)),
              status: "Good",
              color: "#72E66A",
            };
          }

          // WARNING
          if (percent >= 85) {
            return {
              name: s.name,
              current: s.value,
              percent: Number(percent.toFixed(1)),
              status: "Warning",
              color: "#F7B539",
            };
          }

          // CRITICAL
          return {
            name: s.name,
            current: s.value,
            percent: Number(percent.toFixed(1)),
            status: "Critical",
            color: "#FF6B57",
          };

        })
        .sort((a, b) => {
          const order: any = {
            Good: 1,
            Warning: 2,
            Critical: 3,
            Offline: 4,
          };

          return order[a.status] - order[b.status];
        }),
    };

  }, [data, selectedDevice]);

  const chartData = [
    {
      name: "Online",
      value: summaryData.online,
      color: "#7BEA72",
    },

    {
      name: "High Current Alarm",
      value: 0,
      color: "#F7B539",
    },

    {
      name: "Low Current Alarm",
      value: 0,
      color: "#FF6B57",
    },

    {
      name: "Offline",
      value: summaryData.offline,
      color: "#AAB2BD",
    },
  ];

  const legendData = [
    {
      name: "Online",
      value: `${summaryData.online} (${summaryData.onlinePercent}%)`,
      color: "#7BEA72",
    },

    {
      name: "High Current Alarm",
      value: "---",
      color: "#F7B539",
    },

    {
      name: "Low Current Alarm",
      value: "---",
      color: "#FF6B57",
    },

    {
      name: "Offline",
      value: `${summaryData.offline} (${summaryData.offlinePercent}%)`,
      color: "#AAB2BD",
    },
  ];

  return (
    <Box bg={bg} border={border} borderRadius="10px" p={4} h="95%">
      {/* String Summary */}

      <Text fontSize="13px" fontWeight="700" color={useColorModeValue("gray.800", "white")} mb={4}>
        String Summary
      </Text>

      <Flex align="center">
        {/* PIE CHART */}
        <Box
          w="120px"
          h="100px"
          position="relative"
        >
          <StripsPieChart
            apiData={chartData.map((d) => d.value)}
            names={chartData.map((d) => d.name)}
            height={100}
            color={chartData.map((d) => d.color)}
            props={{
              chart: {
                backgroundColor: "transparent",
              },

              plotOptions: {
  pie: {
    size: 95,
    innerSize: "89%",
    borderWidth: 0,
    dataLabels: {
      enabled: false,
    },
  },
},
              tooltip: {
                enabled: false,
              },

              credits: {
                enabled: false,
              },
            }}
          />

          {/* CENTER TEXT */}
          <Flex
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            direction="column"
            align="center"
            justify="center"
          >
            <Text fontSize="22px" fontWeight="700" color={useColorModeValue("gray.800", "white")} lineHeight="22px">
              {summaryData.total}
            </Text>

            <Text fontSize="10px" color={useColorModeValue("#7B92AA", "#7B92AA")} mt="2px" whiteSpace="nowrap">
              Total Strings
            </Text>
          </Flex>
        </Box>

        {/* LEGEND */}
        <VStack
          align="start"
          spacing={3}
          ml={3}
          flex="1"
        >
          {legendData.map((item, i) => (
            <HStack
              key={i}
              justify="space-between"
              w="100%"
            >
              <HStack spacing={2}>
                <Circle
                  size="10px"
                  bg={item.color}
                />

                  <Text fontSize="12px" color={useColorModeValue("gray.800", "white")}>{item.name}</Text>
              </HStack>
                <Text fontSize="11px" color={useColorModeValue("gray.800", "white")} fontWeight="600">
                {item.value}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Flex>

      {/* DIVIDER */}
      <Box
        h="1px"
        bg="#173554"
        my={2}
      />

      {/* ===================== */}
      {/* String Status */}
      {/* ===================== */}

      <Text
        fontSize="11px"
        fontWeight="700"
        color={useColorModeValue("gray.800", "white")}
        mb={2}
      >
        String Status
      </Text>

      <Grid
        templateColumns="repeat(4,1fr)"
        gap={4}
      >
        <Box>
          <Text
            fontSize="10px"
            color="#7B92AA"
          >
            Max Current
          </Text>

          <Text
            mt={1}
            fontSize="20px"
            fontWeight="700"
            color="#72E66A"
            lineHeight="22px"
          >
            {summaryData.maxCurrent.toFixed(1)}
            <Text
              as="span"
              fontSize="12px"
            >
              {" "}
              A
            </Text>
          </Text>

          <Text
            mt={2}
            fontSize="10px"
            color="#7B92AA"
          >
            {summaryData.maxCurrentString}
          </Text>
        </Box>

        <Box>
          <Text
            fontSize="10px"
            color="#7B92AA"
          >
            Min Current
          </Text>

          <Text
            mt={1}
            fontSize="20px"
            fontWeight="700"
            color="#4DA6FF"
            lineHeight="22px"
          >
            {summaryData.minCurrent.toFixed(1)}
            <Text
              as="span"
              fontSize="12px"
            >
              {" "}
              A
            </Text>
          </Text>

          <Text
            mt={2}
            fontSize="10px"
            color="#7B92AA"
          >
            {summaryData.minCurrentString}
          </Text>
        </Box>

        <Box>
          <Text
            fontSize="10px"
            color="#7B92AA"
          >
            Avg Current
          </Text>

          <Text
            mt={1}
            fontSize="20px"
            fontWeight="700"
            color="#4DA6FF"
            lineHeight="22px"
          >
            {summaryData.avgCurrent.toFixed(1)}
            <Text
              as="span"
              fontSize="12px"
            >
              {" "}
              A
            </Text>
          </Text>
        </Box>

        <Box>
          <Text
            fontSize="10px"
            color="#7B92AA"
          >
            Deviation
          </Text>

          <Text
            mt={1}
            fontSize="20px"
            fontWeight="700"
            color="#4DA6FF"
            lineHeight="22px"
          >
            {summaryData.deviation}
            <Text
              as="span"
              fontSize="12px"
            >
              {" "}
              %
            </Text>
          </Text>
        </Box>
      </Grid>

      {/* DIVIDER */}
      <Box
        h="1px"
        bg="#173554"
        my={2}
      />

      {/* ===================== */}
      {/* String Health */}
      {/* ===================== */}

      <Text
        fontSize="13px"
        fontWeight="700"
        color={useColorModeValue("gray.800", "white")}
        mb={2}
      >
        String Health
      </Text>

      {/* HEALTH BAR */}
      <Flex
        h="16px"
        borderRadius="4px"
        overflow="hidden"
        mb={2}
        mt={-2}
      >
        {summaryData.stringHealthData?.map(
          (item: any, index: number) => (
            <Box
              key={index}
              flex="1"
              bg={item.color}
              borderRight={
                index !==
                summaryData.stringHealthData.length - 1
                  ? "1px solid #071D36"
                  : "none"
              }
              cursor="pointer"
              title={`${item.name}\nCurrent : ${item.current.toFixed(1)} A\nHealth : ${item.percent}%\nStatus : ${item.status}`}
            />
          )
        )}
      </Flex>

      {/* HEALTH LEGEND */}
      <Grid
        templateColumns="repeat(4,1fr)"
        gap={4}
        mt={-2}
      >
        <HStack spacing={2}>
          <Circle
            size="10px"
            bg="#72E66A"
          />

          <Box>
            <Text
              fontSize="12px"
              color={useColorModeValue("gray.800", "white")}
            >
              Good
            </Text>

            <Text
              fontSize="11px"
              color="#7B92AA"
            >
              {summaryData.good} ({summaryData.goodPercent}%)
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Circle
            size="10px"
            bg="#F7B539"
          />

          <Box>
            <Text
              fontSize="12px"
              color={useColorModeValue("gray.800", "white")}
            >
              Warning
            </Text>

            <Text
              fontSize="11px"
              color="#7B92AA"
            >
              {summaryData.warning} ({summaryData.warningPercent}%)
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Circle
            size="10px"
            bg="#FF6B57"
          />

          <Box>
            <Text
              fontSize="12px"
              color={useColorModeValue("gray.800", "white")}
            >
              Critical
            </Text>

            <Text
              fontSize="11px"
              color="#7B92AA"
            >
              {summaryData.critical} ({summaryData.criticalPercent}%)
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Circle
            size="10px"
            bg="#AAB2BD"
          />

          <Box>
            <Text
              fontSize="12px"
              color={useColorModeValue("gray.800", "white")}
            >
              Offline
            </Text>

            <Text
              fontSize="11px"
              color="#7B92AA"
            >
              {summaryData.healthOffline} ({summaryData.healthOfflinePercent}%)
            </Text>
          </Box>
        </HStack>
      </Grid>
    </Box>
  );
};

export default SummaryPieChart;