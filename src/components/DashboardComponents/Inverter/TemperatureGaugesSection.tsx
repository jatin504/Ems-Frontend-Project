import React, { useEffect, useMemo, useRef } from "react";
import { Box, Grid, useColorModeValue } from "@chakra-ui/react";
import ExactTempGauge from "./ExactTempGauge";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

interface TemperatureGaugesSectionProps {
  deviceId: string;
}

const intervalToMs = (value?: number, unit?: string) => {
  if (!value || !unit) return 60_000;

  switch (unit) {
    case "second":
      return value * 1000;
    case "minute":
      return value * 60 * 1000;
    case "hour":
      return value * 60 * 60 * 1000;
    default:
      return 60_000;
  }
};

const TemperatureGaugesSection: React.FC<TemperatureGaugesSectionProps> = ({
  deviceId,
}) => {
  const cardBg = useColorModeValue("white", "#161B1B");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  const { config: timeWindow } = useTimeHandle(
    1,
    "hour",
    "last",
    [1, "minute"],
    60000,
    {
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
        interval: 1,
        intervalType: "minute",
      },
    }
  );

  const timeWindowRef = useRef(timeWindow);
  useEffect(() => {
    timeWindowRef.current = timeWindow;
  }, [timeWindow]);

  const { data, fetchData } = useTimeseriesData();

  const fetchTempData = () => {
    if (!deviceId) return;

    fetchData({
      devices: {
        ids: [deviceId],
        patterns: [],
      },
      keys: [
        { key: "bcu_2_lowest_pack_temperature", alias: "Cabinet Temp", keyType: "common" },
        { key: "dcdc1_bus_side_voltage", alias: "IGBT Temp 1", keyType: "common" },
        { key: "bcu_1_rack_current", alias: "IGBT Temp 2", keyType: "common" },
        { key: "bcu_2_pack_with_lowest_temperature", alias: "IGBT Temp 3", keyType: "common" },
      ],
      aggregation: timeWindowRef.current.aggregation,
      timeRange: timeWindowRef.current.timeRange,
      orderBy: "ASC"   //timeWindowRef.current.orderBy,
    } as any);
  };

  useEffect(() => {
    fetchTempData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, timeWindow]);

  useEffect(() => {
    const refreshMs = intervalToMs(
      timeWindow.timeRange.interval,
      timeWindow.timeRange.intervalType
    );

    const id = setInterval(() => {
      fetchTempData();
    }, refreshMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deviceId,
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  const values = useMemo(() => {
    if (!data) return {};

    const deviceData = data[deviceId];
    if (!deviceData) return {};

    const lastVal = (alias: string) => {
      const arr = deviceData[alias];
      if (!arr || !arr.length) return undefined;
      const v = arr[arr.length - 1]?.value;
      return typeof v === "number" ? Number(v.toFixed(1)) : undefined;
    };

    return {
      cabinet: lastVal("Cabinet Temp"),
      igbt1: lastVal("IGBT Temp 1"),
      igbt2: lastVal("IGBT Temp 2"),
      igbt3: lastVal("IGBT Temp 3"),
    };
  }, [data, deviceId]);

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      borderRadius="8px"
      p={4}
      alignSelf="flex-start"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <ExactTempGauge title="Cabinet Temp (°C)" value={values.cabinet} />
        <ExactTempGauge title="IGBT Temp 1 (°C)" value={values.igbt1} />
        <ExactTempGauge title="IGBT Temp 2 (°C)" value={values.igbt2} />
        <ExactTempGauge title="IGBT Temp 3 (°C)" value={values.igbt3} />
      </Grid>
    </Box>
  );
};

export default TemperatureGaugesSection;
