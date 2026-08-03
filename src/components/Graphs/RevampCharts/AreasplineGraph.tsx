import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import HighchartsFullScreen from 'highcharts/modules/full-screen';
import { EnlargeHeight } from '../../../Services/EnlargeWidget';
import type { ExportFunctions } from '../../../types/graphExport/export';
import { useColorModeValue } from '@chakra-ui/react';

HighchartsFullScreen(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

interface AreaspineGraphProps {
  apiData?: Object[];
  height?: number | string;
  bg?: string;
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  onExportReady?: (functions: ExportFunctions) => void;
  inFullScreen?: (mode: boolean) => void;

  /** 🔑 OPT-IN ONLY (default false) */
  enableMultiAxis?: boolean;
}

const AreaspineGraph = React.forwardRef<
  HighchartsReact.RefObject,
  AreaspineGraphProps
>(
  (
    {
      apiData,
      height = 240,
      xAxisInterval = 'auto',
      legendHeight = 45,
      bg,
      props,
      isFullscreen = false,
      onExportReady,
      inFullScreen,
      enableMultiAxis = false, //  default = old behaviour
    },
    ref
  ) => {
    const chartRef = useRef<HighchartsReact.RefObject>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const axisLabelStyle = { color: useColorModeValue('#1A202C', '#E6E6E6'), fontSize: '12px' as const };
    const gridColor = useColorModeValue('rgba(0,0,0,0.10)', 'rgba(255,255,255,0.08)');

    const baseSeriesOpts: Highcharts.SeriesAreasplineOptions = {
      type: 'areaspline',
      lineWidth: 2,
      marker: {
        enabled: true,
        radius: 4,
        lineWidth: 2,
        lineColor: '#FFFFFF',
        symbol: 'circle',
      },
      states: {
        hover: { lineWidth: 2 },
        inactive: { opacity: 1 },
      },
      fillOpacity: 0.15,
      tooltip: { valueDecimals: 0 },
    };

    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
      chart: {
        backgroundColor: bg || 'transparent',
        height: height as number,
        zoomType: 'x',
        spacingTop: 8,
        spacingRight: 12,
        className: 'rounded-lg',
      },
      title: { text: '' },
      credits: { enabled: false },

      xAxis: {
        type: 'datetime',
        tickInterval: xAxisInterval as number,
        gridLineWidth: 1,
        gridLineColor: gridColor,
        gridLineDashStyle: 'ShortDot',
        labels: { style: axisLabelStyle },
      },

      /** DEFAULT yAxis (OLD BEHAVIOUR) */
      yAxis: enableMultiAxis
  ? (
      Array.isArray(props?.yAxis) && props.yAxis.length > 0
        ? props.yAxis                    
        : [
            { title: { text: '' } },     
            { title: { text: '' } },     
          ]
    )
  : {
      title: { text: '' },
      gridLineColor: gridColor,
      labels: { style: axisLabelStyle },
    },


      legend: {
        align: 'left',
        verticalAlign: 'bottom',
        maxHeight: legendHeight,
        itemStyle: { color: useColorModeValue('#1A202C', '#E6E6E6'), fontSize: '12px' },
      },

      tooltip: {
        shared: true,
        backgroundColor: 'rgba(24,24,27,0.95)',
        style: { color: '#fff' },
        xDateFormat: '%Y-%m-%d %H:%M:%S',
      },

      plotOptions: {
        series: { animation: { duration: 300 } },
        areaspline: { ...baseSeriesOpts },
      },

      series: (apiData as any[]) || [],
      exporting: { enabled: false },
    });

    /** Fullscreen height handling */
    useEffect(() => {
      if (inFullScreen) inFullScreen(isFullscreen);
      const newHeight = isFullscreen ? EnlargeHeight(770) : height;
      setChartOptions((prev) => ({
        ...prev,
        chart: { ...prev.chart, height: newHeight },
      }));
    }, [isFullscreen, height]);

    /** SAFE props merge (multi-axis opt-in only) */
    useEffect(() => {
      if (!props) return;

      setChartOptions((prev) => ({
        ...prev,
        ...props,
        yAxis: enableMultiAxis ? props.yAxis ?? prev.yAxis : prev.yAxis,
      }));
    }, [props, enableMultiAxis]);

    /** Series styling */
    useEffect(() => {
      if (!apiData) return;

      const styled = (apiData as Highcharts.SeriesOptionsType[]).map(
        (s: any) => {
          const color = s.color || '#6DA2FF';
          const fill = {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, Highcharts.color(color).setOpacity(0.25).get('rgba') as any],
              [1, Highcharts.color(color).setOpacity(0).get('rgba') as any],
            ],
          };

          return {
            ...baseSeriesOpts,
            ...s,
            fillColor: s.type?.includes('area') ? fill : undefined,
          };
        }
      );

      setChartOptions((prev) => ({
        ...prev,
        series: styled as any,
      }));
    }, [apiData]);

    /** Export helpers */
    const exportPNG = () => {
      chartRef.current?.chart.exportChart({ type: 'image/png' });
    };
    const exportCSV = () => {
      chartRef.current?.chart.downloadCSV();
    };

    useEffect(() => {
      if (onExportReady) onExportReady({ exportPNG, exportCSV });
    }, [onExportReady]);

    return (
      <div ref={containerRef}>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={ref || chartRef}
        />
      </div>
    );
  }
);

export default AreaspineGraph;
