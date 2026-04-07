import { useEffect, useState, useMemo } from "react";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import AreaspineGraph from "../../Graphs/RevampCharts/AreasplineGraph";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";
import { useColorModeValue, Box } from "@chakra-ui/react";
import type { ExportFunctions } from "../../../../types/graphExport/export";

// ---- STATIC DUMMY DATA (IMAGE MATCH) ----
const dummySeries = [
  {
    type: "areaspline" as const,
    name: "PR (%)",
    data: [
      [Date.UTC(2024, 0, 1), 74],
      [Date.UTC(2024, 1, 1), 72],
      [Date.UTC(2024, 2, 1), 76],
      [Date.UTC(2024, 3, 1), 74],
      [Date.UTC(2024, 4, 1), 79],
      [Date.UTC(2024, 5, 1), 78],
      [Date.UTC(2024, 6, 1), 75],
      [Date.UTC(2024, 7, 1), 71],
      [Date.UTC(2024, 8, 1), 73],
    ],
    marker: { enabled: true },
    color: "#4299E1",
    fillOpacity: 0.2,
  },
];

const SeasonalPR = () => {
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

  const goPrevDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const goNextDay = () => {
    if (isToday) return;
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

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

  return (
    <GraphLayout
      title={
        <Box display="flex" alignItems="center" w="100%" justifyContent="space-between">
          <Box fontWeight="600" fontSize="13px" whiteSpace="nowrap">Seasonal PR Benchmark</Box>

          <Box
            display="flex"
            ml="30px"
            alignItems="center"
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="6px"
            px={2}
            height="20px"
            gap={2}
          >
            <Box cursor="pointer" fontSize="11px" onClick={goPrevDay}>
              ‹
            </Box>

            <Box fontSize="10px" fontWeight="600" minW="78px" textAlign="center">
              {formattedDate}
            </Box>

            <Box
              cursor={isToday ? "not-allowed" : "pointer"}
              opacity={isToday ? 0.35 : 1}
              fontSize="11px"
              onClick={goNextDay}
            >
              ›
            </Box>
          </Box>
        </Box>
      }
      width={["100%"]}
      height="350px"
      fullScreen
      timeWindow
      onTimeWindowChange={handleTimeWindowChange}
      onReset={handleReset}
      onExport={exportFunctions}
      WidgetProps={{
        sx: {
          'button[aria-label="Options"] svg': {
            width: '20px',
            height: '20px',
          },
          'button[aria-label="Options"]': {
            padding: '2px',
          },
          'span > svg': {
            width: '20px',
            height: '20px',
          },
        },
      }}
    >
      <Box width="100%" height="100%">
        <AreaspineGraph
          apiData={dummySeries}
          height={170}
          onExportReady={setExportFunctions}
          props={{
            plotOptions: {
              series: {
                lineWidth: 2,
                marker: {
                  enabled: true,
                  radius: 4,
                },
              },
            },

            yAxis: {
              min: 60,
              max: 85,
              tickAmount: 5,
              tickPositions: [60, 65, 70, 75, 80, 85],
              title: { text: null },
              labels: {
                style: { fontSize: '11px' },
                formatter(this: any): string {
                  return this.value + "%";
                },
              },
            },

            xAxis: {
              type: "datetime",
              labels: {
                style: { fontSize: '11px' },
                formatter(this: any): string {
                  return new Date(this.value).toLocaleString("en-US", {
                    month: "short",
                  });
                },
              },
              tickInterval: 30 * 24 * 3600 * 1000,
            },

            legend: {
              enabled: false,
            },
          }}
        />

        {/* ---- DIVIDER LINE ---- */}
        <Box
          width="100%"
          height="1px"
          mt="8px"
          bg={useColorModeValue("gray.200", "gray.600")}
        />

        <Box px="10px" pb="8px">
          {/* Date */}
          <Box
            textAlign="center"
            fontSize="11px"
            color="gray.500"
            mb="6px"
          >
            Jan 8 2024
          </Box>

          {/* ROW ITEM */}
          {[
            {
              name: "Generation",
              value: "25.5 MWh",
              color: "#4A90E2",
              width: "80%",
            },
            {
              name: "Export",
              value: "11.8 MWh",
              color: "#38A169",
              width: "60%",
            },
            {
              name: "AuxLoss",
              value: "0.3 MWh",
              color: "#3182CE",
              width: "20%",
            },
            {
              name: "Transmission",
              value: "0.4 MWh",
              color: "#DD6B20",
              width: "25%",
            },
          ].map((item, i) => (
            <Box key={i} mb="6px">
              <Box display="flex" alignItems="center" gap="6px">
                {/* Left Label */}
                <Box
                  fontSize="12px"
                  minW="90px"
                  color="gray.600"
                  fontWeight="500"
                >
                  {item.name}
                </Box>

                {/* Progress Bar */}
                <Box flex="1" height="6px" bg="gray.200" borderRadius="4px">
                  <Box
                    height="100%"
                    width={item.width}
                    bg={item.color}
                    borderRadius="4px"
                  />
                </Box>

                {/* Value */}
                <Box
                  fontSize="12px"
                  minW="70px"
                  textAlign="right"
                  color="gray.600"
                  fontWeight="500"
                >
                  {item.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </GraphLayout>
  );
};

export default SeasonalPR;