import { useEffect, useMemo, useRef, useState } from "react";
import { Box, useColorModeValue, HStack } from "@chakra-ui/react";
import { Select as ChakraSelect } from "chakra-react-select";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import SplineGraph from "../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
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

interface DeviceOption {
  id: string;
  label: string;

}

/* ================= CONSTANTS ================= */

const VOLTAGE_ALIAS = "Voltage (V)";
const CURRENT_ALIAS = "Current (A)";

const intervalToMs = (interval: number, unit: string) => {
  switch (unit) {
    case "second":
      return interval * 1000;
    case "minute":
      return interval * 60 * 1000;
    case "hour":
      return interval * 60 * 60 * 1000;
    default:
      return 60_000;
  }
}

const VoltAmpsCurve = () => {
  /* ================= TIME WINDOW ================= */
  const {
    config: timeWindow,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "avg",
    [1, "hour"],
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

  /* ================= STATE ================= */
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);

  const { data, fetchData } = useTimeseriesData();

  /* ================= BUILD DATA SOURCE ================= */
  const buildDataSource = () => ({
    devices: {
      patterns: ["_bank_bank_"],
      ids: [] as string[],
    },
    keys: [
      {
        key: "phase_a_voltage",
        alias: VOLTAGE_ALIAS,
        keyType: "common",
        type: "spline",
      },
      {
        key: "bcu_2_rack_current",
        alias: CURRENT_ALIAS,
        keyType: "common",
        type: "spline",
      },
    ],
    aggregation: timeWindowRef.current.aggregation,
    timeRange: timeWindowRef.current.timeRange,
    orderBy: timeWindowRef.current.orderBy,
  });

  /* ================= FETCH ON TIME WINDOW CHANGE ================= */
  useEffect(() => {
    fetchData(buildDataSource() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeWindow]);

  /* ================= AUTO REFRESH ================= */
  useEffect(() => {
    const { interval, intervalType } = timeWindow.timeRange;
    const refreshMs = intervalToMs(interval ?? 1, intervalType ?? "minute");

    const intervalId = setInterval(() => {
      fetchData(buildDataSource() as any);
    }, refreshMs);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    timeWindow.timeRange.interval,
    timeWindow.timeRange.intervalType,
  ]);

  /* ================= DEVICE OPTIONS ================= */
  useEffect(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) {
      setDeviceOptions([]);
      return;
    }

    const options: DeviceOption[] = Object.keys(widgetData).map((deviceId) => {
      const match = deviceId.match(/_bank_(\d+)$/);
      const suffix = match ? match[1] : "";
      return {
        id: deviceId,
        label: suffix ? `Inverter-${suffix}` : deviceId,
      };
    });

    options.sort((a, b) => a.label.localeCompare(b.label));
    setDeviceOptions(options);

    // Auto-select first device
    if (options.length > 0) {
      setSelectedDevice(options[0].id);
    }
  }, [data]);

  /* ================= RESET INVALID SELECTION ================= */
  useEffect(() => {
    if (
      selectedDevice !== "" &&
      !deviceOptions.find((d) => d.id === selectedDevice)
    ) {
      setSelectedDevice("");
    }
  }, [deviceOptions, selectedDevice]);

  /* ================= SERIES ================= */
  const seriesForChart = useMemo(() => {
    const widgetData = data as WidgetData | null;
    if (!widgetData) return [];

    const series: any[] = [];

    Object.keys(widgetData).forEach((deviceId) => {
      // Only show selected device
      if (selectedDevice && selectedDevice !== deviceId) return;

      const voltageArr = widgetData[deviceId]?.[VOLTAGE_ALIAS];
      const currentArr = widgetData[deviceId]?.[CURRENT_ALIAS];

      if (
        Array.isArray(voltageArr) &&
        Array.isArray(currentArr) &&
        voltageArr.length > 0 &&
        currentArr.length > 0
      ) {
        const points: any[] = [];
        const len = Math.min(voltageArr.length, currentArr.length);

        for (let i = 0; i < len; i++) {
          const voltage = Number(voltageArr[i].value);
          const current = Number(currentArr[i].value);

          if (!isNaN(voltage) && !isNaN(current)) {
            points.push([current, voltage]);
          }
        }

        if (points.length > 0) {
          const suffix = deviceId.match(/_bank_(\d+)$/)?.[1];
          const label = suffix ? `Volt-Amps-${suffix}` : "Volt-Amps";

          series.push({
            type: "spline",
            name: label,
            data: points,
            marker: { enabled: true },
          });
        }
      }
    });

    return series;
  }, [data, selectedDevice]);

  /* ================= STYLES ================= */

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue(
    "rgba(0,0,0,0.10)",
    "rgba(255,255,255,0.08)"
  );
  const axisLineColor = useColorModeValue(
    "rgba(0,0,0,0.16)",
    "rgba(255,255,255,0.06)"
  );

  const [exportFunctions, setExportFunctions] =
    useState<ExportFunctions | null>(null);

  /* ================= RENDER ================= */

  return (
    <GraphLayout
      title={
        <Box
          display="flex"
          alignItems="center"
          w="100%"
          gap={4}
        >
          <Box>Volt-Amps Curve</Box>

          <ChakraSelect
            isMulti={false}
            placeholder="Select Device"
            closeMenuOnSelect
            variant="flushed"
            focusBorderColor="#062D59"
            size="sm"
            chakraStyles={{
              valueContainer: (provided) => ({
                ...provided,
                fontSize: "10px",
                width: "140px",
              }),
              control: (prov) => ({
                ...prov,
                height: "24px",
                minBlockSize: "24px",
              }),
              menuList: (provided) => ({
                ...provided,
                maxHeight: "120px",
              }),
              option: (prov) => ({
                ...prov,
                height: "22px",
                fontSize: "10px",
              }),
            }}
            options={deviceOptions}
            onChange={(e) => {
              const val = (e?.value as string) || "";
              setSelectedDevice(val);
            }}
            selectedOptionColorScheme="green"
            value={deviceOptions.find((d) => d.id === selectedDevice)}
            ml="auto"
          />
        </Box>
      }
      width={["100%"]}
      height="100%"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={280}
        onExportReady={setExportFunctions}
        props={{
          chart: { zoomType: "xy" },

          plotOptions: {
            series: {
              lineWidth: 2,
              states: { inactive: { opacity: 1 } },
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },

          yAxis: [
            {
              title: { text: "Voltage (V)", style: { color: textColor } },
              tickAmount: 6,
              labels: { style: { color: textColor } },
              gridLineColor: gridColor,
            },
          ],

          xAxis: {
            type: "linear",
            title: { text: "Current (A)", style: { color: textColor } },
            crosshair: { color: "rgba(255,255,255,0.15)" },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineWidth: 0,
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },

          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),
            style: { color: textColor },
            formatter: function (this: any) {
              return `<b>Current:</b> ${this.point.x.toFixed(2)} A<br/><b>Voltage:</b> ${this.point.y.toFixed(2)} V`;
            },
          },
        }}
      />
    </GraphLayout>
  );
};

export default VoltAmpsCurve;
