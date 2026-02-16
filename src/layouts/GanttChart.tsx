import React, { useEffect, useRef, useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import Highcharts from 'highcharts/highstock';
import HighchartsGantt from 'highcharts/modules/gantt';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';

try { (HighchartsGantt as any)(Highcharts); } catch { (HighchartsGantt as any).default?.(Highcharts); }
try { (exporting as any)(Highcharts); } catch { (exporting as any).default?.(Highcharts); }
try { (exportData as any)(Highcharts); } catch { (exportData as any).default?.(Highcharts); }

interface ExportFunction { exportPNG: () => void; exportCSV: () => void; }
interface dataType { name: string; data: object[]; }
interface ganttChartType {
  height?: number; apiData?: dataType[] | []; props?: any; isFullscreen?: boolean; onExportReady?: (f: ExportFunction) => void;
}

const GanttChart: React.FC<ganttChartType> = ({ height = 1000, apiData, props, isFullscreen = false, onExportReady }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const bgColor = useColorModeValue('white', '#131512');
  const textColor = useColorModeValue('#062D59', 'rgba(255,255,255,0.92)');
  const gridColor = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.12)');
  const tooltipBG = useColorModeValue('rgba(255,255,255,0.95)', 'rgba(20,26,34,0.95)');
  const borderColor = useColorModeValue('#DFDFDF', 'rgba(255,255,255,0.08)');

  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      height: 200,
      backgroundColor: bgColor,
      className: 'hide-ticks dashed-border',
      style: { fontFamily: 'Montserrat, sans-serif', color: textColor },
    },
    title: { text: '' },
    tooltip: {
      backgroundColor: tooltipBG,
      borderColor,
      style: { color: textColor },
      formatter: function (this: any) {
        const start = Highcharts.dateFormat('%Y-%m-%d %H:%M', this.point.start);
        const end = Highcharts.dateFormat('%Y-%m-%d %H:%M', this.point.end);
        return `<b>${this.point.name}</b><br/>Start: ${start}<br/>End: ${end}`;
      },
    },
    xAxis: {
      type: 'datetime',
      opposite: false,
      gridLineWidth: 0,
      tickLength: 0,
      lineWidth: 0,
      tickInterval: 3600 * 1000 * 1,
      dateTimeLabelFormats: { hour: '%H' },
      labels: { style: { color: textColor, fontSize: '12px', fontWeight: 'bold' } },
    },
    yAxis: {
      gridLineColor: gridColor,
      gridLineDashStyle: 'Dash',
      labels: { style: { color: textColor, fontSize: '12px', fontWeight: '400' } },
    },
    series: [] as Object[],
    plotOptions: { series: { borderRadius: 0, opacity: 0.9, pointWidth: 23 } },
    exporting: { enabled: false },
    credits: { enabled: false },
  });

  useEffect(() => {
    setChartOptions((prev: any) => ({
      ...prev,
      chart: { ...prev.chart, height: 200, backgroundColor: bgColor, style: { ...prev.chart.style, color: textColor } },
      yAxis: { ...prev.yAxis, gridLineColor: gridColor },
      tooltip: { ...prev.tooltip, backgroundColor: tooltipBG, borderColor },
    }));
  }, [bgColor, textColor, gridColor, tooltipBG, borderColor]);

  useEffect(() => {
    if (apiData) {
      setChartOptions((prev: any) => ({
        ...prev,
        series: !isFullscreen ? [{ name: apiData[0]?.name, data: apiData[0]?.data.slice(0, 6) }] : apiData,
        ...(props || {}),
      }));
    }
  }, [apiData, props, isFullscreen]);

  const exportPNG = () => chartRef.current?.chart.exportChart({ type: 'image/png', filename: 'chart-png' }, {});
  const exportCSV = () => chartRef.current?.chart.downloadCSV();
  useEffect(() => { onExportReady?.({ exportPNG, exportCSV }); }, [onExportReady]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'ganttChart'}
      options={chartOptions}
      ref={chartRef}
    />
  );
};

export default GanttChart;
