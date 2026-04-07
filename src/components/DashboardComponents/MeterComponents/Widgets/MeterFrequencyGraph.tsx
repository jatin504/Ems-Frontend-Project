import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";

import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import type { ExportFunctions } from "../../../types/graphExport/export";

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const FREQ_ALIAS = "Frequency";
const POWER_ALIAS = "Power";

const MeterFrequencyGraph: React.FC<{ selectedMeter: string }> = ({
  selectedMeter,
}) => {

  const [tabIndex, setTabIndex] = useState(0);
  const [graphHeight, setGraphHeight] = useState(200);
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const { data, fetchData } = useTimeseriesData();

  const { config: timeWindow, handleTimeWindowChange, handleReset } =
    useTimeHandle(
      12,
      "hour",
      "avg",
      [15, "minute"],
      60000,
      {
        timeRange: {
          type: "relative",
          relativeType: "currentDaySoFar",
        },
      }
    );

  /*  DATE STATE */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFullScreen, setIsFullScreen] = useState(false);

  const formattedDate = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(currentDate.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  }, [currentDate]);

  const isToday = useMemo(() => {
    const t = new Date();
    return (
      currentDate.getFullYear() === t.getFullYear() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getDate() === t.getDate()
    );
  }, [currentDate]);

  useEffect(() => {
    if (!selectedMeter) return;

    fetchData({
      devices: { patterns: [], ids: [selectedMeter] },
      keys: [
        {
          key: "soc",
          alias: FREQ_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#22c55e",
        },
        {
          key: "active_power",
          alias: POWER_ALIAS,
          keyType: "common",
          type: "spline",
          color: "#3b82f6",
        },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
  }, [timeWindow, selectedMeter]);

  /*  ABSOLUTE */
  const applyAbsoluteDay = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    handleTimeWindowChange({
      aggregation: timeWindow.aggregation,
      orderBy: "ASC",
      timeRange: {
        type: "absolute",
        startTs: start.getTime(),
        endTs: end.getTime(),
      },
    });
  };

  const goPrevDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;

    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);

      const today = new Date();

      const reachedToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();

      if (reachedToday) {
        handleReset();
      } else {
        applyAbsoluteDay(d);
      }

      return d;
    });
  };

  /*  HEIGHT FIX */
  useEffect(() => {
    const updateHeight = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullScreen(isFs);
      if (isFs) {
        setGraphHeight(window.innerHeight - 260);
      } else {
        setGraphHeight(240);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    document.addEventListener("fullscreenchange", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      document.removeEventListener("fullscreenchange", updateHeight);
    };
  }, []);

  const { frequencySeries, powerSeries } = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData || !selectedMeter)
      return { frequencySeries: [], powerSeries: [] };

    const deviceData = widgetData[selectedMeter];

    return {
      frequencySeries: [
        {
          type: "spline",
          name: `Frequency (Hz)`,
          data: (deviceData?.[FREQ_ALIAS] || []).map((p) => [p.ts, p.value]),
          marker: { enabled: true },
          color: "#22c55e",
        },
      ],
      powerSeries: [
        {
          type: "spline",
          name: `Power (kW)`,
          data: (deviceData?.[POWER_ALIAS] || []).map((p) => [p.ts, p.value]),
          marker: { enabled: true },
          color: "#3b82f6",
        },
      ],
    };
  }, [data, selectedMeter]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.1)",
    "rgba(255,255,255,0.08)"
  );

  const commonProps = {
    yAxis: {
      title: { text: null },
      labels: { style: { color: textColor } },
      gridLineColor: gridColor,
    },
    xAxis: {
      type: "datetime",
      labels: { style: { color: subTextColor } },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
    },
    tooltip: {
      shared: true,
      backgroundColor: useColorModeValue("#fff", "rgba(24,24,27,0.95)"),
      style: { color: textColor },
    },
  };

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          <Box fontWeight="600">Frequency vs PF</Box>

          <Box
            ml={isFullScreen ? "900px" : "130px"}
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>

            <Box fontSize="11px" fontWeight="600" minW="78px" textAlign="center">
              {formattedDate}
            </Box>

            <Box
              cursor={isToday ? "not-allowed" : "pointer"}
              opacity={isToday ? 0.35 : 1}
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>

        </Box>
      }
      width="100%"
      height="100%"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <Box h="100%" display="flex" flexDirection="column">
        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <TabList>
            <Tab>Frequency</Tab>
            <Tab>PF</Tab>
          </TabList>

          <TabPanels flex="1">
            <TabPanel p={0}>
              <SplineGraph
                apiData={frequencySeries}
                height={graphHeight}
                onExportReady={setExportFunctions}
                props={commonProps}
              />
            </TabPanel>

            <TabPanel p={0}>
              <SplineGraph
                apiData={powerSeries}
                height={graphHeight}
                onExportReady={setExportFunctions}
                props={commonProps}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </GraphLayout>
  );
};

export default MeterFrequencyGraph;