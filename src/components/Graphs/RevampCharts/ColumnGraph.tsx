import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import HighchartsFullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import '../../../App.css';
import { Button } from '@chakra-ui/react';
import type { ExportFunctions } from '../../../types/graphExport/export';
import { EnlargeHeight } from '../../../Services/EnlargeWidget';

Highcharts3D(Highcharts); // Initialize the 3D module
HighchartsFullScreen(Highcharts);
//  init exporting module
exporting(Highcharts);
exportData(Highcharts);

interface ColumnGraphProps {
  apiData?: Object[];
  height?: Number | string;
  bg?: string;
  category?: string[];
  legendHeight?: number;
  xAxisInterval?: number | string;
  props?: any;
  isFullscreen?: boolean;
  fullscreenHeightOffset?: number;
  onExportReady? : (functions : ExportFunctions) => void;
  inFullScreen? : (mode : boolean) => void;
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({ apiData, height = 280, bg, category, legendHeight = 40, xAxisInterval = "auto", props, isFullscreen = false, fullscreenHeightOffset = 120, inFullScreen, onExportReady }) => {
  // console.log("FULL", isFullscreen)
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [isDark, setIsDark] = useState(false);

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


  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'column',
      backgroundColor: bg || "transparent",
      height: height,
      // options3d: {
      //   enabled: true,
      //   alpha: 7, // Adjust this to control the tilt
      //   beta: 0,  // Adjust this to control the rotation
      //   depth: 0, // Adjust this to control the depth of the bars
      //   // viewDistance: 25
      // },
      style: {
        fontFamily: 'Montserrat, sans-serif',
        color: "#062D59",
        fontSize : isFullscreen ? EnlargeHeight(10) : 9
      },
      plotBorderWidth: 1,
      plotBorderColor: '#DFDFDF',
      plotBorderDashStyle: 'Dash',
      className : "dashed-border"
    },
    title: {
      text: null
    },
    series: [] as Object[],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        pointWidth: 7,
        pointPadding: 0,
        borderRadius : 0
        // borderWidth : 1,
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      symbolShape: 'square', // Keep this for other chart types, but it won't be applied to column chart symbols
      symbolHeight: 0,
      symbolWidth: 0,
      useHTML: true, // Allow HTML rendering for custom symbols
      itemStyle: {
        overflow: "auto",
        color: '#062D59',
        fontSize: '12px',
      },
      maxHeight: legendHeight,
      labelFormatter: function (this : any) {
        // Create a custom square legend symbol with the background color of each series
        // Here we avoid using the default circle symbol
        return '<span style="width: 10px; height: 10px; display: inline-block; background-color: ' + this.color + '; border-radius: 0;"></span> ' + this.name;
      },  
    },    
    tooltip: {
      shared: true,
      backgroundColor: tooltipBg,
      style: { 
            color: tooltipTextColor, 
            fontSize: '12px' // Set the font size here
        },
      formatter: function (this : any) {
        var points = this.points.map(function (point : any) {
          let s = '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toFixed(2) + '</b>';
          if (point.series.state === 'hover') {
            s += ' <span style="color:#38a169;font-weight:600">(Selected)</span>';
          }
          return s;
        });
        return points.join('<br/>');
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        enabled: true,
        tickInterval: xAxisInterval,
        style: {
          color: '#062D59',
          fontSize: '12px'
        },
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: gridColor,
      gridLineWidth: 1, // Ensure grid line width is set
      tickLength: 0,
      lineColor : lineColor,
      dateTimeLabelFormats: {
        month: '%b %y', // Custom format for months
        year: '%Y' // Format for years if needed
      },
    },
    yAxis: {
      title: {
        text: null
      },
      className: 'dashed-border',
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      tickAmount: !isFullscreen ? 6 : 10,
      lineWidth : 2,
      // lineDashStyle: 'Dash',
      gridLineColor: gridColor,
      lineColor : lineColor,
      labels: {
        style: {
          color: '#062D59',
          fontSize: '12px'
        }
      },
    },
    exporting: {
      enabled: false,
      buttons: {
        contextButton: {
          menuItems: [
            'downloadJPEG', // Allow JPEG export
            'separator',
            'downloadCSV'   // Allow CSV export
          ]
        }
      }
    },
    credits: {
      enabled: false
    }
  });

  // Adjust chart height based on full-screen state
  useEffect(() => {
    // Mode Selection in Widget
    if(inFullScreen) {
      inFullScreen(isFullscreen)
    };

    const updateHeight = () => {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          height: isFullscreen ? window.innerHeight - fullscreenHeightOffset : height
        }
      }));
    };
    updateHeight();
    if (isFullscreen) window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [isFullscreen, height, fullscreenHeightOffset]);


  useEffect(() => {
    if (apiData) {
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: apiData,
        ...props
      }));

      if (category) {
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          xAxis: {
            ...prevOptions.xAxis,
            categories: category
          }
        }));
      }
    }
  }, [apiData, category, props]);

  // Export PNG function
    const exportPNG = () => {
      chartRef.current?.chart.exportChart(
        { type: 'image/png', filename: 'chart-png' }, // Exporting options
        {} // Chart options (no changes)
      );
    };
  
    // Export CSV function
    const exportCSV = () => {
      chartRef.current?.chart.downloadCSV();
    };
  
    // Pass export functions to parent when ready
    useEffect(() => {
      if (onExportReady) {
        onExportReady({ exportPNG, exportCSV });
      }
    }, [onExportReady]);

  // Show all / Hide all logic
  const [areAllHidden, setAreAllHidden] = useState(false);
  const legendOffset = 12;
  const buttonOffset = 40;

  const handleHideAll = () => {
    if (!chartRef.current) return;
    chartRef.current.chart.series.forEach((s: any) => {
      if (s.visible) s.setVisible(false, false);
    });
    chartRef.current.chart.redraw();
    setAreAllHidden(true);
  };

  const handleShowAll = () => {
    if (!chartRef.current) return;
    chartRef.current.chart.series.forEach((s: any) => {
      if (!s.visible) s.setVisible(true, false);
    });
    chartRef.current.chart.redraw();
    setAreAllHidden(false);
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Use Chakra UI Button for consistent style with SplineGraph */}
        <Button
          size="xs"
          variant="ghost"
          position="absolute"
          left={`${legendOffset}px`}
          bottom={`-${buttonOffset}px`}
          zIndex={0}
          onClick={handleShowAll}
          style={{ marginBottom: `${legendHeight || 40}px`, color: '#222' }}
          disabled={areAllHidden}
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
          style={{ marginBottom: `${legendHeight || 40}px`, color: '#222' }}
          disabled={!areAllHidden}
        >
          Hide all
        </Button>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chartRef} />
      </div>
    </>
  );
}

export default ColumnGraph;

