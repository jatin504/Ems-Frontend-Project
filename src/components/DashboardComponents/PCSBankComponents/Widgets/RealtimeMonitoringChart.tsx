import { useColorModeValue, Text } from "@chakra-ui/react";
import ErrorBoundary from "../../../Errors/ErrorBoundary";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useEffect, useMemo, useState } from "react";
import { transformToHighchartsTimeSeries } from "../../../../Services/APIDataFormatter/TimeseriesGraphs";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import type { ExportFunctions } from "../../../../types/graphExport/export";
import { useNavigate, useLocation } from "react-router-dom";

// [
//   { type: "spline", name: "Max Module Temp", color: "#4F8BFF", yAxis: 0, data: tempMax, marker: { enabled: true }, tooltip: { valueSuffix: " °C" } },
//   { type: "spline", name: "Min Module Temp", color: "#7ED957", yAxis: 0, data: tempMin, marker: { enabled: true }, tooltip: { valueSuffix: " °C" } },
//   { type: "spline", name: "Max String Voltage", color: "#F6AD55", yAxis: 1, data: stringVoltage, marker: { enabled: true }, tooltip: { valueSuffix: " V" } },
// ]

interface RealtimeMonitoringChartProps {
  bankId: string;
}

// ✅ BANK ID → DB DEVICE ID
function buildBankDeviceId(bankId: string) {
  // pcs_2_bank_2 → plant_1_pcs_2_bank_bank_2
  const match = bankId.match(/pcs_(\d+)_bank_(\d+)/);
  if (!match) return null;

  const [, pcs, bank] = match;
  return `plant_1_pcs_${pcs}_bank_bank_${bank}`;
}

const RealtimeMonitoringChart: React.FC<RealtimeMonitoringChartProps> = ({ bankId }) => {

  const {
    config: timeWindowMonitoring,
    handleTimeWindowChange: handleTimeWindowMonitoringChange,
    handleReset: MonitoringHandleReset,
  } = useTimeHandle(
    12,
    'hour',
    'avg',
    [15, 'minute'],
    60000,
    {
      timeRange: {
        type: 'relative',
        relativeType: 'currentDaySoFar',
        interval: 1,
        intervalType: "hour"
      },
    }
  );

  const deviceId = buildBankDeviceId(bankId);

  // BANK BASED DEVICE ID (FIXED)
  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: [],
        ids: deviceId ? [deviceId] : [],
      },
      keys: [
        {
          key: 'soc',
          alias: 'Current (A)',
          keyType: 'individual',
          type: "spline",
          color: "#4F8BFF"
        },
        {
          key: 'bcu_1_lowest_pack_voltage',
          alias: 'Voltage (V)',
          keyType: 'individual',
          type: "spline",
          color: "#7ED957"
        },
        {
          key: 'bcu_1_highest_pack_temperature',
          alias: 'Temp (°C)',
          keyType: 'individual',
          type: "spline",
          color: "#F6AD55",
          yAxis: 1
        },
        // Add more keys as needed
      ],
      aggregation: timeWindowMonitoring.aggregation,
      timeRange: timeWindowMonitoring.timeRange,
      orderBy: timeWindowMonitoring.orderBy,
    },
  };

  // Fetch data using new hook
  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (deviceId) {
      fetchData(fetchingToServerObj.dataSource);
    }
  }, [timeWindowMonitoring, deviceId]);

  // Light / Dark mode values
  const textColor = useColorModeValue("#1A202C", "#E6E6E6");
  const subTextColor = useColorModeValue("#4A5568", "#B9B9B9");
  const gridColor = useColorModeValue("rgba(0,0,0,0.10)", "rgba(255,255,255,0.08)");
  const axisLineColor = useColorModeValue("rgba(0,0,0,0.16)", "rgba(255,255,255,0.06)");

  const [exportFunctions, setExportFunctions] = useState<ExportFunctions | null>(null);

  const seriesForChart = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    const allSeries: any[] = [];
    Object.entries(data).forEach(([deviceKey, deviceObj]) => {
      if (typeof deviceObj === "object" && deviceObj !== null) {
        Object.entries(deviceObj).forEach(([metric, points]) => {
          if (Array.isArray(points) && points.length > 0) {
            allSeries.push({
              type: "spline",
              name: metric,
              data: points.map((p: any) => [p.ts, p.value]),
              marker: { enabled: true },
              yAxis: metric === "Temp (°C)" ? 1 : 0,
            });
          }
        });
      }
    });
    return allSeries;
  }, [data]);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <GraphLayout
      title="Real Time Monitoring"
      width={["930px"]}
      height="534px"
      fullScreen
      downloadOption
      WidgetProps={{
        mt: "0",
        gap: "12px",
        opacity: 1,
        transform: "rotate(0deg)",
        borderRadius: "12px",
        pl: "16px",
        pr: "16px",
      }}
      timeWindow
      onTimeWindowChange={(config) => handleTimeWindowMonitoringChange(config)}
      onReset={MonitoringHandleReset}
      onExport={exportFunctions}
    >
      {/* <ErrorBoundary> */}
      <SplineGraph
        apiData={seriesForChart}
        height={458} // 534 - header/legend spacing
        onExportReady={setExportFunctions}
        props={{
          yAxis: [
            {
              tickAmount: 6,
              title: { text: null },
              labels: { style: { color: textColor } },
              gridLineColor: gridColor,
            },
            {
              tickAmount: 6,
              title: { text: null },
              gridLineColor: gridColor,
              opposite: true,
              labels: {
                style: { color: textColor, fontSize: "11px" },
              },
            },
          ],
          xAxis: {
            type: "datetime",
            crosshair: { color: 'rgba(255,255,255,0.15)', width: 1 },
            labels: { style: { color: subTextColor } },
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "dashed",
            gridLineWidth: 0,
          },
          tooltip: {
            shared: true,
            backgroundColor: useColorModeValue("#fff", 'rgba(24,24,27,0.95)'),
            style: { color: textColor },
          },
          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
          series: seriesForChart,
        }}
      />
      {/* </ErrorBoundary> */}
    </GraphLayout>
  );
};

export default RealtimeMonitoringChart;
