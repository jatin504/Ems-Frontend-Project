import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { EnlargeHeight } from '../../../Services/EnlargeWidget';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import HighchartsFullScreen from 'highcharts/modules/full-screen';
import type { ExportFunctions } from '../../../types/graphExport/export';
import { Box, Button } from '@chakra-ui/react';

HighchartsFullScreen(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

interface SplineGraphProps {
  apiData?: Object[];
  height?: number | string;
  bg?: string;
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  onExportReady?: (functions: ExportFunctions) => void;
  inFullScreen?: (mode: boolean) => void;
}

const SplineGraph = React.forwardRef<HighchartsReact.RefObject, SplineGraphProps>(
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
    },
    ref
  ) => {
    // store actual Highcharts.Chart instance
    const chartRef = useRef<Highcharts.Chart | null>(null);
    const [isDark, setIsDark] = useState(false);
    const [areAllHidden, setAreAllHidden] = useState(false);

    // 🔹 Detect theme from Chakra's color mode
    useEffect(() => {
      const detectTheme = () => {
        const chakraColorMode = localStorage.getItem('chakra-ui-color-mode');
        setIsDark(chakraColorMode === 'dark');
      };

      detectTheme();

      window.addEventListener('storage', detectTheme);
      const observer = new MutationObserver(detectTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'class'],
      });

      return () => {
        window.removeEventListener('storage', detectTheme);
        observer.disconnect();
      };
    }, []);

    // 🔹 Theme-aware styles
    const axisLabelStyle = {
      color: isDark ? '#E6E6E6' : '#1A202C',
      fontSize: '12px' as const,
    };
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)';
    const lineColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.16)';
    const legendColor = isDark ? '#E6E6E6' : '#1A202C';
    const tooltipBg = isDark ? 'rgba(24,24,27,0.95)' : '#ffffff';
    const tooltipTextColor = isDark ? '#fff' : '#1A202C';

    // Highlight logic (used only for opacity dimming)
    const [selectedSeries, setSelectedSeries] = useState<number | null>(null);

    const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
      chart: {
        type: 'spline',
        backgroundColor: bg || 'transparent',
        height: height as number,
        zoomType: 'x',
        style: { fontFamily: 'Inter, Montserrat, sans-serif' },
        spacingTop: 8,
        spacingRight: 12,
        className: 'rounded-lg',
      } as any,
      title: { text: '' },
      credits: { enabled: false },

      xAxis: {
        type: 'datetime',
        crosshair: { color: 'rgba(255,255,255,0.15)', width: 1 },
        tickInterval: xAxisInterval as number,
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: gridColor,
        gridLineDashStyle: 'ShortDot',
        lineColor: lineColor,
        labels: { enabled: true, style: axisLabelStyle },
      },

      yAxis: {
        title: { text: '' },
        gridLineColor: gridColor,
        gridLineDashStyle: 'ShortDot',
        tickLength: 0,
        labels: { style: axisLabelStyle },
      },

      legend: {
        align: 'left',
        verticalAlign: 'bottom',
        floating: false,
        maxHeight: legendHeight,
        useHTML: true,
        itemStyle: { color: legendColor, fontSize: '12px' },
        symbolHeight: 0,
        symbolWidth: 0,
        navigation: { enabled: true },
      },

      // ✅ TOOLTIP FIXED HERE
      tooltip: {
        enabled: true,
        shared: true,
        backgroundColor: tooltipBg,
        style: { color: tooltipTextColor, fontSize: '12px' },
        valueDecimals: 2,
        formatter: function () {
          let s = `<b>${Highcharts.dateFormat(
            '%A, %b %e, %Y %H:%M',
            this.x
          )}</b><br/>`;

          if (this.points) {
            this.points.forEach((point) => {
              s += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y.toFixed(2)}</b>`;

              // ✅ Highcharts internal hover state
              if (point.series.state === 'hover') {
                s +=
                  ' <span style="color:#38a169;font-weight:600">(Selected)</span>';
              }

              s += '<br/>';
            });
          }
          return s;
        },
      },

      plotOptions: {
        series: {
          cursor: 'pointer',
          animation: { duration: 300 },
          events: {
            mouseOver: function () {
              const idx = this.chart.series.indexOf(this);
              setSelectedSeries(idx);
            },
            mouseOut: function () {
              setSelectedSeries(null);
            },
          },
          states: {
            hover: {
              lineWidth: 2,
              lineWidthPlus: 0,
              shadow: false,
              halo: { size: 0 },
            },
          },
        },
        spline: {
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 4,
            lineWidth: 0,
          },
          states: {
            hover: {
              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 0,
              },
              lineWidth: 2,
              lineWidthPlus: 0,
              shadow: false,
              halo: { size: 0 },
            },
          },
        },
      },

      series:
        ((apiData as any[]) || []).map((s, i) =>
          selectedSeries === null
            ? s
            : {
                ...s,
                opacity: selectedSeries === i ? 1 : 0.2,
                zIndex: selectedSeries === i ? 10 : 1,
              }
        ),

      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            enabled: false,
          },
        },
      },
    });

    // fullscreen height handling
    useEffect(() => {
      if (inFullScreen) inFullScreen(isFullscreen);

      const newHeight = isFullscreen ? EnlargeHeight(770) : height;
      setChartOptions((prev) => ({
        ...prev,
        chart: { ...prev.chart, height: newHeight },
      }));
    }, [isFullscreen, height]);

    // apply external props
    useEffect(() => {
      if (props) {
        setChartOptions((prev) => ({
          ...prev,
          ...(props || {}),
        }));
      }
    }, [props]);

    // update series + dimming
    useEffect(() => {
      setChartOptions((prev) => ({
        ...prev,
        series:
          ((apiData as any[]) || []).map((s, i) =>
            selectedSeries === null
              ? s
              : {
                  ...s,
                  opacity: selectedSeries === i ? 1 : 0.2,
                  zIndex: selectedSeries === i ? 10 : 1,
                }
          ),
      }));
    }, [apiData, selectedSeries]);

    // 🔹 Show / Hide handlers
    const handleHideAll = () => {
      if (!chartRef.current) return;

      chartRef.current.series.forEach((s) => {
        if (s.visible) s.setVisible(false, false);
      });

      chartRef.current.redraw();
      setAreAllHidden(true);
    };

    const handleShowAll = () => {
      if (!chartRef.current) return;

      chartRef.current.series.forEach((s) => {
        if (!s.visible) s.setVisible(true, false);
      });

      chartRef.current.redraw();
      setAreAllHidden(false);
    };

    const legendOffset = 12;
    const buttonOffset = 40;

    return (
      <Box position="relative">
        <Button
          size="xs"
          variant="ghost"
          position="absolute"
          left={`${legendOffset}px`}
          bottom={`-${buttonOffset}px`}
          zIndex={0}
          onClick={handleShowAll}
          style={{ marginBottom: `${legendHeight || 45}px` }}
          disabled={!areAllHidden}
        >
          Show all
        </Button>

        <Button
          size="xs"
          variant="ghost"
          position="absolute"
          right={`${legendOffset}px`}
          bottom={`-${buttonOffset}px`}
          zIndex={0}
          onClick={handleHideAll}
          style={{ marginBottom: `${legendHeight || 45}px` }}
          disabled={areAllHidden}
        >
          Hide all
        </Button>

        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={ref}
          callback={(chart) => {
            chartRef.current = chart;

            onExportReady?.({
              exportPNG: () =>
                chart.exportChart({
                  type: 'image/png',
                  filename: 'chart',
                }),
              exportCSV: () => chart.downloadCSV(),
            });
          }}
        />
      </Box>
    );
  }
);

export default SplineGraph;
