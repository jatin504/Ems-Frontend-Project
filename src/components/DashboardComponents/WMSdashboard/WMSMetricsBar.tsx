// components/WMS/WMSMetricsBar.tsx
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";


import React, { useMemo, useEffect } from "react";
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

interface WMSMetricsBarProps {
  selectedWMS: string;
}

const WMSMetricsBar: React.FC<WMSMetricsBarProps> = ({ selectedWMS }) => {
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedWMS) return;
    fetchData({
      devices: {
        patterns: [],
        ids: [selectedWMS],
      },
      keys: [
        { key: "soc", alias: "soc", keyType: "common", type: "spline", color: "#ef4444" },
        { key: "rated_power", alias: "rated_power", keyType: "common", type: "spline", color: "#3b82f6" },
        { key: "phase_a_voltage", alias: "phase_a_voltage", keyType: "common", type: "spline", color: "#38BDF8" },
        { key: "bcu_2_energy_charged_today", alias: "bcu_2_energy_charged_today", keyType: "common", type: "spline", color: "#F59E42" },
        { key: "bcu_2_highest_pack_temperature", alias: "bcu_2_highest_pack_temperature", keyType: "common", type: "spline", color: "#F59E42" },
        { key: "bcu_2_lowest_pack_temperature", alias: "bcu_2_lowest_pack_temperature", keyType: "common", type: "spline", color: "#F59E42" },
        { key: "wind_speed", alias: "wind_speed", keyType: "common", type: "spline", color: "#F59E42" },
        { key: "wind_dir", alias: "wind_dir", keyType: "common", type: "spline", color: "#F59E42" },
      ],
      aggregation: {
        func: "avg",
        interval: 15,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "DESC",
    } as any);
  }, [selectedWMS]);

  const metrics = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData || !selectedWMS || !widgetData[selectedWMS]) {
      return {
        POA: 0,
        GHI: 0,
        CumPOA: 0,
        CumGHI: 0,
        AmbientTemp: 0,
        ModuleTemp: 0,
        WindSpeed: 0,
        WindDir: 0,
        PeakPOA: 0,
        PeakGHI: 0,
      };
    }
    const d = widgetData[selectedWMS];
    const latest = (arr?: WidgetPoint[]) => arr && arr.length > 0 ? arr[arr.length - 1].value : 0;
    return {
      POA: latest(d["soc"]), 
      GHI: latest(d["rated_power"]), 
      CumPOA: latest(d["phase_a_voltage"]), 
      CumGHI: latest(d["bcu_2_energy_charged_today"]),
      AmbientTemp: latest(d["bcu_2_highest_pack_temperature"]), 
      ModuleTemp: latest(d["bcu_2_lowest_pack_temperature"]), 
      WindSpeed: latest(d["wind_speed"]),
      WindDir: latest(d["wind_dir"]),
      PeakPOA: 0,
      PeakGHI: 0,
    };
  }, [data, selectedWMS]);

  return (
    <Box
      width="100%"
      height="259px"
      p="20px"
      bg={useColorModeValue("white", "#131512")}
      borderRadius="md"
    >
      <HStack
        color={useColorModeValue("#062D59", "#fff")}
        alignItems="flex-start"
      >
        {/* ===== COLUMN 1 ===== */}
        <Flex
          flexDir="column"
          height="219px"
          width="254px"
          pr="20px"
          borderRight="1px solid #DDE3E8"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.POA} unit="W/m2" label="POA" />
          <Metric value={metrics.AmbientTemp} unit="°C" label="Ambient Temp" />
          <Metric value={metrics.PeakPOA} unit="W/m2" label="Peak POA" />
        </Flex>

        {/* ===== COLUMN 2 ===== */}
        <Flex
          flexDir="column"
          height="219px"
          width="254px"
          pr="20px"
          borderRight="1px solid #DDE3E8"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.GHI} unit="W/m2" label="GHI" />
          <Metric value={metrics.ModuleTemp} unit="°C" label="Module Temp" />
          <Metric value={metrics.PeakGHI} unit="W/m2" label="Peak GHI" />
        </Flex>

        {/* ===== COLUMN 3 ===== */}
        <Flex
          flexDir="column"
          height="136px"
          width="254px"
          pr="20px"
          borderRight="1px solid #DDE3E8"
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.CumPOA} unit="kWh/m2" label="Cum. POA" />
          <Metric value={metrics.WindSpeed} unit="m/s" label="Wind Speed" />
        </Flex>

        {/* ===== COLUMN 4 ===== */}
        <Flex
          flexDir="column"
          height="136px"
          width="254px"
          pr="20px"
          gap="20px"
        >
          <Metric value={metrics.CumGHI} unit="kWh/m2" label="Cum. GHI" />
          <Metric value={metrics.WindDir} unit="°" label="Wind Dir" />
        </Flex>
      </HStack>
    </Box>
  );
};

/* ===== Reusable Metric UI ===== */

const Metric = ({
  value,
  unit,
  label,
}: {
  value: number | string;
  unit: string;
  label: string;
}) => {
  // Format value to 2 decimal places if it's a number
  let displayValue: string | number = value;
  if (typeof value === "number" && !isNaN(value)) {
    displayValue = value.toFixed(2);
  }
  return (
    <VStack spacing={0} alignItems="flex-start">
      <Flex alignItems="baseline" gap={1}>
        <Text fontWeight={700} fontSize="22px">
          {displayValue}
        </Text>
        <Text fontWeight={500} fontSize="14px">
          {unit}
        </Text>
      </Flex>
      <Text fontSize="14px" color="#9BABBD">
        {label}
      </Text>
    </VStack>
  );
};

export default WMSMetricsBar;
