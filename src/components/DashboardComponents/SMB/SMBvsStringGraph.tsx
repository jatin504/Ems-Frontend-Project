import React, { useMemo, useState } from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import HeatmapChart from "../../Graphs/RevampCharts/Heatmapchart";
import GraphLayout from "../../Layouts/WidgetsLayout/GraphsLayout/GraphLayout";

type MetricType = "Power" | "Voltage";

const SMBvsStringGraph: React.FC = () => {
  const metricOptions = [
    { label: "SMB Power (kW)", value: "Power" },
    { label: "SMB Voltage (V)", value: "Voltage" },
  ];

  const [metric, setMetric] = useState<MetricType>("Power");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const axisLabelColor = useColorModeValue("#062D59", "#E2E8F0");
  const tooltipBgColor = useColorModeValue("#FFFFFF", "#2D3748");
  const tooltipTextColor = useColorModeValue("#1A202C", "#F7FAFC");

  // Dummy heatmap data generator
  const currentHeatmapData = useMemo(() => {
    const numSMBs = 12; // rows
    const numTimes = 24; // columns (hours)
    const yAxisCategories = Array.from({ length: numSMBs }).map((_, i) => `SMB_${i + 1}`);
    const xAxisCategories = Array.from({ length: numTimes }).map((i) =>
      `${String(i + 1).padStart(2, "0")}:00`
    );

    const data: [number, number, number][] = [];
    for (let y = 0; y < numSMBs; y++) {
      for (let x = 0; x < numTimes; x++) {
        // different ranges per metric for variety
        const value =
          metric === "Power"
            ? Math.round(20 + Math.sin((x + y) / 3) * 10 + Math.random() * 6)
            : Math.round(480 + Math.cos((x + y) / 4) * 12 + Math.random() * 8);
        data.push([x, y, value]);
      }
    }

    return {
      series: [
        {
          type: "heatmap",
          name: metric === "Power" ? "SMB Power (kW)" : "SMB Voltage (V)",
          borderWidth: 0,
          data,
        },
      ],
      xAxisCategories,
      yAxisCategories,
      lastUpdateTime: String(Date.now()),
    };
  }, [metric]);

  return (
    <GraphLayout
      title="SMB vs String Heatmap"
      titleLengthSVG={70}
      titleLengthLongSVG={1680}
      width={["100%"]}
      height={"100%"}
      fullScreen
      timeWindow={true}
      mt="2"
    >
      <VStack width={"100%"} height={"100%"} spacing={2} align="stretch">
        <HStack width={"100%"} justify={"flex-end"} mb={1}>
          <HStack>
            <Select
              isMulti={false}
              placeholder="Select Parameter"
              closeMenuOnSelect
              variant="flushed"
              focusBorderColor="#062D59"
              size="sm"
              chakraStyles={{
                valueContainer: (provided) => ({
                  ...provided,
                  fontSize: "10px",
                  width: "160px",
                }),
                control: (prov) => ({
                  ...prov,
                  height: "10px",
                  minBlockSize: "20px",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "80px",
                }),
                option: (prov) => ({
                  ...prov,
                  height: "18px",
                  fontSize: "10px",
                }),
              }}
              options={metricOptions}
              onChange={(e) => {
                const val = (e?.value as MetricType) || "Power";
                setMetric(val);
              }}
              selectedOptionColorScheme="green"
              value={metricOptions.find((option) => option.value === metric)}
            />
          </HStack>
        </HStack>

        <Box width={"100%"} flex="1" minH="180px" maxH="420px" p="4px">
          {currentHeatmapData && currentHeatmapData.series && (
            <HeatmapChart
              height={isFullscreen ? 600 : 320}
              apiData={currentHeatmapData.series}
              isFullscreen={isFullscreen}
              onFullscreenChange={setIsFullscreen}
              props={{
                xAxis: {
                  type: "category",
                  categories: currentHeatmapData.xAxisCategories,
                  labels: { style: { color: axisLabelColor, fontSize: "9px" } },
                },
                yAxis: {
                  title: null,
                  categories: currentHeatmapData.yAxisCategories,
                  labels: { style: { color: axisLabelColor, fontSize: "9px" } },
                  min: 0,
                  max: isFullscreen ? currentHeatmapData.yAxisCategories.length - 1 : 9,
                },
                tooltip: {
                  backgroundColor: tooltipBgColor,
                  style: { color: tooltipTextColor, fontSize: "11px" },
                  formatter: function (this: any) {
                    const smb = this.series.yAxis.categories[this.point.y];
                    const time = currentHeatmapData.xAxisCategories[this.point.x] || "";
                    const unit = metric === "Power" ? "kW" : "V";
                    return `<b>${smb}</b><br>${time} : <b>${this.point.value} ${unit}</b>`;
                  },
                },
              }}
            />
          )}
        </Box>
      </VStack>
    </GraphLayout>
  );
};

export default SMBvsStringGraph;