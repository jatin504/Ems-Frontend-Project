import { useEffect, useState, useMemo } from "react";
import { useTimeHandle } from "../../../../Services/TimeWindowSetting";
import AreasplineGraph from "../../../Graphs/RevampCharts/AreasplineGraph";
import GraphLayout from "../../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import useCloudDetectionData from "../../../../hooks/useCloudDetectionData";
import { useCloudConfig } from "../../../../hooks/useCloudConfig";
import { useColorModeValue, Box } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../../types/graphExport/export";

const CloudDetectionGraph = () => {
  const {
    config: timeWindowPowerCurve,
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
        type: "last",
        relativeType: "currentDaySoFar",
        interval: 12,
        intervalType: "hour",
      },
    }
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateNavEnabled, setDateNavEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFs = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

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
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    handleTimeWindowChange({
      aggregation: timeWindowPowerCurve.aggregation,
      orderBy: timeWindowPowerCurve.orderBy,
      timeRange:{
        type:"absolute",
        startTs:start.getTime(),
        endTs:end.getTime()
      }
    });
  };

  const goPrevDay = () => {
    setCurrentDate(prev=>{
      const d = new Date(prev);
      d.setDate(d.getDate()-1);
      applyAbsoluteDay(d);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;

    setCurrentDate(prev=>{
      const d = new Date(prev);
      d.setDate(d.getDate()+1);

      const today = new Date();

      const reachedToday =
        d.getFullYear()===today.getFullYear() &&
        d.getMonth()===today.getMonth() &&
        d.getDate()===today.getDate();

      if(reachedToday){
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
        patterns: [],
        ids: ["plant_1_pcs_2_bank_bank_11"],
      },
      keys: [
        {
          key: "active_power",
          alias: "EAST",
          keyType: "common",
        },
        {
          key: "soc",
          alias: "WEST",
          keyType: "common",
        },
        {
          key: "bcu_1_energy_discharged_today",
          alias: "CENTER",
          keyType: "common",
        },
      ],
      aggregation: timeWindowPowerCurve.aggregation,
      timeRange: timeWindowPowerCurve.timeRange,
      orderBy: (timeWindowPowerCurve.orderBy as "ASC" | "DESC"),
    },
  };

  const { data, fetchData } = useTimeseriesData();
  const { apiData } = useCloudDetectionData(currentDate);
  const { windows, fetchData: fetchCloudConfig } = useCloudConfig();

  console.log("windows FINAL:", windows);

  useEffect(() => {
    fetchData(fetchingToServerObj.dataSource);
  }, [timeWindowPowerCurve]);

  useEffect(() => {
    fetchCloudConfig();
  }, []);

  // ---- STAGE COLOR MAP ----
  const stageColorMap: any = {
    early_warning: "#FFA500",      // orange
    confirmed_cloud: "#007BFF",    // blue
    stronger_signal: "#FF0000",    // red
  };

  // ---- TRANSFORM API DATA ----
  const seriesForChart = useMemo(() => {
    if (!data || !apiData) return [];

    const series: any[] = [];

    Object.values(data).forEach((deviceObj: any) => {
      if (deviceObj && typeof deviceObj === "object") {

        Object.entries(deviceObj).forEach(([metric, points]: any) => {
          if (!Array.isArray(points)) return;

          const stageBuckets: any = {
            early_warning: [],
            confirmed_cloud: [],
            stronger_signal: [],
          };

          //  LOOP ON CLOUD DATA (NOT TIMESERIES)
          apiData.forEach((stageRow: any) => {
            const ts = stageRow.time_stamp;
            const stageName = stageRow.stage_name;

            //  nearest value from timeseries
            let closestPoint = points[0];
            let minDiff = Math.abs(points[0].ts - ts);

            for (let i = 1; i < points.length; i++) {
              const diff = Math.abs(points[i].ts - ts);
              if (diff < minDiff) {
                minDiff = diff;
                closestPoint = points[i];
              }
            }

            if (stageBuckets[stageName]) {
              stageBuckets[stageName].push([
                ts, //  cloud timestamp use ho raha
                Number(closestPoint.value),
              ]);
            }
          });

          Object.keys(stageBuckets).forEach((stageName) => {
            if (stageBuckets[stageName].length > 0) {
              series.push({
                type: "areaspline",
                name: `${metric} - ${stageName}`,
                data: stageBuckets[stageName],
                color: stageColorMap[stageName],
                lineColor: stageColorMap[stageName],
              });
            }
          });
        });
      }
    });

    return series;
  }, [data, apiData]);

  const thresholdSeries = useMemo(() => {
    if (!windows || windows.length === 0) return [];

    const colorMap: any = {
      center: "#00FFFF",
      east: "#00FF00",
      west: "#FF00FF",
    };

    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(currentDate);
    end.setHours(23, 59, 59, 999);

    //  FIX: generate timestamps manually (no dependency)
    const points: number[] = [];
    const step = 5 * 60 * 1000; // 5 min

    for (let t = start.getTime(); t <= end.getTime(); t += step) {
      points.push(t);
    }

    return windows.map((w: any) => {
      const name = w.name.toLowerCase();

      return {
        type: "line",
        name: `${w.name} Threshold`,
        yAxis: 1,
        dashStyle: "Dash",
        color: colorMap[name] || "#999",
        lineWidth: 2,

        custom: w, //  ADD THIS

        marker: {
          enabled: false,
        },

        //  ALWAYS VISIBLE LINE
        data: points.map((ts) => ({
          x: ts,
          y: Number(w.midday),
        })),
      };
    });
  }, [windows, currentDate]);

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

  const thresholdValues =
    windows.length > 0
      ? windows.flatMap((w: any) => [
          Number(w.morning),
          Number(w.midday),
          Number(w.evening),
        ])
      : [0];

  const minT = Math.min(...thresholdValues);
  const maxT = Math.max(...thresholdValues);

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%">

          <Box fontWeight="600">Analysis</Box>

          <Box ml={isFullScreen ? "580" : "28"}
            mr={isFullScreen ? "580" : "28"}
            display="flex"
            alignItems="center"
            bg={useColorModeValue("gray.100","gray.700")}
            borderRadius="6px"
            px={2}
            height="22px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="12px" onClick={goPrevDay}>‹</Box>

            <Box fontSize="11px" fontWeight="600" minW="78px" textAlign="center">
              {formattedDate}
            </Box>

            <Box
              cursor={isToday ? "not-allowed" : "pointer"}
              opacity={isToday ? 0.35 : 1}
              fontSize="12px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>

        </Box>
      }
      
      width={["578px"]}
      height="344px"
      fullScreen
      timeWindow={false}
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
    >
      <AreasplineGraph
        apiData={[...seriesForChart, ...thresholdSeries]}
        height={280}
        onExportReady={setExportFunctions}
        enableMultiAxis={true}
        props={{
          chart: {
            events: {
              mouseOut() {
                // hover stuck fix (hard reset)
                (this as any).series.forEach((s: any) => {
                  s.setState("", true);
                });
              },
            },
          },

          plotOptions: {
            series: {
              shadow: false,
              lineWidth: 2,

              fillOpacity: 0,   

              enableMouseTracking: true,
              states: {
                hover: {
                  enabled: false,   //  hover glow band
                },
                inactive: {
                  opacity: 1, // cursor hatate hi sab normal
                },
              },

              marker: {
                enabled: true,
                radius: 4,
                lineWidth: 2,
                states: {
                  hover: {
                    enabled: false,
                  },
                },
              },
            },
          },

          yAxis: [
            {
              tickAmount: 6,
              title: { text: null },
              labels: {
                style: { color: textColor },
                formatter(this: any) {
                  return (this.value as number).toFixed(2);
                },
              },
              gridLineColor: gridColor,
            },
            {
              tickAmount: 6,
              title: { text: "" },
              labels: {
                style: { color: textColor },
                formatter(this: any) {
                  return (this.value as number).toFixed(3);
                },
              },
              opposite: true, 
              gridLineWidth: 0,

              min: minT - 0.01,
              max: maxT + 0.01,
            },
          ],

          xAxis: {
            type: "datetime",

            labels: {
              style: { color: subTextColor },
              formatter(this: any) {
                const date = new Date(this.value);

                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");

                return `${hours}:${minutes}`;
              },
            },

            crosshair: false,
            lineColor: axisLineColor,
            gridLineColor: gridColor,
            gridLineDashStyle: "ShortDot",
            gridLineWidth: 1,
          },

          tooltip: {
            shared: true,
            useHTML: true,
            stickOnContact: false,   

            formatter: function (this: any) {
              let s = `<b>${new Date((this as any).x).toLocaleString()}</b><br/>`;

              ((this as any).points as any[]).forEach((point: any) => {
                const name = point.series.name;

                //  threshold detect
                if (name.includes("Threshold")) {
                  const w = point.series.userOptions.custom;

                  if (w) {
                    s += `<span style="color:${point.color}">●</span> ${name}<br/>
                          Morning: ${w.morning}<br/>
                          Midday: ${w.midday}<br/>
                          Evening: ${w.evening}<br/>`;
                  }
                } else {
                  s += `<span style="color:${point.color}">●</span> ${name}: ${point.y}<br/>`;
                }
              });

              return s;
            },
          },

          legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            itemStyle: { color: textColor },
          },
        }}
      />
    </GraphLayout>
  );
};

export default CloudDetectionGraph;
