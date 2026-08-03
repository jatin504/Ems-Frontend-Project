import { useEffect, useState, useMemo } from "react";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import SplineGraph from "../../../Graphs/RevampCharts/SplineGraph";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useColorModeValue, Box } from "@chakra-ui/react";
import useDateFormatterMargin from "../../../DateFormatter";
import type { ExportFunctions } from "../../../../types/graphExport/export";
interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}
const AvailabilityChart = () => {
  const {
    config: timeWindowAvailability,
    handleTimeWindowChange,
    handleReset,
  } = useTimeHandle(
    12,
    "hour",
    "last",
    [1, "day"],
    60000,
    {
      timeRange: {
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 7,
        intervalType: "day",
      },
    }
  );

  const [currentDate, setCurrentDate] = useState(new Date());

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

  const applyAbsoluteDay = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    handleTimeWindowChange({
      aggregation: timeWindowAvailability.aggregation,
      orderBy: timeWindowAvailability.orderBy,

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

  const fetchingToServerObj = {
    dataSource: {
      devices: {
        patterns: ["_inverter_inverter_"],
        ids: [],
      },

      keys: [
        {
          key: "inv_availability",
          alias: "Availability (%)",
          keyType: "common",
        },
      ],

      aggregation: timeWindowAvailability.aggregation,
      timeRange: timeWindowAvailability.timeRange,
      orderBy: "ASC" as const,
    },
  };

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource);
  }, [timeWindowAvailability]);

  const COLORS = [
    "#ef4444","#f97316","#f59e0b","#84cc16","#10b981",
    "#06b6d4","#3b82f6","#6366f1","#a855f7","#ec4899",
  ];

  // ---- TRANSFORM API DATA ----
  const seriesForChart = useMemo(()=>{
      const widgetData = data as WidgetData | null;
      if(!widgetData) return [];
  
      const series:any[]=[];
  
      Object.keys(widgetData).forEach(deviceId=>{
  
        const pts = widgetData[deviceId]?.["Availability (%)"];
        if(!pts?.length) return;
  
        const suf = deviceId.match(/_(\d+)$/)?.[1] || deviceId;
  
        const colorIndex =
          !isNaN(Number(suf))
            ? (parseInt(suf)-1)%COLORS.length
            : series.length%COLORS.length;
  
        series.push({
          type:"spline",
          name:`Availability (%)-${suf}`,
          data: pts.map(p=>[p.ts,p.value]),
          marker:{enabled:true},
          color:COLORS[colorIndex]
        });
      });
  
      return series;
    },[data]);

  const textColor = useColorModeValue("#1A202C", "#E6E6E6");

  const subTextColor = useColorModeValue(
    "#4A5568",
    "#B9B9B9"
  );

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

  const dateFormatterMargin = useDateFormatterMargin({
    fullScreenMargin: "830",
    normalMargin: "18",
  });

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">
          <Box fontWeight="600">
            Availability
          </Box>
            
        </Box>
      }
      width={["598px"]}
      height="314px"
      fullScreen
      timeWindow={false}
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <SplineGraph
        apiData={seriesForChart}
        height={250}
        onExportReady={setExportFunctions}
        props={{
          chart: {
            backgroundColor: "transparent",

            events: {
              mouseOut: function (this: any) {
                this.series.forEach((s: any) => {
                  s.setState("", true);
                });
              },
            },
          },

          plotOptions: {
            series: {
              shadow: false,
              lineWidth: 3,

              states: {
                inactive: {
                  opacity: 1,
                },

                hover: {
                  enabled: true,
                  lineWidth: 3,
                },
              },

              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                lineColor: "#FFFFFF",
              },
            },
          },

          yAxis: {
            min: 0,
            max: 100,
            tickAmount: 5,

            title: {
              text: null,
            },

            labels: {
              style: {
                color: textColor,
              },

              formatter(this: any) {
                return `${this.value}%`;
              },
            },

            gridLineColor: gridColor,
          },

          xAxis: {
            type: "datetime",

            crosshair: {
              color: "rgba(255,255,255,0.15)",
              width: 1,
            },

            labels: {
              style: {
                color: subTextColor,
              },
            },

            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },

          tooltip: {
            shared: true,
            hideDelay: 0,

            backgroundColor: useColorModeValue(
              "#fff",
              "rgba(24,24,27,0.95)"
            ),

            style: {
              color: textColor,
            },

            valueSuffix: "%",
            valueDecimals: 2,
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",

            itemStyle: {
              color: textColor,
            },
          },

          colors: ["#00C48C"],
        }}
      />
    </GraphLayout>
  );
};

export default AvailabilityChart;