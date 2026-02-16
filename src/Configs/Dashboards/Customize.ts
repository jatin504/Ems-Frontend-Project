export const energyDashboardConfig = [
  {
    id: "ess-power",
    title: "ESS Power",
    type: "line",
    component: "LineGraph",
    dataKey: "essPowerData", // maps to API response
    props: {
      height: 300,
      xAxisInterval: 1000 * 60 * 60,
      chartProps: {
        chart: {
          zoomType: 'x',
          style: {
            fontFamily: 'Montserrat, sans-serif',
            color: "#062D59"
          },
          plotBorderWidth: 0,
          plotBorderColor: '#DFDFDF',
          plotBorderDashStyle: 'Dash',
        },
        title: { text: '' },
        xAxis: {
          type: 'datetime',
          crosshair: true,
          labels: { enabled: true, style: { color: '#062D59', fontSize: '12px' } },
          dateTimeLabelFormats: { month: '%b %y', year: '%Y' },
          tickLength: 0,
          lineColor: "rgba(0,0,0,0.5)",
        },
        yAxis: {
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: '#DFDFDF',
        }
      }
    },
    layout: {
      i: "ess-power", // unique ID (same as widget id)
      x: 0,
      y: 0,
      w: 6,
      h: 4
    },
    exportEnabled: true
  },
  {
    id: "energy-yield",
    title: "Energy Yield",
    type: "column",
    component: "ColumnGraph",
    dataKey: "columnLineData",
    props: {
      height: 300
    },
    layout: {
      i: "energy-yield",
      x: 6,
      y: 10,
      w: 6,
      h: 4
    },
    exportEnabled: true
  }
];

// Default layout (used if no saved layout)
export const getDefaultLayout = () =>
  energyDashboardConfig.map(widget => widget.layout);