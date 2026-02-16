import React, { useEffect, useRef, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Highcharts modules
// @ts-ignore
import Exporting from "highcharts/modules/exporting";
// @ts-ignore
import ExportData from "highcharts/modules/export-data";
// @ts-ignore
try { (Exporting as any)(Highcharts); } catch { (Exporting as any).default?.(Highcharts); }
try { (ExportData as any)(Highcharts); } catch { (ExportData as any).default?.(Highcharts); }

interface ExportFunction {
  exportPNG: () => void;
  exportCSV: () => void;
}

interface StripsPieChartType {
  apiData?: number[];
  names?: string[];
  height?: number;
  width?: number;
  props?: Highcharts.Options;
  color?: string[];
  onExportReady?: (functions: ExportFunction) => void;
}

const StripsPieChart: React.FC<StripsPieChartType> = ({
  apiData,
  names,
  height = 250,
  width,
  props,
  onExportReady,
  color = [
    "#704199",
    "#0086CC",
    "#66D1C9",
    "#F8931F",
    "#9b20d9",
    "#9215ac",
    "#861ec9",
    "#7a17e6",
    "#7010f9",
    "#691af3",
    "#6225ed",
    "#5b30e7",
    "#533be1",
    "#4c46db",
    "#4551d5",
    "#3e5ccf",
    "#3667c9",
    "#2f72c3",
    "#277dbd",
    "#1f88b7",
    "#1693b1",
    "#0a9eaa",
    "#03c69b",
    "#00f194",
  ],
}) => {
  // ✅ Correct ref typing
  const chartRef = useRef<HighchartsReact | null>(null);

  // Dark / light colors via Chakra
  const bgColor = useColorModeValue("white", "#131512");
  const textColor = useColorModeValue("#062D59", "rgba(255,255,255,0.92)");
  const tooltipBG = useColorModeValue(
    "rgba(255,255,255,0.95)",
    "rgba(20,26,34,0.95)"
  );
  const borderColor = useColorModeValue("#DFDFDF", "rgba(255,255,255,0.08)");

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: "pie",
      height,
      width: width || undefined,
      backgroundColor: bgColor,
    },
    title: { text: "" },
    accessibility: { point: { valueSuffix: "%" } },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
      backgroundColor: tooltipBG,
      borderColor,
      style: { color: textColor },
    },
    legend: { enabled: false },
    colors: color,
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 8,
        dataLabels: [
          { enabled: false, distance: 20, format: "{point.name}" },
          { enabled: false, distance: -15, format: "{point.percentage:.0f}%" },
        ],
        showInLegend: false,
      },
    },
    series: [],
    credits: { enabled: false },
    exporting: { enabled: false },
  });

  // Update dark-mode-dependent options
  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      chart: {
        ...(prev.chart as Highcharts.ChartOptions),
        backgroundColor: bgColor,
        height,
        width: width || undefined,
      },
      tooltip: {
        ...(prev.tooltip as Highcharts.TooltipOptions),
        backgroundColor: tooltipBG,
        borderColor,
        style: { color: textColor },
      },
    }));
  }, [bgColor, tooltipBG, borderColor, textColor, height, width]);

  // Feed data / extra props
  useEffect(() => {
    if (apiData && names) {
      const seriesData = apiData.map((v, i) => ({
        name: names[i],
        y: v,
        color: color[i],
      }));
      setChartOptions((prev) => ({
        ...prev,
        series: [
          {
            type: "pie",
            name: "Data",
            innerSize: "55%",
            colorByPoint: true,
            data: seriesData,
          },
        ],
        ...(props || {}),
      }));
    } else if (props) {
      setChartOptions((prev) => ({
        ...prev,
        ...(props || {}),
      }));
    }
  }, [apiData, names, props, color]);

  // Export helpers
  const exportPNG = () =>
    chartRef.current?.chart.exportChart(
      { type: "image/png", filename: "chart-png" },
      {}
    );
  const exportCSV = () => chartRef.current?.chart.downloadCSV();

  useEffect(() => {
    onExportReady?.({ exportPNG, exportCSV });
  }, [onExportReady]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chartOptions}
      ref={chartRef}
    />
  );
};

export default StripsPieChart;
