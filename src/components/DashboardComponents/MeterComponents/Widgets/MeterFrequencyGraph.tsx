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

/* ================= TYPES ================= */

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

/* ================= CONSTANTS ================= */

const FREQ_ALIAS = "Frequency";
const POWER_ALIAS = "Power";

/* ================= COMPONENT ================= */

const MeterFrequencyGraph: React.FC<{ selectedMeter: string }> = ({
  selectedMeter,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [graphHeight, setGraphHeight] = useState(200);
  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  const { data, fetchData } = useTimeseriesData();

  /* ---------- Time window ---------- */
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

  /* ================= API CALL ================= */
  useEffect(() => {
    if (!selectedMeter) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedMeter],
      },
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

  /* ================= FULLSCREEN HEIGHT FIX ================= */
  useEffect(() => {
    const updateHeight = () => {
      if (document.fullscreenElement) {
        // fullscreen height
        setGraphHeight(window.innerHeight - 260);
      } else {
        // normal card height
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

  /* ================= SERIES MAP ================= */
  const { frequencySeries, powerSeries } = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData || !selectedMeter)
      return { frequencySeries: [], powerSeries: [] };

    const deviceData = widgetData[selectedMeter];
    if (!deviceData)
      return { frequencySeries: [], powerSeries: [] };

    return {
      frequencySeries: [
        {
          type: "spline",
          name: `Frequency (Hz)`,
          data: (deviceData[FREQ_ALIAS] || []).map((p) => [p.ts, p.value]),
          marker: { enabled: true },
          color: "#22c55e",
        },
      ],
      powerSeries: [
        {
          type: "spline",
          name: `Power (kW)`,
          data: (deviceData[POWER_ALIAS] || []).map((p) => [p.ts, p.value]),
          marker: { enabled: true },
          color: "#3b82f6",
        },
      ],
    };
  }, [data, selectedMeter]);

  /* ================= THEME ================= */

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
      backgroundColor: useColorModeValue("#fff", 'rgba(24,24,27,0.95)'),
      style: { color: textColor },
    },
  };

  /* ================= RENDER ================= */

  return (
    <GraphLayout
      title="Frequency vs PF"
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
